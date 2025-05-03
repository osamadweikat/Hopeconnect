const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const { verifyToken } = require("../middleware/authMiddleware");

router.post("/pay", verifyToken, paymentController.processPayment);
router.get("/history", verifyToken, paymentController.getPaymentHistory);

module.exports = router;
