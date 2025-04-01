const Emergency = require("../models/Emergency");
const User = require("../models/User");
const { sendEmail } = require("../utils/emailService");

exports.createEmergencyCase = async (req, res) => {
    try {
        const { description, target_amount } = req.body;
        const created_by = req.user.id;

        if (req.user.role !== "orphanage_manager") {
            return res.status(403).json({ error: "Only center managers can create emergencies." });
        }

        const emergency = await Emergency.create({
            description,
            target_amount,
            created_by
        });

        const donors = await User.findAll({ where: { role: "donor" } });

        donors.forEach(donor => {
            sendEmail(
                donor.email,
                "Urgent Emergency Support Needed",
                `A new emergency case has been created: "${description}". Your support is needed!`
            );
        });

        res.status(201).json({ message: "Emergency case created and donors notified.", emergency });
    } catch (error) {
        console.error("Error creating emergency case:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.getActiveEmergencies = async (req, res) => {
    try {
        const emergencies = await Emergency.findAll({ where: { status: "active" } });
        res.status(200).json({ emergencies });
    } catch (error) {
        console.error("Error fetching emergencies:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.donateToEmergency = async (req, res) => {
    try {
        const { emergency_id, amount } = req.body;
        const donor_id = req.user.id;

        const emergency = await Emergency.findByPk(emergency_id);
        if (!emergency) {
            return res.status(404).json({ error: "Emergency case not found." });
        }

        emergency.collected_amount += parseFloat(amount);
        await emergency.save();

        if (emergency.collected_amount >= emergency.target_amount) {
            emergency.status = "completed";
            await emergency.save();

            const donors = await User.findAll({ where: { role: "donor" } });

            donors.forEach(donor => {
                sendEmail(
                    donor.email,
                    "Thank You for Your Support!",
                    `The emergency case "${emergency.description}" has been successfully funded. Thank you for your generosity!`
                );
            });
        }

        res.status(200).json({ message: "Donation received.", emergency });
    } catch (error) {
        console.error("Error processing donation:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.deleteCompletedEmergency = async (req, res) => {
    try {
        const { emergency_id } = req.params;

        if (req.user.role !== "orphanage_manager") {
            return res.status(403).json({ error: "Only center managers can delete completed emergencies." });
        }

        const emergency = await Emergency.findByPk(emergency_id);
        if (!emergency) {
            return res.status(404).json({ error: "Emergency case not found." });
        }

        if (emergency.status !== "completed") {
            return res.status(400).json({ error: "Only completed emergencies can be deleted." });
        }

        await emergency.destroy();

        res.status(200).json({ message: "Completed emergency case successfully deleted." });
    } catch (error) {
        console.error("Error deleting emergency case:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
