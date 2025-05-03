const DonationTracking = require("../models/DonationTracking");
const Donation = require("../models/Donation");
const Orphanage = require("../models/Orphanage");
const User = require("../models/User");
const { sendEmail } = require("../utils/emailService");


exports.getDonationTracking = async (req, res) => {
    try {
        const donorId = req.user.id;
        const donations = await Donation.findAll({ where: { donor_id: donorId } });

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
        console.log("Authenticated user:", req.user);

        if (req.user.role !== "orphanage_manager") {
            console.warn("Unauthorized access: Not a manager");
            return res.status(403).json({ error: "Only orphanage managers can update donation statuses." });
        }

        const { donation_id } = req.params;
        const { status, details } = req.body;

        console.log(`Received update request for donation ID: ${donation_id}`);
        console.log(`Status: ${status}, Details: ${details}`);

        const donation = await Donation.findByPk(donation_id);
        if (!donation) {
            console.warn("Donation not found with ID:", donation_id);
            return res.status(404).json({ error: "Donation not found." });
        }

        const orphanage = await Orphanage.findOne({ where: { manager_id: req.user.id } });
        if (!orphanage) {
            console.warn("No orphanage found for manager ID:", req.user.id);
            return res.status(403).json({ error: "You do not manage any orphanage linked to this donation." });
        }

        console.log("Orphanage verified:", orphanage.name);

        await DonationTracking.create({ donation_id, status, details });
        console.log("Donation status logged in DonationTracking");

        const donorUser = await User.findByPk(donation.donor_id);
        if (!donorUser) {
            console.warn("Donor user not found for donation:", donation_id);
        } else {
            console.log("Donor user found:", donorUser.email);

            if (!donorUser.email || typeof donorUser.email !== 'string' || !donorUser.email.includes('@')) {
                console.error("Invalid donor email:", donorUser.email);
            } else {
                console.log("Sending email to donor...");
                await sendEmail(
                    donorUser.email.trim(),
                    "Donation Status Update",
                    `Dear donor,\n\nThe status of your donation has been updated to: ${status}.\n\nDetails: ${details}\n\nThank you for your support!\nHopeConnect Team`
                );
                console.log("Email sent successfully.");
            }
        }

        res.status(200).json({ message: "Donation status updated and email sent.", status, details });
    } catch (error) {
        console.error("Error updating donation status:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
