const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const authRoutes = require('./routes/authRoutes');
const poojaRoutes = require('./routes/poojaRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Load Modular Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', poojaRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/panchangam', require('./routes/panchangamRoutes'));
app.use('/api/home', require('./routes/homeRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/content', require('./routes/contentRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));

const PORT = process.env.PORT || 5000;
const db = require('./config/db');

const analyticsSchema = fs.readFileSync(
    path.join(__dirname, 'migrations', '001_user_activity_analytics.sql'),
    'utf8'
);
app.locals.analyticsSchemaReady = db.query(analyticsSchema)
    .then(() => {
        console.log('User activity analytics schema is ready.');
        return true;
    })
    .catch((err) => {
        console.error('Failed to initialize user activity analytics schema:', err.message);
        return false;
    });

const paymentSchema = fs.readFileSync(
    path.join(__dirname, 'migrations', '002_booking_payment.sql'),
    'utf8'
);
app.locals.paymentSchemaReady = db.query(paymentSchema)
    .then(() => {
        console.log('Booking payment schema is ready.');
        return true;
    })
    .catch((err) => {
        console.error('Failed to initialize booking payment schema:', err.message);
        return false;
    });

const optionalBookingAddressSchema = fs.readFileSync(
    path.join(__dirname, 'migrations', '003_optional_booking_address.sql'),
    'utf8'
);
app.locals.optionalBookingAddressSchemaReady = db.query(optionalBookingAddressSchema)
    .then(() => {
        console.log('Optional booking address schema is ready.');
        return true;
    })
    .catch((err) => {
        console.warn('Optional booking address schema already applied or skipped:', err.message);
        return true;
    });

const schemaFixes = fs.readFileSync(
    path.join(__dirname, 'migrations', '004_pooja_category_svg_and_purohit_status.sql'),
    'utf8'
);
app.locals.schemaFixesReady = db.query(schemaFixes)
    .then(() => {
        console.log('Category icons and purohit status schema is ready.');
        return true;
    })
    .catch((err) => {
        console.warn('Schema fixes already applied or skipped:', err.message);
        return true;
    });

app.listen(PORT, '0.0.0.0', async () => {
    console.log(`Backend server is running on http://0.0.0.0:${PORT}`);
    console.log(`Modular backend initialized. Mock OTP is enabled (use 1234).`);
    try {
        const res = await db.query('SELECT NOW()');
        console.log('Database connected successfully:', res.rows[0]);
    } catch (err) {
        console.error('Database connection failed:', err.message);
    }
});

process.on('uncaughtException', (err) => {
    console.warn('Unhandled exception caught (server continuing):', err.message);
});

process.on('unhandledRejection', (reason) => {
    console.warn('Unhandled rejection caught (server continuing):', reason);
});

