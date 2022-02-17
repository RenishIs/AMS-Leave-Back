const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        candidateName: { type: String },
        technology: { type: String },
        experience: { type: Number },
        schedule: { type: String },
        interviewer: { type: String },
        interviewRound: { type: String },
        created_at: { type: Date, required: true, default: Date.now },
        updated_at: { type: Date },
        technologyName: { type: String },
    });

module.exports = mongoose.model('interview', interviewSchema);