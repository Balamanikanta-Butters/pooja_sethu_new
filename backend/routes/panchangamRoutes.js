const express = require('express');
const router = express.Router();
const panchangamController = require('../controllers/panchangamController');

router.get('/today', panchangamController.getPanchangamToday);
router.get('/', panchangamController.getPanchangam);

module.exports = router;
