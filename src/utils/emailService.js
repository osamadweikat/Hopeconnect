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

module.exports = {
    sendEmail,
    sendDonationConfirmation,
    sendSubscriptionConfirmation,
    sendSubscriptionCancellation,
    sendSubscriptionRenewalReminder,
    sendSubscriptionPaymentFailure
};
