const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(async (req, res, next) => {
    const schemaReady = await req.app.locals.paymentSchemaReady;
    if (!schemaReady) {
        return res.status(503).json({ success: false, message: 'Payment service is temporarily unavailable' });
    }
    next();
});

// Route to create a new Razorpay order
router.post('/create-order', authMiddleware.optional, paymentController.createOrder);

// Route to verify a payment after successful frontend checkout
router.post('/verify', authMiddleware.optional, paymentController.verifyPayment);

module.exports = router;
