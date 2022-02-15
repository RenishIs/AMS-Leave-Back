const employee = require('../models/leaveManagement-user');
const leave = require('../models/leaveManagement-leave');
const generalFunction = require('../helper/general_functions');
const bcrypt = require("bcrypt");
const date = require('date-and-time')
const mongoose = require("mongoose");
const axios = require("axios").create({
    headers: {
        authorization: "Bearer xoxb-2880995876579-3035616222133-R4IFWRo11rSCccu8pPGPTZC6",
    }
});


module.exports.signup = async (req, res) => {
    const {
        body
    } = req;
    try {
        const findStatus = await employee.findOne({
            email: body.email
        });
        if (findStatus) {
            res.sendBadRequest("email already exist.")
        } else {
            bcrypt.hash(body.password, 10, async (err, hash) => {
                if (err) {
                    res.sendError("something went wrong")
                } else {
                    const createUser = new employee({
                        _id: new mongoose.Types.ObjectId(),
                        firstName: body.firstName,
                        lastName: body.lastName,
                        email: body.email,
                        password: hash,
                    });

                    const modelStatus = await createUser.save();
                    if (modelStatus) {
                        res.sendSuccess({}, "user create successfully.")
                    } else {
                        res.sendError("something went wrong")
                    }
                }
            });
        }
    } catch (error) {
        res.sendError(error.message)
    }

}

module.exports.login = async (req, res) => {
    const { body } = req;
    try {
        let findStatus = await employee.findOne({ email: body.email });
        if (findStatus) {

            findStatus = { ...findStatus }._doc;

            bcrypt.compare(body.password, findStatus.password, async (err, result) => {

                if (err) {
                    res.sendError(err.message);
                }

                if (!result) {
                    res.sendBadRequest("Email id or password is not valid.");
                }
                else {

                    /* remove pssword property */
                    delete findStatus['password'];
                    /* remove pssword property */


                    findStatus['token'] = await generalFunction.generateJWTToken(findStatus);;
                    res.sendSuccess(findStatus, "login successfully");
                }
            });
        }
        else {
            res.sendBadRequest("email is not valid.")
        }
    } catch (error) {
        res.sendError(error.message);
    }
}

module.exports.getUsers = async (req, res) => {
    try {
        let findEmployes = await employee.find().select("-password");
        res.sendSuccess(findEmployes)
    }
    catch (error) {
        res.sendError(error.message);
    }
}

module.exports.deleteUser = async (req, res) => {
    try {
        const deleteEmployee = await employee.findByIdAndDelete(req.params.id);
        if (deleteEmployee) {
            res.sendSuccess({}, "user delete successfully");
        } else {
            res.sendBadRequest("user not available");
        }
    } catch (error) {
        res.sendError(error.message);
    }
}


module.exports.deleteLeave = async (req, res) => {
    try {
        const { body } = req;
        const deleteEmployee = await leave.findByIdAndDelete(req.params.id);
        console.log('deleteEmployee: ', deleteEmployee);
        let user = await employee.findOne({ "_id": deleteEmployee.user_id });
        console.log('user: ', user);
        let fields = [
            {
                "type": "mrkdwn",
                "text": `*Name*\n${user?.firstName}  ${user?.lastName}`
            },
            {
                "type": "mrkdwn",
                "text": `*Reason*\n${deleteEmployee.reason}`
            },
        ]
        deleteEmployee.dates.filter((_) => {
            fields.push({
                "type": "mrkdwn",
                "text": `*Date*\n${_.date}`
            })
            fields.push({
                "type": "mrkdwn",
                "text": `*Type*\n${_.isFull ? 'Full leave' : 'Half leave'}`
            })
        })

        console.log('user: ', user);
        console.log('body: ', body);
        if (deleteEmployee) {
            axios.post("https://slack.com/api/chat.postMessage", {
                "channel": "#test",
                "blocks": [
                    {
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            "text": "Leave deleted"
                        },
                        "fields": fields
                    }
                ],
                "username": "Test App",
                "icon_emoji": ":white_check_mark:"
            }
            ).then(response => {
                res.sendSuccess("leave deleted successfully")
            }).catch((err) => {
                res.sendError(err);
            });
        } else {
            res.sendBadRequest("user not available");
        }
    } catch (error) {
        res.sendError(error.message);
    }
}


module.exports.getLeaves = async (req, res) => {
    try {
        let findEmployes = await leave.find();
        res.sendSuccess(findEmployes)
    }
    catch (error) {
        res.sendError(error.message);
    }
}


module.exports.addLeave = async (req, res) => {
    const { body } = req;
    let user = await employee.findOne({ "_id": body.user_id });

    try {
        /* add leave for empoyee */
        const leaveData = new leave({
            _id: new mongoose.Types.ObjectId(),
            user_id: body.user_id,
            dates: body.dates,
            noOfDays: body.noOfLeaves,
            reason: body.reason
        })

        let fields = [
            {
                "type": "mrkdwn",
                "text": `*Name*\n${user?.firstName}  ${user?.lastName}`
            },
            {
                "type": "mrkdwn",
                "text": `*Reason*\n${body.reason}`
            }

        ]
        leaveData.dates.filter((_) => {
            fields.push({
                "type": "mrkdwn",
                "text": `*Date*\n${_.date}`
            })
            fields.push({
                "type": "mrkdwn",
                "text": `*Type*\n${_.isFull ? 'Full leave' : 'Half leave'}`
            })
        })
        const addLeaveStatus = await leaveData.save();

        if (addLeaveStatus) {
            axios.post("https://slack.com/api/chat.postMessage", {
                "channel": "#test",
                "blocks": [
                    {
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            "text": "New leave!"
                        },
                        "fields": fields
                    }
                ],
                "username": "Test App",
                "icon_emoji": ":+1:"
            }
            ).then(response => {
                res.sendSuccess("leave added successfully")
            }).catch((err) => {
                res.sendError(err);
            });
        }
        else {
            res.sendError("something went wrong");
        }
    }
    catch (error) {
        res.sendError(error.message);
    }
}

module.exports.getLeaveByUserId = async (req, res) => {
    const { user } = req;
    try {
        const findStatus = await leave.find({ user_id: req.params.id });
        if (findStatus) {
            res.sendSuccess(findStatus, "leave details extracted");
        }
        else {
            res.sendSuccess([], "leave not available");
        }
    }
    catch (error) {
        res.sendError(error.message);
    }
}
async function newFunction(leaves) {
    var data = [];
    let all = await employee.find();
    leaves.filter((user) => {
        let name = all.find((_) => { return _.id === user.user_id });
        data.push({
            "type": "mrkdwn",
            "text": `*Name*\n${name?.firstName}  ${name?.lastName}`
        });
    });
    return data;
}

