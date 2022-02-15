const mongoose = require("mongoose");
const employee = require("../models/employee");
const role = require("../models/role");
/* model */
const message = require('../models/message');
/* model */

module.exports.get = async (req, res) => {
    try {
        const find = await message.find();
        if (find.length > 0) {
            // message.findOne({ $or: [{ $and: [{ sender_id: req.params.senderId }, { receiver_id: req.params.receiverId }] }, { $and: [{ receiver_id: req.params.senderId }, { sender_id: req.params.receiverId }] }] })
            const findStatus = find.filter(item => (item.sender_id == req.params.senderId && item.receiver_id == req.params.receiverId) || (item.sender_id == req.params.receiverId && item.receiver_id == req.params.senderId));
            if (findStatus.length > 0) {
                res.sendSuccess(findStatus[0], "Details extarcted");
            }
            else {
                res.sendSuccess({}, "Details not available")
            }
        }
        else {
            res.sendSuccess({}, "Details not available")
        }
    }
    catch (error) {
        res.sendError(error.message);
    }
}

module.exports.add = async (req, res) => {
    const { body } = req;
    body.message_block._id = mongoose.Types.ObjectId();

    try {
        const messageData = new message({
            _id: new mongoose.Types.ObjectId(),
            created_at: body.created_at,
            updated_at: body.updated_at,
            created_by: body.created_by,
            updated_by: body.updated_by,
            sender_id: body.sender_id,
            receiver_id: body.receiver_id,
            chat_type: body.chat_type,
            group_member_id: body.group_member_id,
            group_name: body.group_name,
            message_block: body.message_block
        })
        if (body.chat_type === 'group') {
            const findStatus = await message.findOne({ group_member_id: body.group_member_id })
            if (findStatus) {
                res.sendBadRequest(`This members available as '${findStatus.group_name}' group name`)
            }
            else {
                const addStatus = await messageData.save()
                if (addStatus) {
                    res.sendSuccess(addStatus, "Conversation created");
                }
                else {
                    res.sendError("Somthing wrong went");
                }
            }
        }
        else {
            const addStatus = await messageData.save()
            if (addStatus) {
                res.sendSuccess(addStatus, "Conversation created");
            }
            else {
                res.sendError("Somthing wrong went");
            }
        }
    }
    catch (error) {
        res.sendError(error.message);
    }
}

module.exports.put = async (req, res) => {
    const { body } = req;
    body.message_block._id = mongoose.Types.ObjectId();
    try {
        const updateStatus = await message.findByIdAndUpdate(body.id, { $push: { message_block: body.message_block } }, { new: true })
        if (updateStatus) {
            res.sendSuccess(updateStatus, "Record updated");
        }
        else {
            res.sendError("Something wrong went")
        }
    }
    catch (error) {
        res.sendError(error.message);
    }
}

module.exports.getEmployeeChatList = async (req, res) => {
    try {
        const findStatus = await message.find();
        let employeeFilter = [];
        await employee.find(async (err, result) => {
            employeeFilter = result.filter((x) => (x._id != req.params.senderId));
        });
        employeeFilter.forEach(async (item) => {
            const data = (!!item.role) ? await role.findOne({ "_id": item.role }) : item;
            item.role = data.role;
        });
        setTimeout(() => {
            if (findStatus.length > 0) {
                employeeFilter.forEach(async (item, i) => {
                    const messageStatus = await message.findOne({ $or: [{ $and: [{ sender_id: req.params.senderId }, { receiver_id: item._id }] }, { $and: [{ receiver_id: req.params.senderId }, { sender_id: item._id }] }] });
                    if (messageStatus) {
                        item.lastMessage = messageStatus.message_block[messageStatus.message_block.length - 1].message
                    }

                    if ((employeeFilter.length - 1) == i) {
                        res.sendSuccess(employeeFilter, "Details extarcted");
                    }
                });
            }
            else {
                res.sendSuccess(employeeFilter, "Details extarcted");
            }
        }, 500);
    }
    catch (error) {
        res.sendError(error.message);
    }
}

module.exports.getAllGroup = async (req, res) => {
    try {
        const findStatus = await message.find({ chat_type: 'group' })
        if (findStatus) {
            res.sendSuccess(findStatus, "Details extracted");
        }
        else {
            res.sendError("Details not available");
        }
    }
    catch (error) {
        res.sendError(error.message);
    }
}

module.exports.findonegroup = async (req, res) => {
    try {
        const findStatus = await message.find();
        if (findStatus.length > 0) {
            const finalResponse = findStatus.filter(x => x._id == req.params.conversationId);
            res.sendSuccess(finalResponse[0], "Details extracted");
        }
        else {
            res.sendBadRequest("Message not available");
        }
    }
    catch (error) {
        res.sendError(error.message);
    }
}

module.exports.findGroupName = async (req, res) => {
    try {
        const updateSTatue = message.updateOne({ _id: req.params.conversationId }, { $set: { group_name: req.body.group_name } })
        if (updateSTatue) {
            res.sendSuccess({}, "Group name updated");
        }
        else {
            res.sendError("Somthing went wrong");
        }
    }
    catch (error) {
        res.sendError(error.message);
    }
}
