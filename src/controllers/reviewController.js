const db = require('../config/db');

exports.addReview = async (req, res) => {
    try {
        const { orphanage_id, rating, comment } = req.body;
        const user_id = req.user.id;

        if (!orphanage_id || !rating) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        await db.execute(
            'INSERT INTO Reviews (user_id, orphanage_id, rating, comment) VALUES (?, ?, ?, ?)',
            [user_id, orphanage_id, rating, comment]
        );

        res.status(201).json({ message: 'Review submitted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getReviews = async (req, res) => {
    try {
        const orphanage_id = req.params.id;
        const [reviews] = await db.execute('SELECT * FROM Reviews WHERE orphanage_id = ?', [orphanage_id]);

        res.json({ reviews });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
