const multer = require('multer');
const path = require('path');
const db = require('../config/db');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/orphan_images/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

exports.createOrphanProfile = upload.single('profile_image'), async (req, res) => {
    const { name, age, gender, education_status, health_condition, orphanage_id } = req.body;
    const profile_image = req.file ? req.file.filename : null;

    if (!name || !age || !gender || !orphanage_id) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const { valid, message } = validateOrphanProfile(name, age, gender, education_status, health_condition);
    if (!valid) {
        return res.status(400).json({ message });
    }

    try {
        await db.execute(
            'INSERT INTO Orphans (name, age, gender, education_status, health_condition, orphanage_id, profile_image) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [name, age, gender, education_status, health_condition, orphanage_id, profile_image]
        );
        res.status(201).json({ message: 'Orphan profile created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

function validateOrphanProfile(name, age, gender, education_status, health_condition) {
    if (!name || age <= 0 || age > 150 || !gender) {
        return { valid: false, message: 'Invalid orphan profile data' };
    }
    return { valid: true };
}
