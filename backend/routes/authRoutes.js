const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/send-otp', authController.sendOtp);
router.post('/verify-otp', authController.verifyOtp);
router.put('/profile', authMiddleware, authController.updateProfile);
router.get('/me', authMiddleware, authController.getMe);

module.exports = router;
