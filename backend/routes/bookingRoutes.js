const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

router.post('/', bookingController.createBooking);
router.get('/my-bookings', bookingController.getMyBookings);

module.exports = router;
