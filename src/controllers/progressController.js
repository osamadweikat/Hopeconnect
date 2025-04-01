const db = require('../db'); 

exports.addOrphanProgressUpdate = async (req, res) => {
    const { orphan_id, update_type, content } = req.body;

    if (!orphan_id || !update_type || !content) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const [result] = await db.execute(
            'INSERT INTO OrphanProgressUpdates (orphan_id, update_type, content) VALUES (?, ?, ?)',
            [orphan_id, update_type, content]
        );

        res.status(201).json({ message: 'Progress update added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getOrphanProgressUpdates = async (req, res) => {
    const orphan_id = req.params.id;

    try {
        const [updates] = await db.execute('SELECT * FROM OrphanProgressUpdates WHERE orphan_id = ?', [orphan_id]);

        if (!updates.length) {
            return res.status(404).json({ message: 'No updates found for this orphan' });
        }

        res.json({ updates });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
