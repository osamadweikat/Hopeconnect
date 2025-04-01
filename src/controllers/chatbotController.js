const { OpenAI } = require("openai");  
require("dotenv").config();


const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, 
});

exports.chatbotResponse = async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        const response = await openai.chat.completions.create({
            model: "gpt-4",  
            messages: [{ role: "user", content: message }],
            max_tokens: 100,
        });

        const reply = response.choices[0].message.content;

        res.json({ response: reply });

    } catch (error) {
        console.error("Chatbot Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
