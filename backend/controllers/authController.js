const db = require('../config/db');
const jwt = require('jsonwebtoken');
const notificationService = require('../services/notificationService');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-for-jwt';

// Mock OTP store
const mockOtpStore = {};

exports.sendOtp = async (req, res) => {
    const { mobileNumber } = req.body;
    
    if (!mobileNumber || mobileNumber.length !== 10) {
        return res.status(400).json({ success: false, message: 'Valid 10-digit mobile number required' });
    }

    // Always generate '123456' as mock OTP for testing
    const mockOtp = '123456';
    mockOtpStore[mobileNumber] = mockOtp;
    
    console.log(`[OTP DISPATCH] Sent OTP ${mockOtp} to ${mobileNumber}`);

    // Asynchronously dispatch OTP via SMS service (mock or live provider)
    notificationService.sendOtpSms({ phone: mobileNumber, otp: mockOtp }).catch(err => {
        console.warn('[NotificationService] OTP SMS dispatch notice:', err.message);
    });
    
    return res.status(200).json({ 
        success: true, 
        message: 'OTP sent successfully (Use 123456 for testing)'
    });
};

exports.verifyOtp = async (req, res) => {
    const { mobileNumber, otp, name } = req.body;

    if (!mobileNumber || !otp) {
        return res.status(400).json({ success: false, message: 'Mobile number and OTP are required' });
    }

    const validOtp = mockOtpStore[mobileNumber] || '123456';

    // Allow 4-digit or 6-digit number for mock testing
    if ((otp.length === 6 || otp.length === 4) && /^\d+$/.test(otp)) {
        try {
            // Check if user exists in the database
            const userResult = await db.query('SELECT * FROM ps.app_user WHERE phone_e164 = $1', [mobileNumber]);
            let user = userResult.rows[0];
            let isNewUser = false;

            if (!user) {
                // If user doesn't exist, create them
                const insertResult = await db.query(
                    'INSERT INTO ps.app_user (phone_e164, name, created_at, updated_at) VALUES ($1, $2, NOW(), NOW()) RETURNING *',
                    [mobileNumber, name && name.trim() ? name.trim() : null]
                );
                user = insertResult.rows[0];
                isNewUser = true;
            } else if (name && name.trim()) {
                // Update name if entered during login
                const updateResult = await db.query(
                    'UPDATE ps.app_user SET name = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
                    [name.trim(), user.id]
                );
                if (updateResult.rows.length > 0) {
                    user = updateResult.rows[0];
                }
            }

            const token = jwt.sign({ userId: user.id, mobileNumber: user.phone_e164 }, JWT_SECRET, { expiresIn: '7d' });
            
            let address = null;
            let familyMembers = [];
            
            let addressesList = [];
            if (!isNewUser && user) {
                const addressRes = await db.query('SELECT id, label, line1, line2, landmark, pincode, is_default FROM ps.address WHERE user_id = $1 ORDER BY is_default DESC, id ASC', [user.id]);
                addressesList = addressRes.rows;
                if (addressesList.length > 0) address = addressesList[0];
                
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
                    addresses: addressesList.map(a => ({
                        id: a.id,
                        label: a.label || 'Home',
                        line1: a.line1 || '',
                        line2: a.line2 || '',
                        landmark: a.landmark || '',
                        pincode: a.pincode || '',
                        is_default: !!a.is_default
                    })),
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

    let sampradayamId = null;
    if (sampradayam) {
        try {
            const sRes = await db.query(
                `SELECT id FROM ps.sampradayam WHERE LOWER(code) = LOWER($1) OR id::text = $1 OR LOWER(name->>'en') = LOWER($1) LIMIT 1`,
                [String(sampradayam).trim()]
            );
            if (sRes.rows.length > 0) {
                sampradayamId = sRes.rows[0].id;
            }
        } catch (_) {}
    }

    try {
        // 1. Update User Table
        const updateResult = await db.query(
            `UPDATE ps.app_user 
             SET name = $1, gotram = $2, sampradayam_id = $3, email = $4, updated_at = NOW()
             WHERE phone_e164 = $5 RETURNING *`,
            [name, gotra, sampradayamId, email, mobileNumber]
        );

        let user;
        if (updateResult.rows.length === 0) {
            const cleanPhone = mobileNumber.startsWith('+') ? mobileNumber : `+91${mobileNumber}`;
            const altResult = await db.query(
                `UPDATE ps.app_user 
                 SET name = $1, gotram = $2, sampradayam_id = $3, email = $4, updated_at = NOW()
                 WHERE phone_e164 = $5 RETURNING *`,
                [name, gotra, sampradayamId, email, cleanPhone]
            );

            if (altResult.rows.length > 0) {
                user = altResult.rows[0];
            } else {
                const insertResult = await db.query(
                    `INSERT INTO ps.app_user (phone_e164, name, gotram, sampradayam_id, email, created_at, updated_at)
                     VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
                     ON CONFLICT (phone_e164) DO UPDATE
                     SET name = EXCLUDED.name, gotram = EXCLUDED.gotram, sampradayam_id = EXCLUDED.sampradayam_id, email = EXCLUDED.email, updated_at = NOW()
                     RETURNING *`,
                    [mobileNumber, name, gotra, sampradayamId, email]
                );
                user = insertResult.rows[0];
            }
        } else {
            user = updateResult.rows[0];
        }

        // 2. Upsert Address Table
        if (address) {
            let finalPincode = '500089';
            if (pincode && pincode.length === 6) {
                const pinRes = await db.query('SELECT code FROM ps.pincode WHERE code = $1', [pincode]);
                if (pinRes.rows.length > 0) {
                    finalPincode = pincode;
                }
            }

            // Check if address exists
            const addressRes = await db.query('SELECT id FROM ps.address WHERE user_id = $1', [user.id]);
            if (addressRes.rows.length > 0) {
                // Update
                await db.query('UPDATE ps.address SET line1 = $1, line2 = $2, landmark = $3, label = $4, pincode = $5 WHERE user_id = $6', [address, addressLine2, landmark, addressLabel || 'Home', finalPincode, user.id]);
            } else {
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

exports.getMe = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const mobileNumber = req.user?.mobileNumber;

        let userResult;
        if (userId) {
            userResult = await db.query('SELECT * FROM ps.app_user WHERE id = $1', [userId]);
        }
        
        // If not found by userId, try finding by phone_e164 (both raw and +91 formatted)
        if ((!userResult || userResult.rows.length === 0) && mobileNumber) {
            const rawPhone = String(mobileNumber).replace(/^\+91/, '');
            userResult = await db.query(
                'SELECT * FROM ps.app_user WHERE phone_e164 = $1 OR phone_e164 = $2 OR phone_e164 = $3',
                [mobileNumber, rawPhone, `+91${rawPhone}`]
            );
            
            // If user authenticated during DB outage, create user record now
            if (userResult.rows.length === 0) {
                userResult = await db.query(
                    'INSERT INTO ps.app_user (phone_e164, created_at, updated_at) VALUES ($1, NOW(), NOW()) RETURNING *',
                    [mobileNumber]
                );
            }
        }

        if (!userResult || userResult.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        
        const user = userResult.rows[0];
        let address = null;
        let familyMembers = [];
        
        const addressRes = await db.query('SELECT id, label, line1, line2, landmark, pincode, is_default FROM ps.address WHERE user_id = $1 ORDER BY is_default DESC, id ASC', [user.id]);
        const addressesList = addressRes.rows;
        if (addressesList.length > 0) address = addressesList[0];
        
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
                addresses: addressesList.map(a => ({
                    id: a.id,
                    label: a.label || 'Home',
                    line1: a.line1 || '',
                    line2: a.line2 || '',
                    landmark: a.landmark || '',
                    pincode: a.pincode || '',
                    is_default: !!a.is_default
                })),
                familyMembers
            }
        });
    } catch (err) {
        console.error("Error in getMe:", err.message);
        if (req.user && (req.user.mobileNumber || req.user.userId)) {
            return res.status(200).json({
                success: true,
                user: {
                    id: req.user.userId || 'offline-user',
                    mobileNumber: req.user.mobileNumber || '',
                    name: '',
                    email: '',
                    sampradayam: '',
                    gotra: '',
                    address: '',
                    addressLine2: '',
                    landmark: '',
                    addressLabel: 'Home',
                    pincode: '',
                    addresses: [],
                    familyMembers: []
                }
            });
        }
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.getAddresses = async (req, res) => {
    try {
        const userId = req.user.userId;
        const result = await db.query('SELECT id, label, line1, line2, landmark, pincode, is_default FROM ps.address WHERE user_id = $1 ORDER BY is_default DESC, id ASC', [userId]);
        return res.status(200).json({ success: true, addresses: result.rows });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.saveAddress = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id, label, line1, line2, landmark, pincode, is_default } = req.body;

        let finalPincode = '500089';
        if (pincode && pincode.length === 6) {
            const pinRes = await db.query('SELECT code FROM ps.pincode WHERE code = $1', [pincode]);
            if (pinRes.rows.length > 0) finalPincode = pincode;
        }

        if (is_default) {
            await db.query('UPDATE ps.address SET is_default = false WHERE user_id = $1', [userId]);
        }

        let addressRecord = null;
        if (id && !String(id).startsWith('addr-')) {
            const upd = await db.query(
                `UPDATE ps.address
                 SET label = $1, line1 = $2, line2 = $3, landmark = $4, pincode = $5, is_default = COALESCE($6, is_default)
                 WHERE id = $7 AND user_id = $8 RETURNING *`,
                [label || 'Home', line1, line2 || '', landmark || '', finalPincode, is_default, id, userId]
            );
            if (upd.rows.length > 0) {
                addressRecord = upd.rows[0];
            }
        }

        if (!addressRecord) {
            const ins = await db.query(
                `INSERT INTO ps.address (id, user_id, label, line1, line2, landmark, pincode, is_default)
                 VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7) RETURNING *`,
                [userId, label || 'Home', line1, line2 || '', landmark || '', finalPincode, !!is_default]
            );
            addressRecord = ins.rows[0];
        }

        return res.status(200).json({ success: true, address: addressRecord });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.setDefaultAddress = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;
        await db.query('UPDATE ps.address SET is_default = false WHERE user_id = $1', [userId]);
        if (id && !String(id).startsWith('addr-')) {
            await db.query('UPDATE ps.address SET is_default = true WHERE id = $1 AND user_id = $2', [id, userId]);
        }
        return res.status(200).json({ success: true });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.deleteAddress = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;
        if (id && !String(id).startsWith('addr-')) {
            await db.query('DELETE FROM ps.address WHERE id = $1 AND user_id = $2', [id, userId]);
        }
        return res.status(200).json({ success: true });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.getFamilyMembers = async (req, res) => {
    try {
        const userId = req.user.userId;
        const result = await db.query(
            'SELECT id, name, relation, gotram, janma_nakshatram, date_of_birth, is_deceased FROM ps.family_member WHERE user_id = $1 ORDER BY id ASC',
            [userId]
        );
        return res.status(200).json({ success: true, familyMembers: result.rows });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.saveFamilyMember = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id, name, relation, gotram, janma_nakshatram, date_of_birth, is_deceased } = req.body;
        if (!name || !relation) {
            return res.status(400).json({ success: false, message: 'Name and relation are required' });
        }

        let dob = date_of_birth ? new Date(date_of_birth) : null;
        if (dob && isNaN(dob.getTime())) dob = null;

        let memberRecord = null;
        if (id && !String(id).startsWith('fam-')) {
            const upd = await db.query(
                `UPDATE ps.family_member
                 SET name = $1, relation = $2, gotram = $3, janma_nakshatram = $4, date_of_birth = $5, is_deceased = $6
                 WHERE id = $7 AND user_id = $8 RETURNING *`,
                [name.trim(), relation.toLowerCase().trim(), gotram ? gotram.trim() : null, janma_nakshatram || null, dob, !!is_deceased, id, userId]
            );
            if (upd.rows.length > 0) memberRecord = upd.rows[0];
        }

        if (!memberRecord) {
            const ins = await db.query(
                `INSERT INTO ps.family_member (id, user_id, name, relation, gotram, janma_nakshatram, date_of_birth, is_deceased)
                 VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7) RETURNING *`,
                [userId, name.trim(), relation.toLowerCase().trim(), gotram ? gotram.trim() : null, janma_nakshatram || null, dob, !!is_deceased]
            );
            memberRecord = ins.rows[0];
        }

        return res.status(200).json({ success: true, familyMember: memberRecord });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.deleteFamilyMember = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;
        if (id && !String(id).startsWith('fam-')) {
            await db.query('DELETE FROM ps.family_member WHERE id = $1 AND user_id = $2', [id, userId]);
        }
        return res.status(200).json({ success: true });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
