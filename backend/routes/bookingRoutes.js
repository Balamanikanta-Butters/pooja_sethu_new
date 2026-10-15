const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(async (req, res, next) => {
    const schemaReady = await req.app.locals.optionalBookingAddressSchemaReady;
    if (!schemaReady) {
        return res.status(503).json({ success: false, message: 'Booking service is temporarily unavailable' });
    }
    next();
});

router.post('/', authMiddleware.optional, bookingController.createBooking);
router.get('/my-bookings', authMiddleware.optional, bookingController.getMyBookings);
router.post('/:id/cancel', authMiddleware.optional, bookingController.cancelBooking);
router.patch('/:id/cancel', authMiddleware.optional, bookingController.cancelBooking);

module.exports = router;
