const express = require("express");
const { verifyToken, verifyManager } = require("../middleware/authMiddleware");
const volunteerController = require("../controllers/volunteerController");
const router = express.Router();

router.post("/announce", verifyToken, volunteerController.announceVolunteerAvailability);
router.get("/announcements", verifyToken, verifyManager, volunteerController.getVolunteerAnnouncements);
router.get("/requests", verifyToken, volunteerController.getVolunteerRequests);
router.post("/request", verifyToken, verifyManager, volunteerController.createVolunteerRequest);
router.post("/apply", verifyToken, volunteerController.applyForVolunteerRequest);
router.put("/approve/:assignment_id", verifyToken, verifyManager, volunteerController.approveVolunteer);
router.post("/rate", verifyToken, volunteerController.rateVolunteerExperience);

module.exports = router;
