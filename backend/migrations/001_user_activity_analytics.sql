CREATE TABLE IF NOT EXISTS ps.user_activity_session (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    mobile_number TEXT NOT NULL,
    login_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    logout_at TIMESTAMPTZ,
    active_seconds BIGINT NOT NULL DEFAULT 0 CHECK (active_seconds >= 0),
    active_since TIMESTAMPTZ,
    last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS user_activity_session_user_login_idx
    ON ps.user_activity_session (user_id, login_at DESC);

CREATE INDEX IF NOT EXISTS user_activity_session_mobile_login_idx
    ON ps.user_activity_session (mobile_number, login_at DESC);

CREATE TABLE IF NOT EXISTS ps.user_session_activity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES ps.user_activity_session(id) ON DELETE CASCADE,
    active_started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    active_ended_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS user_session_activity_open_idx
    ON ps.user_session_activity (session_id)
    WHERE active_ended_at IS NULL;

CREATE INDEX IF NOT EXISTS user_session_activity_started_idx
    ON ps.user_session_activity (active_started_at);

CREATE TABLE IF NOT EXISTS ps.user_page_visit (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES ps.user_activity_session(id) ON DELETE CASCADE,
    page_path TEXT NOT NULL,
    page_name TEXT NOT NULL,
    entered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    exited_at TIMESTAMPTZ,
    duration_seconds BIGINT CHECK (duration_seconds IS NULL OR duration_seconds >= 0)
);

CREATE UNIQUE INDEX IF NOT EXISTS user_page_visit_open_idx
    ON ps.user_page_visit (session_id)
    WHERE exited_at IS NULL;

CREATE INDEX IF NOT EXISTS user_page_visit_session_entered_idx
    ON ps.user_page_visit (session_id, entered_at);

CREATE OR REPLACE VIEW ps.user_daily_active_duration AS
WITH activity_intervals AS (
    SELECT
        session.id AS session_id,
        session.user_id,
        session.mobile_number,
        activity.active_started_at,
        COALESCE(
            activity.active_ended_at,
            LEAST(NOW(), session.last_seen_at + INTERVAL '30 seconds')
        ) AS active_ended_at
    FROM ps.user_session_activity AS activity
    JOIN ps.user_activity_session AS session ON session.id = activity.session_id
),
daily_intervals AS (
    SELECT
        activity_intervals.session_id,
        activity_intervals.user_id,
        activity_intervals.mobile_number,
        day_start::date AS activity_date,
        GREATEST(
            0,
            EXTRACT(
                EPOCH FROM
                    LEAST(
                        activity_intervals.active_ended_at,
                        (day_start + INTERVAL '1 day') AT TIME ZONE 'Asia/Kolkata'
                    )
                    - GREATEST(
                        activity_intervals.active_started_at,
                        day_start AT TIME ZONE 'Asia/Kolkata'
                    )
            )
        )::BIGINT AS active_seconds
    FROM activity_intervals
    CROSS JOIN LATERAL GENERATE_SERIES(
        DATE_TRUNC('day', activity_intervals.active_started_at AT TIME ZONE 'Asia/Kolkata'),
        DATE_TRUNC('day', activity_intervals.active_ended_at AT TIME ZONE 'Asia/Kolkata'),
        INTERVAL '1 day'
    ) AS days(day_start)
)
SELECT
    user_id,
    mobile_number,
    activity_date,
    SUM(active_seconds)::BIGINT AS active_seconds
FROM daily_intervals
GROUP BY user_id, mobile_number, activity_date;
