const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        name: { type: String, unique: false },
        description: { type: String },
        startDate: { type: Date },
        endDate: { type: Date },
        employeeId: { type: Array },
        createdAt: { type: Date, required: true, default: Date.now },
        updatedAt: { type: Date },
    });

module.exports = mongoose.model('notifications', notificationSchema);