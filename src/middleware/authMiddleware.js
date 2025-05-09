const jwt = require('jsonwebtoken');
const { User } = require('../models'); 

exports.verifyToken = async (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);

        const user = await User.findByPk(decoded.id);
        if (!user) return res.status(401).json({ message: 'User not found' });
        req.user = {
            id: user.id,
            role: user.role,
            email: user.email
        };

        next();
    } catch (error) {
        res.status(400).json({ message: 'Invalid token' });
    }
};


exports.verifyAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Only admins can perform this action.' });
    }
    next();
};

exports.verifyManager = (req, res, next) => {
    if (!req.user || req.user.role !== 'orphanage_manager') {
        return res.status(403).json({ message: 'Access denied. Only orphanage managers can perform this action.' });
    }
    next();
};

