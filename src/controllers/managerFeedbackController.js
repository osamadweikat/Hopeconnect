const OrganizationFeedback = require("../models/OrganizationFeedback");
const Orphanage = require("../models/Orphanage");
const User = require("../models/User"); 
const { sendFeedbackNotification } = require("../utils/emailService");

exports.submitManagerFeedback = async (req, res) => {
  try {
    const { reviewer_id, rating, comment, target_id } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const feedback = await OrganizationFeedback.create({
      reviewer_id,
      reviewer_type: "organization",
      target_id,
      target_type: "orphanage",
      rating,
      comment,
    });

    const orphanage = await Orphanage.findByPk(target_id, {
      include: [{ model: User, as: "manager" }],
    });

    if (!orphanage || !orphanage.manager || !orphanage.manager.email) {
      console.log("Manager email not found!");
      return res.status(400).json({ message: "Manager email not available" });
    }

    await sendFeedbackNotification(
      orphanage.manager.email,
      orphanage.name,
      "organization",
      rating
    );

    res.status(201).json({ message: "Feedback for manager submitted", feedback });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while submitting feedback" });
  }
};
