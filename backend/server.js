const express = require('express');
const cors = require('cors');
require('dotenv').config();

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

const PORT = process.env.PORT || 5000;
const db = require('./config/db');

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
