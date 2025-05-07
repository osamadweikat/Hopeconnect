const { Op } = require("sequelize");
const Organization = require("../models/Organization");
const OrganizationFeedback = require("../models/OrganizationFeedback");
const OrganizationContribution = require("../models/OrganizationContribution");
const OrganizationReport = require("../models/OrganizationReport");
const PartnershipWithdrawal = require("../models/PartnershipWithdrawal");
const { sendFeedbackNotification, sendOrganizationReport, sendWithdrawalConfirmationToOrg, sendWithdrawalNoticeToAdmin } = require("../utils/emailService");
const generatePDFReport = require("../utils/orgReportGenerator");

exports.submitOrganizationFeedback = async (req, res) => {
    try {
      const { reviewer_id, rating, comment } = req.body;
      const target_id = req.body.target_id;
  
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
      if (organization) {
        await sendFeedbackNotification(
          organization.contact_email,
          organization.organization_name,
          "manager",
          rating
        );
      }
  
      res.status(201).json({ message: "Feedback for organization submitted", feedback });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error while submitting feedback" });
    }
  };

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
  
      if (!orphanage) {
        console.log("Orphanage not found");
        return res.status(404).json({ message: "Orphanage not found" });
      }

  
      if (!orphanage.manager || !orphanage.manager.email) {
        return res.status(400).json({ message: "Manager does not have a valid email address" });
      }
  
      await sendFeedbackNotification(
        orphanage.manager.email,
        orphanage.name,
        "organization",
        rating
      );
  
      res.status(201).json({ message: "Feedback for manager submitted", feedback });
  
    } catch (error) {
      console.error("Error in submitManagerFeedback:", error);
      res.status(500).json({ message: "Server error while submitting feedback" });
    }
  };


exports.getFeedbacks = async (req, res) => {
    try {
      const { target_id, target_type } = req.query;
  
      const whereClause = {};
      if (target_id) whereClause.target_id = target_id;
      if (target_type) whereClause.target_type = target_type;
  
      const feedbacks = await OrganizationFeedback.findAll({ where: whereClause });
      res.json({ feedbacks });
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
      res.status(500).json({ message: "Server error while fetching feedbacks" });
    }
  };
  

exports.sendReportToOrganization = async (req, res) => {
  const { organization_id, title } = req.body;
  try {
    const organization = await Organization.findByPk(organization_id);
    if (!organization) return res.status(404).json({ message: "Organization not found" });

    const reportPath = await generatePDFReport(organization_id, title); 

    await OrganizationReport.create({
      organization_id,
      title,
      report_path: reportPath,
      sent_at: new Date(),
    });

    await sendOrganizationReport(organization.contact_email, organization.organization_name, reportPath, title);

    res.status(200).json({ message: "Report generated and sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error sending report" });
  }
};

exports.addContribution = async (req, res) => {
  try {
    const { organization_id, type, title, description, amount } = req.body;
    const contribution = await OrganizationContribution.create({ organization_id, type, title, description, amount, date: new Date() });
    res.status(201).json({ message: "Contribution recorded", contribution });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error recording contribution" });
  }
};

exports.getOrganizationContributions = async (req, res) => {
  const { organization_id } = req.params;
  try {
    const contributions = await OrganizationContribution.findAll({ where: { organization_id } });
    res.json({ contributions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching contributions" });
  }
};

exports.withdrawPartnership = async (req, res) => {
  try {
    const { organization_id, reason, withdrawal_date } = req.body;
    const organization = await Organization.findByPk(organization_id);
    if (!organization) return res.status(404).json({ message: "Organization not found" });

    const withdrawal = await PartnershipWithdrawal.create({ organization_id, reason, withdrawal_date, status: "pending" });

    await sendWithdrawalConfirmationToOrg(organization.contact_email, organization.organization_name, withdrawal_date);
    await sendWithdrawalNoticeToAdmin("admin@hopeconnect.org", organization.organization_name, withdrawal_date, reason);

    res.status(201).json({ message: "Withdrawal request submitted", withdrawal });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error submitting withdrawal request" });
  }
};

exports.approveWithdrawalRequest = async (req, res) => {
  const { id } = req.params;
  try {
    const withdrawal = await PartnershipWithdrawal.findByPk(id);
    if (!withdrawal) return res.status(404).json({ message: "Withdrawal request not found" });

    withdrawal.status = "approved";
    await withdrawal.save();

    res.json({ message: "Withdrawal approved", withdrawal });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error approving withdrawal" });
  }
};
