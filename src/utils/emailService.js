require('dotenv').config();
const SibApiV3Sdk = require('sib-api-v3-sdk');
const fs = require('fs');
const generateReceipt = require('../utils/pdfGenerator');

const sendEmail = async (to, subject, message, attachmentPath = null) => {
    try {
        if (!process.env.BREVO_API_KEY || !process.env.BREVO_SENDER) {
            throw new Error("Missing Brevo API credentials.");
        }

        const client = SibApiV3Sdk.ApiClient.instance;
        const apiKey = client.authentications['api-key'];
        apiKey.apiKey = process.env.BREVO_API_KEY;

        const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
        const sendSmtpEmail = {
            to: [{ email: to }],
            sender: { email: process.env.BREVO_SENDER, name: "HopeConnect" },
            subject,
            htmlContent: `<p>${message}</p>`,
        };

        if (attachmentPath && fs.existsSync(attachmentPath)) {
            sendSmtpEmail.attachment = [
                {
                    content: fs.readFileSync(attachmentPath).toString('base64'),
                    name: attachmentPath.split('/').pop(),
                },
            ];
        }

        const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log('Email sent successfully:', response);
        return response;
    } catch (error) {
        console.error('Error sending email:', error.response?.body || error.message);
        throw error;
    }
};

const sendPartnershipSubmissionConfirmation = async (email, orgName) => {
    const subject = "Partnership Request Submitted - HopeConnect";
    const message = `
        Dear ${orgName},<br><br>
        Thank you for submitting your partnership request to <strong>HopeConnect</strong>.<br>
        Our team will review your application shortly. You will be notified once it's approved or rejected.<br><br>
        We appreciate your interest in collaborating with us.<br><br>
        Best regards,<br>
        HopeConnect Team
    `;
    return sendEmail(email, subject, message);
};


const sendPartnershipStatusUpdate = async (email, orgName, status, adminEmail = null) => {
    let subject, message;
  
    if (status === 'approved') {
      subject = "Your Partnership Request Has Been Approved - HopeConnect";
      message = `
        Dear ${orgName},<br><br>
        We're thrilled to inform you that your partnership request has been <strong>approved</strong>! <br>
        We deeply appreciate your commitment to supporting orphaned children and vulnerable communities.<br><br>
        Our team is excited to collaborate with you and create meaningful impact together.<br>
        Please stay tuned for further coordination.<br><br>
        Best regards,<br>
        HopeConnect Team
      `;
    } else if (status === 'rejected') {
      subject = "Your Partnership Request Was Not Approved - HopeConnect";
      message = `
        Dear ${orgName},<br><br>
        Thank you for your interest in partnering with HopeConnect.<br>
        After reviewing your request, we regret to inform you that it has not been approved at this time.<br><br>
        We encourage you to contact our administrator at <strong>${adminEmail || 'admin@hopeconnect.org'}</strong> to discuss the reasons for rejection and explore how we can potentially collaborate in the future.<br><br>
        You're always welcome to reapply after addressing any concerns.<br><br>
        Wishing you the best in your mission.<br><br>
        HopeConnect Team
      `;
    } else {
      subject = "Partnership Request Update - HopeConnect";
      message = `
        Dear ${orgName},<br><br>
        Your partnership request status has been updated to <strong>${status}</strong>.<br><br>
        Best regards,<br>
        HopeConnect Team
      `;
    }
  
    return sendEmail(email, subject, message);
  };
  

const sendPartnershipInfoUpdate = async (email, orgName) => {
    const subject = "Partnership Information Updated - HopeConnect";
    const message = `
        Dear ${orgName},<br><br>
        Your partnership information has been updated by HopeConnect's admin.<br>
        If you have any questions, feel free to reach out.<br><br>
        Best regards,<br>
        HopeConnect Team
    `;
    return sendEmail(email, subject, message);
};

const sendDonationConfirmation = async (donation, donorEmail) => {
    const receiptPath = await generateReceipt(donation);
    const subject = "Donation Confirmation - HopeConnect";
    const message = `Thank you for your generous donation of $${donation.amount} towards ${donation.category}. Your receipt is attached.`;
    return sendEmail(donorEmail, subject, message, receiptPath);
};

const sendSubscriptionConfirmation = async (email, planName, renewalDate) => {
    const subject = "Subscription Confirmed - HopeConnect";
    const message = `Thank you for subscribing to the "${planName}" plan. Your next billing date is ${renewalDate.toDateString()}.`;
    return sendEmail(email, subject, message);
};

const sendSubscriptionCancellation = async (email, planName) => {
    const subject = "Subscription Canceled - HopeConnect";
    const message = `Your subscription to the "${planName}" plan has been successfully canceled.`;
    return sendEmail(email, subject, message);
};

const sendSubscriptionRenewalReminder = async (email, planName, renewalDate) => {
    const subject = "Upcoming Subscription Renewal - HopeConnect";
    const message = `Your subscription to "${planName}" will renew on ${renewalDate.toDateString()}. If you wish to cancel, please do so before the renewal date.`;
    return sendEmail(email, subject, message);
};

const sendSubscriptionPaymentFailure = async (email, planName) => {
    const subject = "Payment Failed - HopeConnect";
    const message = `We were unable to process your payment for the "${planName}" plan. Please update your payment details to avoid cancellation.`;
    return sendEmail(email, subject, message);
};

const sendOrganizationReport = async (email, orgName, reportPath, reportTitle) => {
    const subject = `Your Activity Report - ${reportTitle} - HopeConnect`;
    const message = `
        Dear ${orgName},<br><br>
        Please find attached your detailed activity report titled <strong>${reportTitle}</strong>.<br>
        We value your continued support and dedication to orphaned children and the community.<br><br>
        Best regards,<br>
        HopeConnect Team
    `;
    return sendEmail(email, subject, message, reportPath);
};

const sendWithdrawalNoticeToAdmin = async (adminEmail, orgName, date, reason = '') => {
    const subject = `Partnership Withdrawal Notice - ${orgName}`;
    const message = `
        Admin,<br><br>
        The organization <strong>${orgName}</strong> has requested to withdraw from the partnership effective <strong>${new Date(date).toDateString()}</strong>.<br>
        ${reason ? `Reason: <em>${reason}</em><br><br>` : ''}
        Please follow up accordingly.<br><br>
        HopeConnect System
    `;
    return sendEmail(adminEmail, subject, message);
};

const sendFeedbackNotification = async (email, targetName, reviewerType, rating) => {
    if (!email) {
        console.error("Email is missing in sendFeedbackNotification!");
        throw new Error("Missing recipient email");
    }

    const subject = `You received new feedback - HopeConnect`;
    const message = `
        Dear ${targetName},<br><br>
        You have received a new ${reviewerType === "organization" ? "organization" : "orphanage manager"} rating of <strong>${rating}/5</strong>.<br>
        Thank you for continuing to contribute to a better support system.<br><br>
        HopeConnect Team
    `;
    return sendEmail(email, subject, message);
};


const sendWithdrawalConfirmationToOrg = async (email, orgName, date) => {
    const subject = "Partnership Withdrawal Request Received - HopeConnect";
    const message = `
      Dear ${orgName},<br><br>
      We have received your request to withdraw from the partnership effective <strong>${new Date(date).toDateString()}</strong>.<br>
      We appreciate the work we've done together and hope to collaborate again in the future.<br><br>
      Thank you for your support.<br>
      HopeConnect Team
    `;
    return sendEmail(email, subject, message);
  };
  


module.exports = {
    sendEmail,
    sendDonationConfirmation,
    sendSubscriptionConfirmation,
    sendSubscriptionCancellation,
    sendSubscriptionRenewalReminder,
    sendSubscriptionPaymentFailure,
    sendPartnershipStatusUpdate,
    sendPartnershipInfoUpdate,
    sendPartnershipSubmissionConfirmation,
    sendOrganizationReport,
    sendWithdrawalConfirmationToOrg,
    sendWithdrawalNoticeToAdmin,
    sendFeedbackNotification
};
