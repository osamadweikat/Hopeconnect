const { sequelize } = require("../config/db");
const Donation = require("../models/Donation");
const Payment = require("../models/payment");

const fakePayment = async (amount) => {
    return {
        status: 200,
        transactionId: "TXN-" + Math.floor(Math.random() * 1000000),
        message: "Fake payment processed successfully"
    };
};

exports.processPayment = async (req, res) => {
    try {
        const { donor_id, amount, category } = req.body;

        const transactionFee = amount * 0.02;
        const finalAmount = amount - transactionFee;

        const paymentResponse = await fakePayment(amount);
        if (paymentResponse.status !== 200) {
            return res.status(400).json({ error: "Payment failed" });
        }

        const payment = await Payment.create({
            donor_id,
            amount: finalAmount,
            currency: "USD",
            transaction_id: paymentResponse.transactionId,
            status: "completed"
        });
    
        const donation = await Donation.create({
            donor_id,
            amount: finalAmount,
            category,
            status: "completed",
            transaction_id: paymentResponse.transactionId  
        });

        res.status(201).json({
            message: "Payment processed successfully with transaction fee",
            amountDeducted: finalAmount,
            transactionId: paymentResponse.transactionId,
            donationId: donation.id
        });

    } catch (error) {
        console.error("Error processing payment:", error);
        res.status(500).json({ message: "Server error" });
    }
};

exports.getPaymentHistory = async (req, res) => {
    try {
        const donor_id = req.user.id;

        const payments = await Payment.findAll({
            where: { donor_id },
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({ payments });
    } catch (error) {
        console.error("Error fetching payment history:", error);
        res.status(500).json({ error: "Error fetching payment history" });
    }
};
