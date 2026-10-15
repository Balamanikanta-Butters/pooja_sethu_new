const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/send-otp', authController.sendOtp);
router.post('/verify-otp', authController.verifyOtp);
router.put('/profile', authMiddleware.optional, authController.updateProfile);
router.get('/me', authMiddleware, authController.getMe);

// Address Management
router.get('/addresses', authMiddleware, authController.getAddresses);
router.post('/addresses', authMiddleware, authController.saveAddress);
router.put('/addresses/:id/default', authMiddleware, authController.setDefaultAddress);
router.delete('/addresses/:id', authMiddleware, authController.deleteAddress);

module.exports = router;
