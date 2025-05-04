const db = require("../config/db");
const Donation = require("../models/Donation");
const Sponsorship = require("../models/Sponsorship");
const User = require("../models/User"); 
const { sendDonationConfirmation } = require("../utils/emailService");
const Payment = require("../models/payment"); 
const generateReceipt = require("../utils/generateReceipt");
const DonationUpdate = require("../models/donationUpdate");
const VolunteerAssignment = require("../models/VolunteerAssignment");
const VolunteerRequest = require("../models/VolunteerRequest");

const fakePayment = async (req, res) => {
    return { status: 200, message: "Payment successful", transaction_id: `txn_${Date.now()}` };
};

exports.getDonorDashboard = async (req, res) => {
    try {
        const donor_id = req.user.id;
        const donations = await Donation.findAll({ where: { donor_id }, order: [["createdAt", "DESC"]] });
        const payments = await Payment.findAll({ where: { donor_id }, order: [["createdAt", "DESC"]] });

        const donationWithReceiptsAndUpdates = await Promise.all(
            donations.map(async (donation) => {
                const receiptPath = `./receipts/receipt_${donation.id}.pdf`;
                const updates = await DonationUpdate.findAll({ where: { donation_id: donation.id } });
                return {
                    ...donation.toJSON(),
                    receipt_url: receiptPath,
                    updates,
                };
            })
        );

        res.status(200).json({ donations: donationWithReceiptsAndUpdates, payments });
    } catch (error) {
        console.error("Error fetching donor dashboard:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.getVolunteerDashboard = async (req, res) => {
    const volunteer_id = req.user.id;

    try {
        const assignments = await VolunteerAssignment.findAll({
            where: { volunteer_id },
            include: [
                {
                    model: VolunteerRequest,
                    as: 'volunteer_request'
                }
            ]
        });

        const volunteerRequests = assignments.map(a => a.volunteer_request);

        res.json({
            message: "Volunteer Dashboard data retrieved successfully",
            volunteerRequests,
        });
    } catch (error) {
        console.error("Error fetching volunteer dashboard:", error);
        res.status(500).json({ message: "Error fetching volunteer dashboard" });
    }
};

exports.processDonation = async (req, res) => {
    try {
        const { donor_id, amount, category, currency } = req.body;

        const paymentResponse = await fakePayment(req, res);
        if (paymentResponse.status !== 200) {
            return res.status(400).json({ error: "Payment failed" });
        }

        const donation = await Donation.create({
            donor_id,
            amount,
            category,
            currency, 
            status: "completed",
        });

        const donor = await User.findByPk(donor_id);
        if (!donor) {
            return res.status(404).json({ error: "Donor not found" });
        }

        await sendDonationConfirmation(donation, donor.email);

        res.status(201).json({ message: "Donation processed and email sent", donation });
    } catch (error) {
        console.error("Error processing donation:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
