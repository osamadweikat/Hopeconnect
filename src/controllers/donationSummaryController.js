const Donation = require("../models/Donation");
const DonationSpending = require("../models/DonationSpending");

exports.getDonationSummary = async (req, res) => {
    try {
        if (req.user.role !== "orphanage_manager") {
            return res.status(403).json({ error: "Only orphanage managers can access donation summaries." });
        }

        const totalDonations = await Donation.sum("amount", { where: { status: "completed" } });

        const totalSpent = await DonationSpending.sum("amount_spent");

        const spendingDetails = await DonationSpending.findAll();

        const remainingBalance = totalDonations - totalSpent;

        res.status(200).json({
            totalDonations: totalDonations || 0,
            totalSpent: totalSpent || 0,
            remainingBalance: remainingBalance || 0,
            spendingDetails
        });
    } catch (error) {
        console.error("Error fetching donation summary:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.addSpending = async (req, res) => {
    try {
        if (req.user.role !== "orphanage_manager") {
            return res.status(403).json({ error: "Only orphanage managers can record spending." });
        }

        const { donation_id, amount_spent, category, description } = req.body;

        const donation = await Donation.findByPk(donation_id);
        if (!donation) {
            return res.status(404).json({ error: "Donation not found." });
        }

        const spending = await DonationSpending.create({ donation_id, amount_spent, category, description });

        res.status(201).json({ message: "Spending record added.", spending });
    } catch (error) {
        console.error("Error adding spending record:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
