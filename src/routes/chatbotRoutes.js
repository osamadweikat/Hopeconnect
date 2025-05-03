const express = require("express");
const router = express.Router();
const chatbotController = require("../controllers/chatbotController");
const { verifyToken } = require("../middleware/authMiddleware");

router.post("/message", verifyToken, (req, res, next) => {
    if (req.user.role !== "donor") {
        return res.status(403).json({ error: "Only donors can use the chatbot." });
    }
    chatbotController.chatbotResponse(req, res);
});

module.exports = router;
