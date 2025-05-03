const Subscription = require("../models/Subscription");
const SubscriptionPlan = require("../models/SubscriptionPlan");
const User = require("../models/User");
const { Op } = require("sequelize");
const { sendEmail, sendSubscriptionCancellation } = require("../utils/emailService");

exports.subscribe = async (req, res) => {
    try {
        const { plan_id } = req.body;
        const user_id = req.user.id;

        const user = await User.findByPk(user_id);
        if (!user) return res.status(404).json({ error: "User not found" });

        const plan = await SubscriptionPlan.findByPk(plan_id);
        if (!plan) return res.status(404).json({ error: "Plan not found" });

        const existingSubscription = await Subscription.findOne({
            where: { user_id, status: "active" }
        });

        let next_billing_date = new Date();
        if (plan.renewal_period === "monthly") next_billing_date.setMonth(next_billing_date.getMonth() + 1);
        if (plan.renewal_period === "quarterly") next_billing_date.setMonth(next_billing_date.getMonth() + 3);
        if (plan.renewal_period === "yearly") next_billing_date.setFullYear(next_billing_date.getFullYear() + 1);

        const subscription = await Subscription.create({
            user_id,
            plan_id,
            next_billing_date,
            status: "active"
        });

        await sendEmail(
            user.email,
            "Subscription Confirmed - HopeConnect",
            `Thank you for subscribing to the "${plan.name}" plan. Your next billing date is ${next_billing_date.toDateString()}.`
        );

        res.status(201).json({ message: "Subscription successful", subscription });
    } catch (error) {
        console.error("Error subscribing:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.cancelSubscription = async (req, res) => {
    try {
        const user_id = req.user.id;
        const { plan_id } = req.body;

        if (!plan_id) {
            return res.status(400).json({ error: "plan_id is required." });
        }

        const user = await User.findByPk(user_id);

        const subscription = await Subscription.findOne({
            where: { user_id, plan_id, status: "active" },
            include: [{ model: SubscriptionPlan, as: "SubscriptionPlan" }]
        });

        if (!subscription) {
            return res.status(404).json({ error: "No active subscription found for this plan." });
        }

        subscription.status = "canceled";
        await subscription.save();

        await sendSubscriptionCancellation(user.email, subscription.SubscriptionPlan.name);

        res.status(200).json({ message: "Subscription canceled successfully." });
    } catch (error) {
        console.error("Error canceling subscription:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.getAllPlans = async (req, res) => {
    try {
        const plans = await SubscriptionPlan.findAll();
        res.status(200).json(plans);
    } catch (error) {
        console.error("Error fetching plans:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.getUserSubscriptions = async (req, res) => {
    try {
        const user_id = req.user.id;
        const subscriptions = await Subscription.findAll({
            where: { user_id, status: "active" },
            include: [{ model: SubscriptionPlan, as: "SubscriptionPlan" }]
        });

        res.status(200).json(subscriptions);
    } catch (error) {
        console.error("Error fetching user subscriptions:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.sendRenewalReminders = async () => {
    try {
        const upcomingRenewals = await Subscription.findAll({
            where: {
                next_billing_date: {
                    [Op.lte]: new Date(new Date().setDate(new Date().getDate() + 3))
                },
                status: "active"
            },
            include: [
                { model: User },
                { model: SubscriptionPlan, as: "SubscriptionPlan" }
            ]
        });

        for (const subscription of upcomingRenewals) {
            await sendEmail(
                subscription.User.email,
                "Upcoming Subscription Renewal - HopeConnect",
                `Your subscription to "${subscription.SubscriptionPlan.name}" will renew on ${subscription.next_billing_date.toDateString()}. If you wish to cancel, please do so before the renewal date.`
            );
        }

        console.log("Subscription renewal reminders sent.");
    } catch (error) {
        console.error("Error sending renewal reminders:", error);
    }
};
