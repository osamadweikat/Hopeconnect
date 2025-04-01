const db = require("../config/db");

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

        const [result] = await db.execute(
            'INSERT INTO Payments (donor_id, amount, currency, transaction_id, status) VALUES (?, ?, ?, ?, ?)',
            [donor_id, finalAmount, "USD", paymentResponse.transactionId, "completed"]
        );

        await db.execute(
            'INSERT INTO Donations (donor_id, amount, category, status) VALUES (?, ?, ?, ?)',
            [donor_id, finalAmount, category, "completed"]
        );

        res.status(201).json({
            message: "Payment processed successfully with transaction fee",
            amountDeducted: finalAmount,
            transactionId: paymentResponse.transactionId
        });

    } catch (error) {
        console.error("Error processing payment:", error);
        res.status(500).json({ message: "Server error" });
    }
};

exports.getPaymentHistory = async (req, res) => {
    try {
        const donor_id = req.user.id;
        const [payments] = await db.execute(
            "SELECT * FROM Payments WHERE donor_id = ?",
            [donor_id]
        );

        res.status(200).json({ payments });
    } catch (error) {
        console.error("Error fetching payment history:", error);
        res.status(500).json({ error: "Error fetching payment history" });
    }
};
