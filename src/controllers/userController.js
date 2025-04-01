const db = require('../config/db');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const sendEmail  = require('../utils/emailService');
const pendingPasswordChanges = new Map();

exports.registerUser = async (req, res) => {
    try {
        const { full_name, email, password, role, phone, address } = req.body;

        if (!full_name || !email || !password || !role || !phone || !address) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        const allowedRoles = ['donor', 'volunteer', 'admin', 'orphanage_manager'];
        if (!allowedRoles.includes(role)) {
            return res.status(400).json({ message: 'Invalid role. Allowed roles are donor, volunteer, admin, orphanage_manager' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const [existingUser] = await db.execute('SELECT * FROM Users WHERE email = ?', [email]);
        if (existingUser.length) return res.status(400).json({ message: 'User already exists' });

        await db.execute(
            `INSERT INTO Users (full_name, email, password_hash, role, phone, address, approved) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [full_name, email, hashedPassword, role, phone, address, false]
        );

        await sendEmail(
            email,
            'Registration Pending Approval',
            'Thank you for registering with HopeConnect. Your account is under review by an administrator. You will be notified once it is approved.'
        );

        res.status(201).json({ message: 'User registered successfully, awaiting admin approval' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const [user] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);

        if (!user.length) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user[0].password_hash); 
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user[0].id, role: user[0].role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user: user[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { full_name, phone, address, password, confirm_password, verification_code } = req.body;

        if (!full_name && !password && !phone && !address && !verification_code) {
            return res.status(400).json({ message: 'No valid fields to update' });
        }

        const [user] = await db.execute('SELECT * FROM users WHERE id = ?', [userId]);
        if (!user.length) return res.status(404).json({ message: 'User not found' });

        if (verification_code) {
            const storedData = pendingPasswordChanges.get(userId);
            if (!storedData || storedData.code !== verification_code || Date.now() > storedData.expiresAt) {
                return res.status(400).json({ message: 'Invalid or expired verification code' });
            }

            await db.execute('UPDATE users SET password_hash = ? WHERE id = ?', [storedData.newPassword, userId]);
            pendingPasswordChanges.delete(userId);
            return res.json({ message: 'Password updated successfully' });
        }

        if (password) {
            if (password.length < 6) {
                return res.status(400).json({ message: 'Password must be at least 6 characters long' });
            }

            const passwordMatch = await bcrypt.compare(password, user[0].password_hash);
            if (passwordMatch) {
                return res.status(400).json({ message: 'New password cannot be the same as the old password' });
            }

            if (password !== confirm_password) {
                return res.status(400).json({ message: 'Passwords do not match' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const verificationCode = crypto.randomInt(100000, 999999).toString();
            pendingPasswordChanges.set(userId, {
                code: verificationCode,
                newPassword: hashedPassword,
                expiresAt: Date.now() + 5 * 60 * 1000 
            });

            await sendEmail(
                user[0].email,
                'Verify Password Change',
                `Your verification code is: ${verificationCode}. This code expires in 5 minutes.`
            );

            return res.json({ message: 'Verification code sent to your email' });
        }
        const updates = [];
        const values = [];

        if (full_name) {
            updates.push('full_name = ?');
            values.push(full_name);
        }
        if (phone) {
            updates.push('phone = ?');
            values.push(phone);
        }
        if (address) {
            updates.push('address = ?');
            values.push(address);
        }

        if (updates.length > 0) {
            values.push(userId);
            await db.execute(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, values);
        }

        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.verifyPasswordCode = async (req, res) => {
    try {
        const userId = req.user.id;
        const { verificationCode, newPassword, confirmPassword } = req.body;

        if (!verificationCodes.has(userId)) {
            return res.status(400).json({ message: 'No password change request found' });
        }

        const storedCode = verificationCodes.get(userId);
        if (Date.now() > storedCode.expiresAt) {
            verificationCodes.delete(userId);
            return res.status(400).json({ message: 'Verification code expired' });
        }

        if (storedCode.code !== verificationCode) {
            return res.status(400).json({ message: 'Invalid verification code' });
        }

        if (!newPassword || newPassword.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        const [user] = await db.execute('SELECT password_hash FROM users WHERE id = ?', [userId]);
        if (!user.length) return res.status(404).json({ message: 'User not found' });

        const isSamePassword = await bcrypt.compare(newPassword, user[0].password_hash);
        if (isSamePassword) {
            return res.status(400).json({ message: 'New password cannot be the same as the old password' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await db.execute('UPDATE users SET password_hash = ? WHERE id = ?', [hashedPassword, userId]);
        verificationCodes.delete(userId);
        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


