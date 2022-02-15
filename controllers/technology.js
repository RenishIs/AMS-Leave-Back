const technology = require('../models/technology');
const mongoose = require("mongoose");

module.exports.addTechnology = async (req, res) => {
    const { body } = req;
    try {
        const technologyStatus = new technology({
            _id: new mongoose.Types.ObjectId(),
            technologyName: body.technologyName,
        });

        const create = await technologyStatus.save();
        if (create) {
            res.sendSuccess({}, "Technology added successfully");
        }
        else {
            res.sendError("Something went wrong");
        }
    }
    catch (error) {
        res.sendError(error.message)
    }
}

module.exports.getTechnologies = async (req, res) => {
    try {
        const findTechnology = await technology.find();
        if (findTechnology.length > 0) {
            res.sendSuccess(findTechnology, "Technology details extracted");
        }
        else {
            res.sendSuccess([], "Technology not available")
        }
    }
    catch (error) {
        res.sendError(error.message);
    }
}

module.exports.delete = async (req, res) => {
    try {
        const deleteTechnology = await technology.findByIdAndDelete(req.params.id);
        if (deleteTechnology) {
            res.sendSuccess({}, "Technology delete successfully");
        }
        else {
            res.sendBadRequest("Technology not available");
        }
    }
    catch (error) {
        res.sendError(error.message);
    }
}