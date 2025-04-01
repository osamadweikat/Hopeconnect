const express = require("express");
const router = express.Router();
const chatbotController = require("../controllers/chatbotController");

if (!chatbotController.chatbotResponse) {
    console.error("Error: chatbotResponse function is missing in chatbotController!");
}

router.post("/message", chatbotController.chatbotResponse);

module.exports = router;
