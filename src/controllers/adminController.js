const { User, Orphanage } = require('../models');
const sendEmail = require('../utils/emailService');

exports.approveUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.approved = true;
        await user.save();

        await sendEmail(
            user.email,
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
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        await sendEmail(
            user.email,
            'HopeConnect - Registration Rejected',
            'We regret to inform you that your registration request has been rejected. If you have any questions, please contact our support team.'
        );
        await user.destroy();
        res.json({ message: 'User rejected and deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const adminUser = await User.findByPk(req.user.id);
        if (!adminUser || adminUser.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Only admins can delete users.' });
        }

        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        await sendEmail(
            user.email,
            'HopeConnect - Account Deletion',
            'Your account has been removed from HopeConnect. If you have any questions, please contact our support team.'
        );
        await user.destroy();
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getPendingRegistrations = async (req, res) => {
    try {
        const pendingUsers = await User.findAll({ where: { approved: false } });
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
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.verifyOrphanage = async (req, res) => {
    try {
        const orphanage = await Orphanage.findByPk(req.params.id);
        if (!orphanage) return res.status(404).json({ message: 'Orphanage not found' });

        orphanage.verified = true;
        await orphanage.save();

        res.json({ message: 'Orphanage verified successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
