const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// GET /api/notifications
router.get('/', notificationController.getNotifications);

module.exports = router;
