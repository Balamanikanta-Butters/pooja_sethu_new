const express = require('express');
const router = express.Router();
const panchangamController = require('../controllers/panchangamController');

router.get('/', panchangamController.getPanchangam);

module.exports = router;
