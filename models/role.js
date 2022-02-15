const mongoose = require('mongoose');

const roleSchema = mongoose.Schema({

    _id: mongoose.Schema.Types.ObjectId,
    role:{ type: String},
    created_at: { type: Date, required: true, default: Date.now },
    updated_at: { type: Date },
});

module.exports = mongoose.model('role', roleSchema);