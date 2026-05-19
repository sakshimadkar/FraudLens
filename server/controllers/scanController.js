const Scan = require('../models/Scan');
const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

exports.performScan = async (req, res) => {
    try {
        const { content, type } = req.body;
        const userId = req.user.id;

        const prompt = `
            Analyze the following ${type}:
            "${content}"

            Determine if it is a scam, phishing attempt, or fraudulent content.

            IMPORTANT GUIDELINES FOR ACCURACY:
            - Be balanced and avoid false positives.
            - Do not mark normal delivery, banking, or app notifications (e.g., OTPs you requested, order updates) as suspicious UNLESS they contain:
              * phishing links or suspicious domains
              * unprompted OTP/password requests
              * unexpected payment demands
              * urgent threats (e.g., "account will be blocked in 24 hours")
              * fake verification requests
            - Messages from trusted brands like Swiggy, Zomato, Google, SBI, HDFC, etc., should be considered "Safe" unless strong scam indicators (like those above) are present.

            Provide your response in JSON format with the following fields:
            - "result": One of "Safe", "Suspicious", "Dangerous"
            - "reasons": An array of strings explaining the key reasons for this conclusion.
            - "keywords": An array of suspicious keywords found in the content.
            - "phishingIndicators": An array of specific phishing techniques found (e.g., "Spoofed sender", "Malicious URL").
            - "socialEngineeringTactics": An array of psychological tricks used (e.g., "False urgency", "Authority impersonation").
            - "recommendation": A short, actionable recommendation for the user.
            - "riskScore": A number from 0 to 100 representing the scam risk.
            - "confidence": A number from 0 to 100 representing your confidence in this assessment.

            Ensure the response is ONLY valid JSON.
        `;

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are a cybersecurity expert analyzing potential scams. Always respond in valid JSON format."
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],
            model: "llama-3.3-70b-versatile",
            response_format: { type: "json_object" }
        });

        const aiResponse = JSON.parse(chatCompletion.choices[0].message.content);

        const scan = await Scan.create({
            userId,
            content,
            type,
            result: aiResponse.result,
            analysis: aiResponse.analysis || '', // Optional fallback
            reasons: aiResponse.reasons || [],
            keywords: aiResponse.keywords || [],
            phishingIndicators: aiResponse.phishingIndicators || [],
            socialEngineeringTactics: aiResponse.socialEngineeringTactics || [],
            recommendation: aiResponse.recommendation || '',
            riskScore: aiResponse.riskScore || 0,
            confidence: aiResponse.confidence || 0        });

        res.status(201).json(scan);
    } catch (err) {
        console.error('Scan Error:', err);
        res.status(500).json({ message: 'Scam analysis failed' });
    }
};

exports.getHistory = async (req, res) => {
    try {
        const history = await Scan.find({ userId: req.user.id }).sort({ timestamp: -1 });
        res.json(history);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteScan = async (req, res) => {
    try {
        const scan = await Scan.findById(req.params.id);
        if (!scan || scan.userId.toString() !== req.user.id) {
            return res.status(404).json({ message: 'Scan not found' });
        }
        await scan.deleteOne();
        res.json({ message: 'Scan deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
