const mongoose = require('mongoose');

const scanSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    type: { type: String, enum: ['message', 'url'], default: 'message' },
    result: { type: String, enum: ['Safe', 'Suspicious', 'Dangerous'], required: true },
    analysis: { type: String }, // Kept for backwards compatibility
    reasons: { type: [String] },
    keywords: { type: [String] },
    recommendation: { type: String },
    phishingIndicators: { type: [String] },
    socialEngineeringTactics: { type: [String] },
    confidence: { type: Number, min: 0, max: 100 },
    riskScore: { type: Number, min: 0, max: 100 },
    timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Scan', scanSchema);
