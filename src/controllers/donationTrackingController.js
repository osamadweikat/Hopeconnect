const DonationTracking = require("../models/DonationTracking");
const Donation = require("../models/Donation");
const { sendEmail } = require("../utils/emailService");

exports.getDonationTracking = async (req, res) => {
    try {
        const { donor_id } = req.user;
        const donations = await Donation.findAll({ where: { donor_id } });

        if (!donations.length) {
            return res.status(404).json({ error: "No donations found for this donor." });
        }

        const trackingRecords = await Promise.all(
            donations.map(async (donation) => {
                const tracking = await DonationTracking.findAll({ where: { donation_id: donation.id } });
                return { donation, tracking };
            })
        );

        res.status(200).json(trackingRecords);
    } catch (error) {
        console.error("Error fetching donation tracking data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.updateDonationStatus = async (req, res) => {
    try {
        if (req.user.role !== "orphanage_manager") {
            return res.status(403).json({ error: "Only orphanage managers can update donation statuses." });
        }

        const { donation_id } = req.params;
        const { status, details } = req.body;

        const donation = await Donation.findByPk(donation_id);
        if (!donation) {
            return res.status(404).json({ error: "Donation not found." });
        }

        await DonationTracking.create({ donation_id, status, details });

        await sendEmail({
            to: donation.donor_email,
            subject: "Donation Status Update",
            text: `Dear donor,\n\nThe status of your donation has been updated to: ${status}.\n\nDetails: ${details}\n\nThank you for your support!\nHopeConnect Team`
        });

        res.status(200).json({ message: "Donation status updated and email sent.", status, details });
    } catch (error) {
        console.error("Error updating donation status:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
