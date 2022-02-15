const mongoose = require('mongoose');
const todoSchema =new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    todoName:{ type: String, required: true },
})
module.exports = mongoose.model('Todo', todoSchema);