const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);
router.use(async (req, res, next) => {
    const ready = await req.app.locals.analyticsSchemaReady;
    if (!ready) {
        return res.status(503).json({
            success: false,
            message: 'Analytics storage is not available.',
        });
    }
    return next();
});
router.post('/sessions', analyticsController.startSession);
router.put('/sessions/:sessionId/page', analyticsController.recordPage);
router.post('/sessions/:sessionId/pause', analyticsController.pauseSession);
router.post('/sessions/:sessionId/resume', analyticsController.resumeSession);
router.post('/sessions/:sessionId/heartbeat', analyticsController.heartbeat);
router.post('/sessions/:sessionId/end', analyticsController.endSession);

module.exports = router;
