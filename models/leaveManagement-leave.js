const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        user_id: { type: String },
        dates: [{
            date: String,
            isFull: Boolean,
        }],
        noOfDays: { type: Number },
        reason: { type: String },
    });

module.exports = mongoose.model('LeaveManagement-leave', leaveSchema);