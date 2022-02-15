const mongoose = require("mongoose");

/* model */
const project = require("../models/project");
/* model */

module.exports.add = async (req, res) => {
    const { body } = req;
    try {
        const projectData = new project({
            _id: new mongoose.Types.ObjectId(),
            Name: req.body.Name,
            Description: req.body.Description,
            projectStatus: req.body.projectStatus,
            projectType: req.body.projectType,
            Inhouse: req.body.Inhouse,
            teamMembers: req.body.teamMembers,
            isError: "false"
        })
        const addStatus = await projectData.save();
        if (addStatus) {
            res.sendSuccess({}, "Project add successfully");
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
        const findStatus = await project.find();
        if (findStatus) {
            res.sendSuccess(findStatus, "Project details extracted");
        }
        else {
            res.sendSuccess([], "Project not available");
        }
    }
    catch (error) {
        res.sendError(error.message);
    }
}

module.exports.delete = async (req, res) => {
    try {
        const deleteStatus = project.findByIdAndDelete(req.params.id);
        if (deleteStatus) {
            res.sendSuccess({}, "Project delete successfully");
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
        const updateStatus = project.findByIdAndUpdate(req.params.id, {
            $set: {
                Name: body.Name,
                Description: body.Description,
                Documents: body.Documents,
                projectStatus: body.projectStatus,
                projectType: body.projectType,
                Inhouse: body.Inhouse,
                teamMembers: body.teamMembers,
                updated_at: Date.now()
            }
        });
        if (updateStatus) {
            res.sendSuccess({}, "Project details updated");
        }
        else { 
            res.sendBadRequest("Record not available");
        } 
    }
    catch (error) {
        res.sendError(error.message);
    }
}

module.exports.getById = async (req, res) => {
    try {
        const findOneStatus = await project.findById(req, params.id);
        if (findOneStatus) {
            res.sendSuccess(findOneStatus, "Project details extracted");
        }
        else {
            res.sendBadRequest("Project not available");
        }
    }
    catch (error) {
        res.sendError(error.message);    
    }
}