const db = require("../config/db");

const getSponsorshipPlans = async (req, res) => {
    try {
        const [plans] = await db.execute("SELECT * FROM SponsorshipPlans");
        res.json({ plans });
    } catch (error) {
        console.error("Error fetching sponsorship plans:", error);
        res.status(500).json({ message: "Error fetching sponsorship plans" });
    }
};

const sponsorWithPlan = async (req, res) => {
    const { orphan_id, plan_id, currency = "USD" } = req.body;
    const sponsor_id = req.user?.id;

    if (!sponsor_id) {
        return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    if (!orphan_id || !plan_id) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        const [orphan] = await db.execute("SELECT * FROM Orphans WHERE id = ?", [orphan_id]);
        if (orphan.length === 0) {
            return res.status(404).json({ message: "Orphan not found" });
        }

        const [plan] = await db.execute("SELECT * FROM SponsorshipPlans WHERE id = ?", [plan_id]);
        if (plan.length === 0) {
            return res.status(404).json({ message: "Sponsorship plan not found" });
        }

        const startDate = new Date();
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + plan[0].duration);

        await db.execute(
            "INSERT INTO Sponsorships (sponsor_id, orphan_id, amount, currency, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?)",
            [sponsor_id, orphan_id, plan[0].amount, currency, startDate, endDate]
        );

        res.status(201).json({ message: "Sponsorship successful" });
    } catch (error) {
        console.error("Error processing sponsorship:", error);
        res.status(500).json({ message: "Error processing sponsorship" });
    }
};

module.exports = { getSponsorshipPlans, sponsorWithPlan };
