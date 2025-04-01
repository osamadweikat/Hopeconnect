const express = require("express");
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");
const donationTrackingController = require("../controllers/donationTrackingController");

const router = express.Router();

router.get("/", verifyToken, donationTrackingController.getDonationTracking);

router.post("/:donation_id/update", verifyToken, verifyAdmin, donationTrackingController.updateDonationStatus);

module.exports = router;
