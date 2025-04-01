const express = require("express");
const router = express.Router();
const sponsorshipController = require("../controllers/sponsorshipController"); 

router.get("/plans", sponsorshipController.getSponsorshipPlans);
router.post("/sponsor", sponsorshipController.sponsorWithPlan);

module.exports = router;
