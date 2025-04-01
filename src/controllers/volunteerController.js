const Volunteer = require("../models/Volunteer");
const VolunteerRequest = require("../models/VolunteerRequest");
const VolunteerAssignment = require("../models/VolunteerAssignment");
const Orphanage = require("../models/Orphanage");
const { sendEmail } = require("../utils/emailService");

exports.registerVolunteer = async (req, res) => {
    try {
        const { skills, availability, preferred_location } = req.body;
        const user_id = req.user.id;

        const volunteer = await Volunteer.create({ user_id, skills, availability, preferred_location });

        res.status(201).json({ message: "Volunteer profile created successfully!", volunteer });
    } catch (error) {
        console.error("Error registering volunteer:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.getVolunteerRequests = async (req, res) => {
    try {
        const requests = await VolunteerRequest.findAll({ where: { status: "open" } });
        res.status(200).json(requests);
    } catch (error) {
        console.error("Error fetching volunteer requests:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.createVolunteerRequest = async (req, res) => {
    try {
        const { orphanage_id, description } = req.body;

        const orphanage = await Orphanage.findByPk(orphanage_id);
        if (!orphanage) return res.status(404).json({ error: "Orphanage not found." });

        const request = await VolunteerRequest.create({ orphanage_id, description });

        res.status(201).json({ message: "Volunteer request created successfully!", request });
    } catch (error) {
        console.error("Error creating volunteer request:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.applyForVolunteerRequest = async (req, res) => {
    try {
        const volunteer_id = req.user.id;
        const { volunteer_request_id } = req.body;

        const assignment = await VolunteerAssignment.create({ volunteer_id, volunteer_request_id });

        res.status(201).json({ message: "Application submitted successfully!", assignment });
    } catch (error) {
        console.error("Error applying for volunteer request:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.approveVolunteer = async (req, res) => {
    try {
        const { assignment_id } = req.params;
        const assignment = await VolunteerAssignment.findByPk(assignment_id);

        if (!assignment) return res.status(404).json({ error: "Assignment not found." });

        assignment.status = "confirmed";
        await assignment.save();

        await sendEmail({
            to: req.user.email,
            subject: "Volunteer Assignment Approved",
            text: `Hello, your application to volunteer has been approved. Please contact the orphanage for more details.`,
        });

        res.status(200).json({ message: "Volunteer confirmed and email sent.", assignment });
    } catch (error) {
        console.error("Error approving volunteer:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.rateVolunteerExperience = async (req, res) => {
    try {
        const { assignment_id, rating, review } = req.body;

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ error: "Rating must be between 1 and 5." });
        }

        const assignment = await VolunteerAssignment.findByPk(assignment_id);
        if (!assignment) return res.status(404).json({ error: "Assignment not found." });

        assignment.rating = rating;
        assignment.review = review;
        await assignment.save();

        res.status(200).json({ message: "Volunteer experience rated successfully!", assignment });
    } catch (error) {
        console.error("Error rating volunteer experience:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
