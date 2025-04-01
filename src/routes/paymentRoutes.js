const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

router.post("/pay", paymentController.processPayment);
router.get("/history", paymentController.getPaymentHistory);

module.exports = router;
