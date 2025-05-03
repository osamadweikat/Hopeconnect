const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.chatbotResponse = async (req, res) => {
    try {
        const user = req.user;
        if (user.role !== "donor") {
            return res.status(403).json({ error: "Access denied" });
        }

        const { message } = req.body;
        if (!message) return res.status(400).json({ error: "Message is required" });

        const model = genAI.getGenerativeModel({ model: "models/gemini-2.0-flash-lite" });

        const prompt = `You are a virtual assistant for a humanitarian platform called HopeConnect. Respond in a clear, realistic, and friendly way. Keep the answer very short and simple (1 to 2 sentences only). User question: ${message}`;


const result = await model.generateContent(prompt);


        const reply = result.response.text();
        res.json({ response: reply });

    } catch (error) {
        console.error("Gemini Error:", error);
        res.status(500).json({ error: "Gemini Internal Server Error" });
    }
};
