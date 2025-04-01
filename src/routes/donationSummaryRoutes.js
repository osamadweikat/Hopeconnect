const express = require("express");
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");
const donationSummaryController = require("../controllers/donationSummaryController");

const router = express.Router();

router.get("/summary", verifyToken, verifyAdmin, donationSummaryController.getDonationSummary);

router.post("/spend", verifyToken, verifyAdmin, donationSummaryController.addSpending);

module.exports = router;
