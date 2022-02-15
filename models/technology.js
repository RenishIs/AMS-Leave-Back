const mongoose = require('mongoose');

const technologySchema = new mongoose.Schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        technologyName: { type: String },
        created_at: { type: Date, required: true, default: Date.now },
        updated_at: { type: Date },
    });

module.exports = mongoose.model('technology', technologySchema);