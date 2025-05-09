const Volunteer = require("../models/Volunteer");
const VolunteerRequest = require("../models/VolunteerRequest");
const VolunteerAssignment = require("../models/VolunteerAssignment");
const Orphanage = require("../models/Orphanage");
const User = require("../models/User");
const { sendEmail } = require("../utils/emailService");

exports.announceVolunteerAvailability = async (req, res) => {
    try {
        const { skills, availability, preferred_location } = req.body;
        const user_id = req.user.id;

        const existing = await Volunteer.findOne({ where: { user_id } });
        if (existing) return res.status(400).json({ error: "Volunteer already announced." });

        const volunteer = await Volunteer.create({ user_id, skills, availability, preferred_location });

        const managers = await User.findAll({ where: { role: "orphanage_manager" } });
        for (const manager of managers) {
            if (manager.email) {
                await sendEmail(
                    manager.email,
                    "New Volunteer Availability - HopeConnect",
                    `A new volunteer has announced availability.<br><br>Skills: ${skills}<br>Availability: ${availability}<br>Preferred Location: ${preferred_location}`
                );
            }
        }

        res.status(201).json({ message: "Volunteer announcement created successfully!", volunteer });
    } catch (error) {
        console.error("Error announcing volunteer availability:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.getVolunteerAnnouncements = async (req, res) => {
    try {
        const announcements = await Volunteer.findAll({ include: { model: User, as: "user", attributes: ["full_name", "email"] } });
        res.status(200).json(announcements);
    } catch (error) {
        console.error("Error fetching volunteer announcements:", error);
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

        const volunteers = await Volunteer.findAll({ include: { model: User, as: "user" } });
        for (const volunteer of volunteers) {
            const email = volunteer.user?.email;
            if (email) {
                await sendEmail(
                    email,
                    "New Volunteer Opportunity Available - HopeConnect",
                    `A new volunteer opportunity has been posted at orphanage "${orphanage.name}".<br><br>If you're interested, please log in to apply.`
                );
            }
        }

        res.status(201).json({ message: "Volunteer request created and notifications sent!", request });
    } catch (error) {
        console.error("Error creating volunteer request:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.applyForVolunteerRequest = async (req, res) => {
    try {
        const volunteer_id = req.user.id;
        const { volunteer_request_id } = req.body;

        const existing = await VolunteerAssignment.findOne({ where: { volunteer_id, volunteer_request_id } });
        if (existing) return res.status(400).json({ error: "You already applied to this request." });

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

        if (!assignment) {
            return res.status(404).json({ error: "Assignment not found." });
        }

        assignment.status = "confirmed";
        await assignment.save();

        const user = await User.findByPk(assignment.volunteer_id);
    
        const isValidEmail = user?.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email);

        if (isValidEmail) {
            const subject = "Volunteer Assignment Approved";
            const message = `Hello ${user.full_name}, your application to volunteer has been approved. Please contact the orphanage for more details.`;

            await sendEmail(user.email, subject, message);
        } else {
            console.warn("Skipped email sending due to invalid email:", user?.email);
        }

        res.status(200).json({ message: "Volunteer confirmed and email processed.", assignment });
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
