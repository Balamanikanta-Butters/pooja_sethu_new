const db = require('../config/db');

const SESSION_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const MAX_PAGE_PATH_LENGTH = 300;
const MAX_PAGE_NAME_LENGTH = 120;

function sessionIdFromRequest(req, res) {
    const { sessionId } = req.params;
    if (!SESSION_ID_PATTERN.test(sessionId)) {
        res.status(400).json({ success: false, message: 'A valid session ID is required.' });
        return null;
    }
    return sessionId;
}

function validPage(pagePath, pageName) {
    return typeof pagePath === 'string'
        && pagePath.startsWith('/')
        && pagePath.length <= MAX_PAGE_PATH_LENGTH
        && typeof pageName === 'string'
        && pageName.trim().length > 0
        && pageName.length <= MAX_PAGE_NAME_LENGTH;
}

async function findOwnedSession(client, sessionId, req) {
    const result = await client.query(
        `SELECT id, user_id, mobile_number, logout_at, active_since, last_seen_at
         FROM ps.user_activity_session
         WHERE id = $1 AND mobile_number = $2
         FOR UPDATE`,
        [sessionId, req.user.mobileNumber]
    );
    return result.rows[0] || null;
}

async function closeOpenPage(client, sessionId, endAt) {
    await client.query(
        `UPDATE ps.user_page_visit
         SET exited_at = $2,
             duration_seconds = GREATEST(0, FLOOR(EXTRACT(EPOCH FROM ($2 - entered_at)))::BIGINT)
         WHERE session_id = $1 AND exited_at IS NULL`,
        [sessionId, endAt]
    );
}

async function startActivity(client, sessionId, startAt) {
    await client.query(
        `INSERT INTO ps.user_session_activity (session_id, active_started_at)
         VALUES ($1, $2)`,
        [sessionId, startAt]
    );
    await client.query(
        `UPDATE ps.user_activity_session
         SET active_since = $2, last_seen_at = $2
         WHERE id = $1`,
        [sessionId, startAt]
    );
}

async function stopActivity(client, session, endAt) {
    if (!session.active_since) return;

    const activityResult = await client.query(
        `UPDATE ps.user_session_activity
         SET active_ended_at = $2
         WHERE session_id = $1 AND active_ended_at IS NULL
         RETURNING active_started_at`,
        [session.id, endAt]
    );
    if (activityResult.rows.length === 0) {
        throw new Error(`No active analytics segment found for session ${session.id}.`);
    }

    const startedAt = activityResult.rows[0].active_started_at;
    await client.query(
        `UPDATE ps.user_activity_session
         SET active_seconds = active_seconds
               + GREATEST(
                   0,
                   FLOOR(EXTRACT(EPOCH FROM ($2::timestamptz - $3::timestamptz)))::BIGINT
                 ),
             active_since = NULL,
             last_seen_at = $2
         WHERE id = $1`,
        [session.id, endAt, startedAt]
    );
}

async function insertPageVisit(client, sessionId, pagePath, pageName) {
    await client.query(
        `INSERT INTO ps.user_page_visit (session_id, page_path, page_name)
         VALUES ($1, $2, $3)`,
        [sessionId, pagePath, pageName.trim()]
    );
}

async function withTransaction(handler) {
    const client = await db.connect();
    try {
        await client.query('BEGIN');
        const result = await handler(client);
        await client.query('COMMIT');
        return result;
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

exports.startSession = async (req, res) => {
    try {
        const session = await withTransaction(async (client) => {
            const result = await client.query(
                `INSERT INTO ps.user_activity_session
                    (user_id, mobile_number, active_since)
                 VALUES ($1, $2, NOW())
                 RETURNING id, login_at, active_since`,
                [req.user.userId || null, req.user.mobileNumber]
            );
            const createdSession = result.rows[0];
            await client.query(
                `INSERT INTO ps.user_session_activity (session_id, active_started_at)
                 VALUES ($1, $2)`,
                [createdSession.id, createdSession.active_since]
            );
            return createdSession;
        });
        res.status(201).json({ success: true, session });
    } catch (error) {
        console.error('Error starting analytics session:', error);
        res.status(500).json({ success: false, message: 'Could not record session start.' });
    }
};

exports.recordPage = async (req, res) => {
    const sessionId = sessionIdFromRequest(req, res);
    if (!sessionId) return;
    const { pagePath, pageName } = req.body;
    if (!validPage(pagePath, pageName)) {
        return res.status(400).json({ success: false, message: 'A valid page path and name are required.' });
    }

    try {
        const result = await withTransaction(async (client) => {
            const session = await findOwnedSession(client, sessionId, req);
            if (!session || session.logout_at) return { status: 404 };
            if (!session.active_since) return { status: 409 };

            const currentVisit = await client.query(
                `SELECT page_path
                 FROM ps.user_page_visit
                 WHERE session_id = $1 AND exited_at IS NULL
                 FOR UPDATE`,
                [sessionId]
            );
            if (currentVisit.rows[0]?.page_path !== pagePath) {
                await closeOpenPage(client, sessionId, new Date());
                await insertPageVisit(client, sessionId, pagePath, pageName);
            }
            await client.query(
                'UPDATE ps.user_activity_session SET last_seen_at = NOW() WHERE id = $1',
                [sessionId]
            );
            return { status: 200 };
        });
        if (result.status === 404) {
            return res.status(404).json({ success: false, message: 'Analytics session not found.' });
        }
        if (result.status === 409) {
            return res.status(409).json({ success: false, message: 'Analytics session is not active.' });
        }
        return res.json({ success: true });
    } catch (error) {
        console.error('Error recording analytics page visit:', error);
        return res.status(500).json({ success: false, message: 'Could not record page visit.' });
    }
};

exports.pauseSession = async (req, res) => {
    const sessionId = sessionIdFromRequest(req, res);
    if (!sessionId) return;

    try {
        const result = await withTransaction(async (client) => {
            const session = await findOwnedSession(client, sessionId, req);
            if (!session || session.logout_at) return { status: 404 };
            if (session.active_since) {
                const endAt = new Date();
                await closeOpenPage(client, sessionId, endAt);
                await stopActivity(client, session, endAt);
            }
            return { status: 200 };
        });
        if (result.status === 404) {
            return res.status(404).json({ success: false, message: 'Analytics session not found.' });
        }
        return res.json({ success: true });
    } catch (error) {
        console.error('Error pausing analytics session:', error);
        return res.status(500).json({ success: false, message: 'Could not pause analytics session.' });
    }
};

exports.resumeSession = async (req, res) => {
    const sessionId = sessionIdFromRequest(req, res);
    if (!sessionId) return;
    const { pagePath, pageName } = req.body;
    if (!validPage(pagePath, pageName)) {
        return res.status(400).json({ success: false, message: 'A valid page path and name are required.' });
    }

    try {
        const result = await withTransaction(async (client) => {
            const session = await findOwnedSession(client, sessionId, req);
            if (!session || session.logout_at) return { status: 404 };

            if (session.active_since) {
                const staleEnd = new Date(Math.min(
                    Date.now(),
                    new Date(session.last_seen_at).getTime() + 30000
                ));
                await closeOpenPage(client, sessionId, staleEnd);
                await stopActivity(client, session, staleEnd);
            }

            const now = new Date();
            await startActivity(client, sessionId, now);
            await insertPageVisit(client, sessionId, pagePath, pageName);
            return { status: 200 };
        });
        if (result.status === 404) {
            return res.status(404).json({ success: false, message: 'Analytics session not found.' });
        }
        return res.json({ success: true });
    } catch (error) {
        console.error('Error resuming analytics session:', error);
        return res.status(500).json({ success: false, message: 'Could not resume analytics session.' });
    }
};

exports.heartbeat = async (req, res) => {
    const sessionId = sessionIdFromRequest(req, res);
    if (!sessionId) return;

    try {
        const result = await db.query(
            `UPDATE ps.user_activity_session
             SET last_seen_at = NOW()
             WHERE id = $1 AND mobile_number = $2
               AND logout_at IS NULL AND active_since IS NOT NULL
             RETURNING id`,
            [sessionId, req.user.mobileNumber]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Active analytics session not found.' });
        }
        return res.json({ success: true });
    } catch (error) {
        console.error('Error updating analytics heartbeat:', error);
        return res.status(500).json({ success: false, message: 'Could not update analytics heartbeat.' });
    }
};

exports.endSession = async (req, res) => {
    const sessionId = sessionIdFromRequest(req, res);
    if (!sessionId) return;

    try {
        const result = await withTransaction(async (client) => {
            const session = await findOwnedSession(client, sessionId, req);
            if (!session) return { status: 404 };
            if (session.logout_at) return { status: 200 };

            const endAt = new Date();
            await closeOpenPage(client, sessionId, endAt);
            await stopActivity(client, session, endAt);
            await client.query(
                `UPDATE ps.user_activity_session
                 SET logout_at = $2, last_seen_at = $2
                 WHERE id = $1`,
                [sessionId, endAt]
            );
            return { status: 200 };
        });
        if (result.status === 404) {
            return res.status(404).json({ success: false, message: 'Analytics session not found.' });
        }
        return res.json({ success: true });
    } catch (error) {
        console.error('Error ending analytics session:', error);
        return res.status(500).json({ success: false, message: 'Could not record session end.' });
    }
};
