const { Donation } = require("../models");

exports.createDonation = async (req, res) => {
    try {
        
        if (req.user.role !== 'donor') {
            return res.status(403).json({ message: "Only donors can create donations." });
        }

    
        const donation = await Donation.create({
            ...req.body,
            donor_id: req.user.id, 
        });

        res.status(201).json(donation);
    } catch (err) {
        console.error("Create donation error:", err);
        res.status(500).json({ message: "Server error" });
    }
};


exports.getDonations = async (req, res) => {
    try {
        const donations = await Donation.findAll();
        res.json(donations);
    } catch (err) {
        console.error("Get donations error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.getDonationById = async (req, res) => {
    try {
        const donation = await Donation.findByPk(req.params.id);
        if (!donation) return res.status(404).json({ message: "Donation not found" });
        res.json(donation);
    } catch (err) {
        console.error("Get donation by ID error:", err);
        res.status(500).json({ message: "Server error" });
    }
};
