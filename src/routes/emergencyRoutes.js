const express = require("express");
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");
const emergencyController = require("../controllers/emergencyController");

const router = express.Router();

router.post("/create", verifyToken, emergencyController.createEmergencyCase); 
router.get("/active", emergencyController.getActiveEmergencies); 
router.post("/donate", verifyToken, emergencyController.donateToEmergency); 
router.delete("/delete/:emergency_id", verifyToken, emergencyController.deleteCompletedEmergency); 

module.exports = router;
