const express = require("express");
const router = express.Router();
const { getDonorDashboard, getVolunteerDashboard } = require("../controllers/dashboardController"); 
const { verifyToken } = require("../middleware/authMiddleware"); 

router.get("/donor", verifyToken, getDonorDashboard); 
router.get("/dashboard", verifyToken, getDonorDashboard); 
router.get("/volunteer", verifyToken, getVolunteerDashboard);
router.get("/donations", verifyToken, getDonorDashboard);

module.exports = router;
