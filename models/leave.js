const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema(
    {
        user_id: { type: String },
        title: { type: String },
        date: { type: Date },
        reason: { type: String },
        approved_by: [],
        rejected_by: [],
        attachments: { type: String },
        created_at: { type: Date, default: Date.now },
        assigened: []
    });

module.exports = mongoose.model('leave', leaveSchema);