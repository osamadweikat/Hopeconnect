const db = require('../config/db');
const sendEmail = require('../utils/emailService');

exports.approveUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const [user] = await db.execute('SELECT * FROM users WHERE id = ?', [userId]);

        if (!user.length) return res.status(404).json({ message: 'User not found' });

        await db.execute('UPDATE users SET approved = true WHERE id = ?', [userId]);
        await sendEmail(
            user[0].email,
            'Account Approved',
            'Congratulations! Your registration has been approved by the admin. You can now log in to HopeConnect.'
        );
        res.json({ message: 'User approved successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.rejectUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const [user] = await db.execute('SELECT * FROM users WHERE id = ?', [userId]);

        if (!user.length) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userEmail = user[0].email;
        await sendEmail(
            userEmail,
            'HopeConnect - Registration Rejected',
            'We regret to inform you that your registration request has been rejected. If you have any questions, please contact our support team.'
        );
        await db.execute('DELETE FROM users WHERE id = ?', [userId]);
        res.json({ message: 'User rejected, email sent, and deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const adminId = req.user.id;
        const userId = req.params.id;
        const [adminUser] = await db.execute('SELECT * FROM users WHERE id = ?', [adminId]);

        if (!adminUser.length || adminUser[0].role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Only admins can delete users.' });
        }
        const [user] = await db.execute('SELECT * FROM users WHERE id = ?', [userId]);
        if (!user.length) {
            return res.status(404).json({ message: 'User not found' });
        }
        const userEmail = user[0].email;

        await sendEmail(
            userEmail,
            'HopeConnect - Account Deletion',
            'Your account has been removed from HopeConnect. If you have any questions, please contact our support team.'
        );
        await db.execute('DELETE FROM users WHERE id = ?', [userId]);

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getPendingRegistrations = async (req, res) => {
    try {
        const [pendingUsers] = await db.execute('SELECT * FROM users WHERE approved = 0');

        if (!pendingUsers.length) {
            return res.status(404).json({ message: 'No pending registrations found' });
        }

        res.json({ pendingUsers });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const [user] = await db.execute('SELECT * FROM users WHERE id = ?', [userId]);

        if (!user.length) return res.status(404).json({ message: 'User not found' });

        res.json(user[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.verifyOrphanage = async (req, res) => {
    try {
        const orphanageId = req.params.id;
        const [orphanage] = await db.execute('SELECT * FROM Orphanages WHERE id = ?', [orphanageId]);

        if (!orphanage.length) return res.status(404).json({ message: 'Orphanage not found' });

        await db.execute('UPDATE Orphanages SET verified = 1 WHERE id = ?', [orphanageId]);

        res.json({ message: 'Orphanage verified successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};