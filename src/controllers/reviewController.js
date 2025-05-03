const Review = require('../models/Review');
const User = require('../models/User');

exports.addReview = async (req, res) => {
    try {
        const { orphanage_id, rating, comment } = req.body;
        const user_id = req.user.id;

        if (!orphanage_id || !rating) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        await Review.create({ user_id, orphanage_id, rating, comment });
        res.status(201).json({ message: 'Review submitted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getReviews = async (req, res) => {
    try {
        const orphanage_id = req.params.id;
        const user = await User.findByPk(req.user.id);
        
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden: Only admin can view reviews' });
        }

        const reviews = await Review.findAll({ where: { orphanage_id } });
        res.json({ reviews });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
