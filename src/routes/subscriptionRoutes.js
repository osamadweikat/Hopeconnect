const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const subscriptionController = require("../controllers/subscriptionController");

router.get("/plans", subscriptionController.getAllPlans);

router.post("/subscribe", verifyToken, subscriptionController.subscribe);

router.post("/cancel", verifyToken, subscriptionController.cancelSubscription);

router.get("/my-subscriptions", verifyToken, subscriptionController.getUserSubscriptions);

module.exports = router;
