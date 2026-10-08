const db = require('../config/db');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your-secret-key-for-jwt';

// Mock OTP store
const mockOtpStore = {};

exports.sendOtp = async (req, res) => {
    const { mobileNumber } = req.body;
    
    if (!mobileNumber || mobileNumber.length !== 10) {
        return res.status(400).json({ success: false, message: 'Valid 10-digit mobile number required' });
    }

    // Always generate '1234' as mock OTP for testing
    const mockOtp = '1234';
    mockOtpStore[mobileNumber] = mockOtp;
    
    console.log(`[MOCK OTP] Sent OTP ${mockOtp} to ${mobileNumber}`);
    
    return res.status(200).json({ 
        success: true, 
        message: 'OTP sent successfully (Use 1234 for testing)'
    });
};

exports.verifyOtp = async (req, res) => {
    const { mobileNumber, otp } = req.body;

    if (!mobileNumber || !otp) {
        return res.status(400).json({ success: false, message: 'Mobile number and OTP are required' });
    }

    const validOtp = mockOtpStore[mobileNumber] || '1234';

    // Allow any 4-digit number for mock testing
    if (otp.length === 4 && /^\d+$/.test(otp)) {
        try {
            // Check if user exists in the database
            const userResult = await db.query('SELECT * FROM ps.app_user WHERE phone_e164 = $1', [mobileNumber]);
            let user = userResult.rows[0];
            let isNewUser = false;

            if (!user) {
                // If user doesn't exist, create them
                const insertResult = await db.query(
                    'INSERT INTO ps.app_user (phone_e164, created_at, updated_at) VALUES ($1, NOW(), NOW()) RETURNING *',
                    [mobileNumber]
                );
                user = insertResult.rows[0];
                isNewUser = true;
            }

            const token = jwt.sign({ userId: user.id, mobileNumber: user.phone_e164 }, JWT_SECRET, { expiresIn: '7d' });
            
            return res.status(200).json({
                success: true,
                message: 'OTP verified successfully',
                token,
                user: {
                    id: user.id,
                    mobileNumber: user.phone_e164,
                    name: user.name,
                    isNewUser
                }
            });
        } catch (err) {
            console.error(err);
            // Fallback for when DB connection fails (so you can still test frontend)
            const token = jwt.sign({ mobileNumber }, JWT_SECRET, { expiresIn: '7d' });
            return res.status(200).json({
                success: true,
                message: 'OTP verified (Fallback mode - DB disconnected)',
                token,
                user: { mobileNumber, isNewUser: true }
            });
        }
    } else {
        return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }
};

exports.updateProfile = async (req, res) => {
    const { mobileNumber, name, familyMembers = [], sampradayam, gotra, address, pincode } = req.body;
    
    if (!mobileNumber) {
        return res.status(400).json({ success: false, message: 'Mobile number is required' });
    }

    // Map frontend sampradayam codes to DB UUIDs
    const sampradayamMap = {
        'smartha': 'df48dc0e-5f78-4c8a-a63f-cbb02769997b',
        'madhva': 'c825ea61-344e-460d-b047-f2599b9b27fd',
        'vaishnava': '0d33deb8-0953-4ec5-94d6-947632bc0693', // Maps to srivaishnava
        'vaikhanasa': '6155718c-2cbb-496b-b7d4-62fc730212b8',
        'pancharatra': 'e60aaef1-5f21-4dd2-af5d-7f74ea6a650b',
        'unknown': 'd5177f88-41c7-4ffc-9dc3-0b4cf86d56e4',
        'other': '6f6e2a89-74c0-455f-8be5-3aa06538bfe1' // Maps to samanya
    };

    const sampradayamId = sampradayamMap[sampradayam] || null;

    try {
        // 1. Update User Table
        const updateResult = await db.query(
            `UPDATE ps.app_user 
             SET name = $1, gotram = $2, sampradayam_id = $3, updated_at = NOW()
             WHERE phone_e164 = $4 RETURNING *`,
            [name, gotra, sampradayamId, mobileNumber]
        );

        if (updateResult.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const user = updateResult.rows[0];

        // 2. Upsert Address Table
        if (address) {
            // Check if address exists
            const addressRes = await db.query('SELECT id FROM ps.address WHERE user_id = $1', [user.id]);
            if (addressRes.rows.length > 0) {
                // Update
                await db.query('UPDATE ps.address SET line1 = $1 WHERE user_id = $2', [address, user.id]);
            } else {
                // Check if user-provided pincode exists in database
                let finalPincode = '500089';
                if (pincode && pincode.length === 6) {
                    const pinRes = await db.query('SELECT code FROM ps.pincode WHERE code = $1', [pincode]);
                    if (pinRes.rows.length > 0) {
                        finalPincode = pincode;
                    }
                }
                
                await db.query(
                    `INSERT INTO ps.address 
                     (id, user_id, label, line1, pincode, is_default) 
                     VALUES (gen_random_uuid(), $1, $2, $3, $4, true)`,
                    [user.id, 'Home', address, finalPincode]
                );
            }
        }

        // 3. Upsert Family Details
        if (Array.isArray(familyMembers)) {
            for (const member of familyMembers) {
                if (!member.name || !member.relation) continue;
                
                // For simplicity, we just insert them directly. If we wanted to update, we'd need to match on ID or name/relation.
                // Since frontend now gives us an array of objects, let's just delete existing for this user and insert new ones
                // OR we can just check if they exist by name and relation.
                const familyRes = await db.query('SELECT id FROM ps.family_member WHERE user_id = $1 AND name = $2 AND relation = $3', [user.id, member.name, member.relation]);
                
                if (familyRes.rows.length === 0) {
                    await db.query(
                        `INSERT INTO ps.family_member 
                         (id, user_id, name, relation) 
                         VALUES (gen_random_uuid(), $1, $2, $3)`,
                        [user.id, member.name, member.relation]
                    );
                }
            }
        }

        return res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user: updateResult.rows[0]
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Profile update failed',
            error: err.message
        });
    }
};
