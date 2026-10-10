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
            
            let address = null;
            let familyMembers = [];
            
            if (!isNewUser && user) {
                const addressRes = await db.query('SELECT label, line1, line2, landmark, pincode FROM ps.address WHERE user_id = $1 ORDER BY is_default DESC LIMIT 1', [user.id]);
                if (addressRes.rows.length > 0) address = addressRes.rows[0];
                
                const familyRes = await db.query('SELECT id, name, relation, gotram, janma_nakshatram, date_of_birth, is_deceased FROM ps.family_member WHERE user_id = $1', [user.id]);
                familyMembers = familyRes.rows.map(row => ({
                    id: row.id,
                    name: row.name,
                    relation: row.relation,
                    gotram: row.gotram || '',
                    janma_nakshatram: row.janma_nakshatram || '',
                    date_of_birth: row.date_of_birth ? row.date_of_birth.toISOString().split('T')[0] : '',
                    is_deceased: row.is_deceased || false
                }));
            }
            
            // Map sampradayam DB UUID to frontend code
            const revSampradayamMap = {
                '5872e56b-a237-489f-96be-078cb1f58f4e': 'smartha',
                '2c7dce01-d5d5-4716-b6ad-131112bf2e37': 'madhva',
                'cf656c6f-a2b0-4ddc-8f3d-3ac2c6f7a1aa': 'srivaishnava',
                '9bcd1fc4-02b1-4782-abcf-713193368030': 'vaikhanasa',
                'febf9905-b5c9-4a7c-83dc-318cb39fe2cd': 'pancharatra',
                'f8adde3d-a7df-40d7-ace4-c9c75d16063c': 'unknown',
                'b72d9511-ffcd-462a-b21c-ec1466fe40f1': 'samanya',
                'c5f19dd5-5f43-4830-a96a-8d552aa87eb3': 'veerashaiva'
            };
            const frontendSampradayam = user.sampradayam_id ? (revSampradayamMap[user.sampradayam_id] || '') : '';

            return res.status(200).json({
                success: true,
                message: 'OTP verified successfully',
                token,
                user: {
                    id: user.id,
                    mobileNumber: user.phone_e164,
                    name: user.name || '',
                    email: user.email || '',
                    sampradayam: frontendSampradayam,
                    gotra: user.gotram || '',
                    address: address ? (address.line1 || '') : '',
                    addressLine2: address ? (address.line2 || '') : '',
                    landmark: address ? (address.landmark || '') : '',
                    addressLabel: address ? (address.label || 'Home') : 'Home',
                    pincode: address ? (address.pincode || '') : '',
                    familyMembers,
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
    const { mobileNumber, name, email, familyMembers = [], sampradayam, gotra, address, addressLine2, landmark, addressLabel, pincode } = req.body;
    
    if (!mobileNumber) {
        return res.status(400).json({ success: false, message: 'Mobile number is required' });
    }

    // Map frontend sampradayam codes to DB UUIDs
    const sampradayamMap = {
        'smartha': '5872e56b-a237-489f-96be-078cb1f58f4e',
        'madhva': '2c7dce01-d5d5-4716-b6ad-131112bf2e37',
        'srivaishnava': 'cf656c6f-a2b0-4ddc-8f3d-3ac2c6f7a1aa',
        'vaikhanasa': '9bcd1fc4-02b1-4782-abcf-713193368030',
        'pancharatra': 'febf9905-b5c9-4a7c-83dc-318cb39fe2cd',
        'samanya': 'b72d9511-ffcd-462a-b21c-ec1466fe40f1',
        'unknown': 'f8adde3d-a7df-40d7-ace4-c9c75d16063c',
        'veerashaiva': 'c5f19dd5-5f43-4830-a96a-8d552aa87eb3'
    };

    const sampradayamId = sampradayamMap[sampradayam] || null;

    try {
        // 1. Update User Table
        const updateResult = await db.query(
            `UPDATE ps.app_user 
             SET name = $1, gotram = $2, sampradayam_id = $3, email = $4, updated_at = NOW()
             WHERE phone_e164 = $5 RETURNING *`,
            [name, gotra, sampradayamId, email, mobileNumber]
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
                await db.query('UPDATE ps.address SET line1 = $1, line2 = $2, landmark = $3, label = $4 WHERE user_id = $5', [address, addressLine2, landmark, addressLabel || 'Home', user.id]);
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
                     (id, user_id, label, line1, line2, landmark, pincode, is_default) 
                     VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, true)`,
                    [user.id, addressLabel || 'Home', address, addressLine2, landmark, finalPincode]
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
                
                let dob = member.date_of_birth ? new Date(member.date_of_birth) : null;
                if (dob && isNaN(dob.getTime())) dob = null;
                
                if (familyRes.rows.length > 0) {
                    await db.query(
                        `UPDATE ps.family_member 
                         SET gotram = $1, janma_nakshatram = $2, date_of_birth = $3, is_deceased = $4
                         WHERE id = $5`,
                        [member.gotram, member.janma_nakshatram, dob, member.is_deceased || false, familyRes.rows[0].id]
                    );
                } else {
                    await db.query(
                        `INSERT INTO ps.family_member 
                         (id, user_id, name, relation, gotram, janma_nakshatram, date_of_birth, is_deceased) 
                         VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7)`,
                        [user.id, member.name, member.relation, member.gotram, member.janma_nakshatram, dob, member.is_deceased || false]
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
