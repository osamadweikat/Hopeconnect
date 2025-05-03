const express = require("express");
const { verifyToken } = require("../middleware/authMiddleware"); 
const donationTrackingController = require("../controllers/donationTrackingController");

const router = express.Router();

router.get("/", verifyToken, donationTrackingController.getDonationTracking);
router.put("/:donation_id/update", verifyToken, donationTrackingController.updateDonationStatus);



module.exports = router;
