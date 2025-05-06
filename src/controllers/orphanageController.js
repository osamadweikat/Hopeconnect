const Orphanage = require("../models/Orphanage");

exports.getAllOrphanages = async (req, res) => {
    try {
        const orphanages = await Orphanage.findAll({
            where: { verified: true }
        });
        res.status(200).json({ orphanages });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching orphanages" });
    }
};

exports.getOrphanageById = async (req, res) => {
    try {
        const orphanage = await Orphanage.findByPk(req.params.id);
        if (!orphanage) return res.status(404).json({ message: "Orphanage not found" });
        res.status(200).json({ orphanage });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching orphanage" });
    }
};

exports.createOrphanage = async (req, res) => {
    try {
        const { name, location } = req.body;
        const manager_id = req.user.id;

        if (!name || !location) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        await Orphanage.create({ name, location, manager_id, verified: false });
        res.status(201).json({ message: "Orphanage submitted. Awaiting admin approval." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating orphanage" });
    }
};

exports.verifyOrphanage = async (req, res) => {
    try {
        const orphanage = await Orphanage.findByPk(req.params.id);
        if (!orphanage) return res.status(404).json({ message: "Orphanage not found" });

        orphanage.verified = true;
        await orphanage.save();

        res.status(200).json({ message: "Orphanage verified successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error verifying orphanage" });
    }
};

exports.updateOrphanage = async (req, res) => {
    try {
        const orphanage = await Orphanage.findByPk(req.params.id);
        if (!orphanage) return res.status(404).json({ message: "Orphanage not found" });

        const { name, location } = req.body;
        orphanage.name = name || orphanage.name;
        orphanage.location = location || orphanage.location;

        await orphanage.save();
        res.status(200).json({ message: "Orphanage updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating orphanage" });
    }
};

exports.deleteOrphanage = async (req, res) => {
    try {
        const orphanage = await Orphanage.findByPk(req.params.id);
        if (!orphanage) return res.status(404).json({ message: "Orphanage not found" });

        await orphanage.destroy();
        res.status(200).json({ message: "Orphanage deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting orphanage" });
    }
};
