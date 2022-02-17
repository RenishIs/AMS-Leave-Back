const interview = require('../models/interview');
const technology = require('../models/technology');
const employee = require('../models/employee');
const mongoose = require("mongoose");

module.exports.addInterview = async (req, res) => {
    const { body } = req;
    try {
        const interviewCreate = new interview({
            _id: new mongoose.Types.ObjectId(),
            candidateName: body.candidateName,
            technology: body.technology,
            experience: body.experience,
            interviewRound: body.interviewRound,
            schedule: body.schedule,
            interviewer: '',
        });

        const create = await interviewCreate.save();
        if (create) {
            res.sendSuccess({}, "Interview added successfully");
        }
        else {
            res.sendError("Something went wrong");
        }
    }
    catch (error) {
        res.sendError(error.message)
    }
}

module.exports.getInterview = async (req, res) => {
    try {
        const findInterview = await interview.find();
        for (const item of findInterview) {
            const data = (!!item?.technology) ? await technology.findOne({
                "_id": item.technology
            }) : {}
            item.technologyName = data?.technologyName;

            const obj = (!!item?.interviewer) ? await employee.findOne({
                "_id": item.interviewer
            }) : {}
            item.interviewer = obj?.firstName + ' ' + obj?.lastName;
        }
        if (findInterview.length > 0) {
            res.sendSuccess(findInterview, "Interview details extracted");
        }
        else {
            res.sendSuccess([], "Interview not available")
        }
    }
    catch (error) {
        res.sendError(error.message);
    }
}

module.exports.delete = async (req, res) => {
    try {
        const deleteInterview = await interview.findByIdAndDelete(req.params.id);
        if (deleteInterview) {
            res.sendSuccess({}, "Interview delete successfully");
        }
        else {
            res.sendBadRequest("Interview not available");
        }
    }
    catch (error) {
        res.sendError(error.message);
    }
}

module.exports.put = async (req, res) => {
    const { body } = req;
    try {
        const updateInterview = await interview.findByIdAndUpdate(req.params.id, {
            $set: {
                candidateName: body.candidateName,
                technology: body.technology,
                experience: body.experience,
                schedule: body.schedule,
                interviewRound: body.interviewRound,
                interviewer: '',
                updated_at: Date.now()
            }
        });
        if (updateInterview) {
            res.sendSuccess({}, "Interview update successfully");
        }
        else {
            res.sendBadRequest("Interview not available");
        }
    }
    catch (error) {
        res.sendError(error.message);
    }
}

module.exports.acceptInterview = async (req, res) => {
    const { body } = req;
    try {
        const updateInterview = await interview.updateOne({ _id: req.params.id }, { $set: { interviewer: body.interviewer } })
        if (updateInterview) {
            res.sendSuccess({}, "Accept interview successfully");
        }
        else {
            res.sendBadRequest("Interview not available");
        }
    }
    catch (error) {
        res.sendError(error.message);
    }
}