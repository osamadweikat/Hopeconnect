const db = require("../config/db");

exports.verifyOrphanage = async (req, res) => {
    try {
        const orphanageId = req.params.id;
        await db.execute("UPDATE Orphanages SET verified = 1 WHERE id = ?", [orphanageId]);
        res.status(200).json({ message: "Orphanage verified successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error verifying orphanage" });
    }
};

exports.getAllOrphanages = async (req, res) => {
    try {
        const [orphanages] = await db.execute("SELECT * FROM Orphanages WHERE verified = 1");
        res.status(200).json({ orphanages });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching orphanages" });
    }
};

exports.getOrphanageById = async (req, res) => {
    try {
        const orphanageId = req.params.id;
        const [orphanage] = await db.execute("SELECT * FROM Orphanages WHERE id = ?", [orphanageId]);
        if (!orphanage.length) return res.status(404).json({ message: "Orphanage not found" });
        res.status(200).json({ orphanage: orphanage[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching orphanage" });
    }
};

exports.createOrphanage = async (req, res) => {
    try {
        const { name, location, manager_id } = req.body;
        if (!name || !location || !manager_id) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        await db.execute(
            "INSERT INTO Orphanages (name, location, manager_id, verified) VALUES (?, ?, ?, 0)",
            [name, location, manager_id]
        );
        res.status(201).json({ message: "Orphanage created. Awaiting verification." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating orphanage" });
    }
};

exports.updateOrphanage = async (req, res) => {
    try {
        const orphanageId = req.params.id;
        const { name, location } = req.body;

        await db.execute(
            "UPDATE Orphanages SET name = ?, location = ? WHERE id = ?",
            [name, location, orphanageId]
        );
        res.status(200).json({ message: "Orphanage updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating orphanage" });
    }
};

exports.deleteOrphanage = async (req, res) => {
    try {
        const orphanageId = req.params.id;
        await db.execute("DELETE FROM Orphanages WHERE id = ?", [orphanageId]);
        res.status(200).json({ message: "Orphanage deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting orphanage" });
    }
};
