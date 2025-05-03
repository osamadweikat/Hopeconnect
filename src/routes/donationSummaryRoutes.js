const express = require("express");
const router = express.Router();
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");
const donationSummaryController = require("../controllers/donationSummaryController");

router.get("/summary", verifyToken, verifyAdmin, donationSummaryController.getDonationSummary);
router.post("/spend", verifyToken, donationSummaryController.addSpending);

module.exports = router;
