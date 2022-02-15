const mongoose = require("mongoose");
/* model */
const notification = require('../models/notification');
/* model */

module.exports.add = async (req, res) => {
    const { body } = req;
    try {
        const notificationData = new notification({
            _id: new mongoose.Types.ObjectId(),
            name: body.name,
            description: body.description,
            startDate: body.startDate,
            endDate: body.endDate,
            employeeId: body.employeeId
        });
        const notificationStatus = await notification.save();
        if (notificationStatus) {
            res.sendSuccess({}, "Notification created successfully");
        }
        else {
            res.sendError("Somthing went wrong");
        }
    }
    catch (error) {
        res.sendError(error.message);
    }
}

module.exports.get = async (req, res) => {
    try {
        const findStatus = await notification.find();
        if (findStatus) {
            res.sendSuccess(findStatus, "Notification extracted");
        }
        else {
            res.sendSuccess([], "Notification not available");
        }
    }
    catch (error) {
        res.sendError(error.message);
    }
}

module.exports.delete = async (req, res) => {
    try {
        const deleteStatus = notification.findByIdAndDelete(req.params.id);
        if (deleteStatus) {
            res.sendSuccess({}, "Record delete successfully");
        }
        else { 
            res.sendBadRequest("Record not available");
        }
    }
    catch (error) {
        res.sendError(error.message);
    }
}

module.exports.put = async (req, res) => { 
    const { body } = req;
    try {
        const updateStatus = await notification.findByIdAndUpdate(req.params.id, {
            $set: {
                name: body.name,
                description: body.description,
                startDate: body.startDate,
                endDate: body.endDate,
                employeeId: body.employeeId,
                updated_at: Date.now()
            }
        })
        if (updateStatus) {
            res.sendSuccess({}, "Record update successfully");  
        }
        else { 
            res.sendError("Somthing went wrong");
        }
    }
    catch (error) {
        res.sendError(error.message);    
    }
}

module.exports.getById = async (req, res) => { 
    try {
        const findStatus = await notification.findById(req.params.id);
        if (findStatus) { 
            res.sendSuccess(findStatus, "Details extracted");
        }
        else {
            res.sendBadRequest("Record not available");
        }
    }
    catch (error) {
        res.sendError(error.message);
    }
}