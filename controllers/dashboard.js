const mongoose = require("mongoose");
const dashboard = require('../models/dashboard');

module.exports.add = async (req, res) => {
    const { body } = req;
    try {
        const task = new dashboard({
            _id: new mongoose.Types.ObjectId(),
            todoName: body.todoName
        })
        const taskStatus = await task.save()
        if (taskStatus) {
            res.sendSuccess("Task added successfully");
        } else {
            res.sendError("Something went wrong")
        }
    } catch (error) {
        res.sendError(error.message)
    }
}

module.exports.delete = async (req, res) => {
    try {
        const deleteStatus = await dashboard.findByIdAndDelete({
            _id: req.params.id
        });
        if (deleteStatus) {
            res.sendSuccess([], "Record delete successfully")
        } else {
            res.sendBadRequest("Record not available");
        }
    } catch (error) {
        res.sendError(error.message)
    }
}

module.exports.get = async (req, res) => {
    try {
        const listStatus = await dashboard.find();
        if (listStatus.length > 0) {
            res.sendSuccess(listStatus, "Task list extracted");
        } else {
            res.sendSuccess([], "Task list not available");
        }
    } catch (error) {
        res.sendError(error.message)
    }
}