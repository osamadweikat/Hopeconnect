const express = require("express");
const router = express.Router();
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");
const { downloadAdminReport } = require("../controllers/adminDashboardController");

router.get("/report", verifyToken, verifyAdmin, downloadAdminReport);

module.exports = router;
