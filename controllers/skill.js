const skill = require('../models/skill');

module.exports.addSkill = async (req, res) => {
    const { body } = req;
    try {
        const skillStatus = await skill.insertMany(body.skills);
        if (skillStatus.length) {
            res.sendSuccess("Skill added successfully");
        }
        else { 
            res.sendError("Something went wrong");
        }
    }
    catch (error) {
        res.sendError(error.message)
    }
}

module.exports.getSkills = async (req, res) => { 
    try {
        const findSkill = await skill.find();
        if (findSkill.length > 0) {
            res.sendSuccess(findSkill, "Skill details extracted");
        }
        else {
            res.sendSuccess([], "Skills not available")
        }
    }
    catch (error) {
        res.sendError(error.message);
    }
}

module.exports.getById = async (req, res) => { 
    try {
        const findSkill = await skill.findById(req.params.id)
        if (findSkill) {
            res.sendSuccess(findSkill, "Skill details extaracted")
        }
        else {
            res.sendBadRequest("Skill not available");
        }
    }
    catch (error) {
        res.sendError(error.message)
    }
}

module.exports.update = async (req, res) => { 
    const { body } = req;
    try {
        const updateReq = {
            name: body.name,
            updated_at: Date.now()
        };

        const updateStatus = await skill.findByIdAndUpdate(updateReq);
        if (updateStatus) {
            res.sendSuccess({}, "Skill details update");
        }
        else {
            res.sendError("Something went wrong");
        }
    }
    catch (error) {
        res.sendError(error.message);
    }
}

module.exports.delete = async (req, res) => {
    try {
        const deleteSkill = await skill.findByIdAndDelete(req.params.id);
        if (deleteSkill) {
            res.sendSuccess({}, "Skill delete successfully");
        }
        else {
            res.sendBadRequest("Skill not available");
        }
    }
    catch (error) {
        res.sendError(error.message);
    }
}