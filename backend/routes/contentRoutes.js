const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');

// GET /api/content/:type  — type: 'terms' | 'privacy' | 'cancellation'
router.get('/:type', contentController.getContent);

module.exports = router;
