const express = require("express");
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");
const volunteerController = require("../controllers/volunteerController");

const router = express.Router();

router.post("/register", verifyToken, volunteerController.registerVolunteer);

router.get("/requests", verifyToken, volunteerController.getVolunteerRequests);

router.post("/request", verifyToken, verifyAdmin, volunteerController.createVolunteerRequest);

router.post("/apply", verifyToken, volunteerController.applyForVolunteerRequest);

router.put("/approve/:assignment_id", verifyToken, verifyAdmin, volunteerController.approveVolunteer);

router.post("/rate", verifyToken, volunteerController.rateVolunteerExperience);

module.exports = router;
