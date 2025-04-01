const db = require('../config/db');

exports.updateDeliveryStatus = async (req, res) => {
    try {
        const { donation_id, status } = req.body;

        await db.execute('UPDATE Logistics SET status = ? WHERE donation_id = ?', [status, donation_id]);

        res.json({ message: 'Delivery status updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getDeliveryStatus = async (req, res) => {
    try {
        const donation_id = req.params.id;
        const [logistics] = await db.execute('SELECT * FROM Logistics WHERE donation_id = ?', [donation_id]);

        res.json({ logistics });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
