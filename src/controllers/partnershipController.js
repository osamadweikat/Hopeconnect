const db = require('../config/db');

exports.addPartnership = async (req, res) => {
    try {
        const { organization_name, contact_email } = req.body;

        await db.execute(
            'INSERT INTO Partnerships (organization_name, contact_email) VALUES (?, ?)',
            [organization_name, contact_email]
        );

        res.status(201).json({ message: 'Partnership request submitted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getPartnerships = async (req, res) => {
    try {
        const [partnerships] = await db.execute('SELECT * FROM Partnerships');

        res.json({ partnerships });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
