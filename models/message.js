const mongoose = require('mongoose');

const conversationScheme = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    created_at: { type: Date },
    updated_at: { type: Date },
    created_by: { type: String },
    updated_by: { type: String },
    sender_id: { type: String },
    receiver_id: { type: String },
    group_name: { type: String },
    chat_type: { type: String },
    group_member_id: [{ type: String }],
    message_block: [
        {
            _id: mongoose.Schema.Types.ObjectId,
            sender_id: { type: String },
            receiver_id: { type: String },
            message: { type: String },
            kind: { type: String },
            created_at: { type: Date }
        }
    ]
});

module.exports = mongoose.model('Conversation', conversationScheme);