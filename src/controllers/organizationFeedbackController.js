const OrganizationFeedback = require("../models/OrganizationFeedback");
const Organization = require("../models/Organization");
const { sendFeedbackNotification } = require("../utils/emailService");

exports.submitOrganizationFeedback = async (req, res) => {
  try {
    const { reviewer_id, rating, comment, target_id } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const feedback = await OrganizationFeedback.create({
      reviewer_id,
      reviewer_type: "manager",
      target_id,
      target_type: "organization",
      rating,
      comment,
    });

    const organization = await Organization.findByPk(target_id);

    if (!organization) {
      console.log("Organization not found");
      return res.status(404).json({ message: "Target organization not found" });
    }

    if (!organization.contact_email) {
      console.log("Organization does not have an email");
      return res.status(400).json({ message: "Organization does not have a valid contact email" });
    }

    await sendFeedbackNotification(
      organization.contact_email,
      organization.organization_name,
      "manager",
      rating
    );

    res.status(201).json({ message: "Feedback for organization submitted", feedback });
  } catch (error) {
    console.error("Error submitting organization feedback:", error);
    res.status(500).json({ message: "Server error while submitting feedback" });
  }
};
