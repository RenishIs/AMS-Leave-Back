const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        name: { type: String, unique: false },
        created_at: { type: Date, required: true, default: Date.now },
        updated_at: { type: Date },
    });

module.exports = mongoose.model('skill', skillSchema);