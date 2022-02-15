const bcrypt = require("bcrypt");
const employee = require("../models/employee");
const role = require('../models/role');
const mongoose = require("mongoose");
const generalFunction = require('../helper/general_functions');
const config = require('../config/config');
require('dotenv');

module.exports.signup = async (req, res) => {
    const {
        body
    } = req;
    try {
        const findStatus = await employee.findOne({
            email: body.email
        });
        if (findStatus) {
            res.sendBadRequest("Email already exist.")
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
                        // phone: body.phone,
                        password: hash,
                        sendInvitation: false,
                        // Department: body.Department,
                        // leaveBalance: body.leaveBalance,
                        // bloodGroup: body.bloodGroup,
                        role: body.role,
                        technology: body.technology,
                        // skill: body.skill,
                        // reportingUser: body.reportingUser,
                        // employeeReportManager: body.employeeReportManager,
                    });

                    const modelStatus = await createUser.save();
                    if (modelStatus) {
                        res.sendSuccess({}, "User create successfully.")
                    } else {
                        res.sendError("Something went wrong")
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

                    const data = (!!findStatus.role) ? await role.findOne({ "_id": findStatus.role }) : {}
                    findStatus.role = data?.role

                    findStatus['token'] = await generalFunction.generateJWTToken(findStatus);;
                    res.sendSuccess(findStatus, "Login successfully");
                }
            });
        }
        else {
            res.sendBadRequest("Email id or password is not valid.")
        }
    } catch (error) {
        res.sendError(error.message);
    }
}

module.exports.changePassword = async (req, res) => {
    const {
        body
    } = req;
    bcrypt.hash(body.password, 10, async (err, hash) => {
        if (err) {
            res.sendError(err.message);
        } else {
            const modelStatus = await employee.findByIdAndUpdate(body.id, {
                $set: {
                    password: hash,
                    isAuthorize: true,
                    updated_at: Date.now()
                }
            })
            if (modelStatus) {
                res.sendSuccess({}, "Password change successfully")
            } else {
                res.sendError("Password not change");
            }
        }
    });
}

module.exports.indirectSignup = async (req, res) => {
    const {
        body
    } = req;
    try {
        const findStatus = await employee.findOne({
            email: body.email
        });
        if (findStatus) {
            res.sendBadRequest("Email alredy exist.")
        } else {
            const createUser = new employee({
                _id: new mongoose.Types.ObjectId(),
                firstName: body.firstName,
                gender: body.gender,
                lastName: body.lastName,
                email: body.email,
                phone: body.phone,
                sendInvitation: false,
                Department: body.Department,
                ctc: body.ctc,
                dateOfJoining: body.dateOfJoining,
                designation: body.designation,
                employeeLevel: body.employeeLevel,
                reportingTo: body.reportingTo,
                workExperience: body.workExperience,
                reportingUser: body.reportingUser,
                educationDetail: body.educationDetail,

                experienceDetail: body.experienceDetail,

                officialDOB: body.officialDOB,
                maritalStatus: body.maritalStatus,
                presentAddress: body.presentAddress,
                permanentAddress: body.permanentAddress,
                bloodGroup: body.bloodGroup,
                emergFirstName: body.emergFirstName,
                emergLastName: body.emergLastName,
                contactNumber: body.contactNumber,
                relationShip: body.relationShip,
                hobbies: body.hobbies,
                about: body.about,
                skill: body.skill,
                role: body.role
            });
            const modelStatus = await createUser.save();
            if (modelStatus) {
                res.sendSuccess(modelStatus, "User create successfully.")
            } else {
                res.sendError("Something went wrong")
            }
        }
    } catch (error) {
        res.sendError(error.message);
    }
}

module.exports.sendInvitation = async (req, res) => {

    const { body } = req;
    const randomPassword = Math.random().toString().slice(-8)

    try {
        const findStatus = await employee.findOne({ email: body.email });
        if (findStatus) {
            res.sendBadRequest("Email already exist.")
        }
        else {
            const findRoleStatus = await role.findOne({ role: 'employee' });
            if (findRoleStatus) {
                bcrypt.hash(randomPassword, 10, async (err, hash) => {
                    if (err) {
                        res.sendError(err.message)
                    }

                    if (!hash) {
                        res.sendError("Somthing went wrong");
                    }
                    else {
                        const createUser = new employee({
                            _id: new mongoose.Types.ObjectId(),
                            firstName: "Your",
                            lastName: "Name",
                            sendInvitation: true,
                            email: body.email,
                            password: hash,
                            role: findRoleStatus._id
                        });

                        const modelStatus = await createUser.save();
                        if (modelStatus) {
                            /* registration mail*/
                            let mailObj = {
                                mail_file: "registration.hbs",
                                data: {
                                    company_name: 'Albiorix Technology Pvt. Ltd',
                                    company_link: 'https://www.albiorixtech.com/',
                                    user_email: modelStatus.email,
                                    user_password: randomPassword,
                                    user_name: `${modelStatus.firstName} ${modelStatus.lastName}`,
                                    login_link: `${process.env.ANGULAR_CONNECTION_STRING}employee/${modelStatus._id}`
                                },
                                to: body.email,
                                cc: ['renish.albiorix@gmail.com', 'aakash.albiorix@gmail.com'],
                                subject: "Registration"
                            };

                            await generalFunction.sendMail(mailObj);
                            /* registration mail*/

                            res.sendSuccess({}, "Registration successfully");
                        } else {
                            res.sendError("Something went wrong")
                        }
                    }
                });
            }
            else {
                res.sendError("Employee role is not available")
            }
        }
    }
    catch (error) {
        res.sendError(error.message);
    }
}

module.exports.passwordResetByHR = async (req, res) => {
    const { body } = req;
    try {
        let findStatus = await employee.findOne({ email: body.email });
        if (findStatus) {
            const randomPassword = Math.random().toString().slice(-8);
            bcrypt.hash(randomPassword, 10, async (err, hash) => {
                if (err) {
                    res.sendError(err.message);
                }
                else {
                    const updateStatus = await employee.findByIdAndUpdate(findStatus._id, {
                        $set: { password: hash, isAuthorize: true, updated_at: Date.now() }
                    })
                    if (updateStatus) {

                        /* reset password login details mail*/
                        let mailObj = {
                            mail_file: "registration.hbs",
                            data: {
                                company_name: 'Albiorix Technology Pvt. Ltd',
                                company_link: 'https://www.albiorixtech.com/',
                                user_email: updateStatus.email,
                                user_password: randomPassword,
                                user_name: `${updateStatus.firstName} ${updateStatus.lastName}`,
                                login_link: `${process.env.ANGULAR_CONNECTION_STRING}employee/${updateStatus._id}`
                            },
                            to: body.email,
                            subject: "Reset password"
                        };

                        await generalFunction.sendMail(mailObj);
                        /* reset password login details */

                        res.sendSuccess({}, "Please check your for login details");
                    }
                    else {
                        res.sendError("Somthing went wrong");
                    }
                }
            })
        }
        else {
            res.sendBadRequest("user not available");
        }
    }
    catch (error) {
        res.sendError(error.message);
    }
}

/* not change */
module.exports.multipleEmployeeCreate = async (req, res) => {
    const { body } = req;
    try {
        const employeeList = await employee.insertMany(body);
        if (employeeList.length > 0) {
            employeeList.map((item, i) => {
                bcrypt.compare(item.password, body[i].original_password, async function (err, res) {
                    if (!err) {
                        let user = {
                            email: item.email,
                            password: body[i].original_password
                        }
                        await multipleUserSendMail(user, info => { });
                    }
                    else {
                        res.sendError(err.message);
                        return false;
                    }
                });
            });
            await res.sendSuccess({}, "Employee created");
        }
    }
    catch (error) {
        res.sendError(error.message);
    }
}
/* not change */

module.exports.getProfileByEmail = async (req, res) => {
    const {
        body
    } = req;
    try {
        const findEmployee = await employee.findOne({
            email: body.email
        }).select("-password")
        if (findEmployee) {
            res.sendSuccess(findEmployee, "User details expracted");
        } else {
            res.sendBadRequest("User not available");
        }
    } catch (error) {
        res.sendError(error.message);
    }
}

module.exports.updateProfileImage = async (req, res) => {
    try {
        const modelStatus = await employee.findByIdAndUpdate(req.params.id, {
            $set: {
                image: req.file.path,
                updated_at: Date.now()
            }
        })
        if (modelStatus) {
            res.sendSuccess("Employee updated");
        } else {
            res.sendError("Employee not found")
        }
    } catch (error) {
        res.sendError(error.message);
    }
}

module.exports.getEmployes = async (req, res) => {
    try {
        let findEmployes = await employee.find().select("-password");
        if (findEmployes.length > 0) {
            for (const item of findEmployes) {
                const data = (!!item?.role) ? await role.findOne({
                    "_id": item.role
                }) : {}
                item.role = data?.role
            }
            await res.sendSuccess(findEmployes, "Employee details extracted");
        } else {
            res.sendSuccess([], "Employee not available")
        }
    } catch (error) {
        res.sendError(error.message);
    }
}

module.exports.getProfileById = async (req, res) => {
    try {
        const findEmployee = await employee.findById(req.params.id).select('-password');
        if (findEmployee) {
            res.sendSuccess(findEmployee, "Employee details extaracted")
        } else {
            res.sendBadRequest("Employee not available");
        }
    } catch (error) {
        res.sendError(error.message)
    }
}

module.exports.updateProfile = async (req, res) => {
    const {
        body
    } = req;
    try {
        const updateReq = {
            firstName: body.firstName,
            middleName: body.middleName,
            lastName: body.lastName,
            phone: body.phone,
            Department: body.Department,
            bloodGroup: body.bloodGroup,
            role: body.role,
            skill: body.skill,
            LeavesDate: body.LeavesDate,
            numberofLeave: body.numberofLeave,
            updated_at: Date.now(),
        };
        if (req.file) updateReq['profileImage'] = req.file.path;

        const updateStatus = await employee.findByIdAndUpdate(updateReq);
        if (updateStatus) {
            res.sendSuccess({}, "Employee details update");
        } else {
            res.sendError("Something went wrong");
        }
    } catch (error) {
        res.sendError(error.message);
    }
}

module.exports.updateEmploye = async (req, res) => {
    const {
        body
    } = req;
    try {
        const updateReq = {
            gender: body.gender,
            email: body.email,
            ctc: body.ctc,
            dateOfJoining: body.dateOfJoining,
            designation: body.designation,
            employeeLevel: body.employeeLevel,
            reportingTo: body.reportingTo,
            workExperience: body.workExperience,

            educationDetail: body.educationDetail,

            experienceDetail: body.experienceDetail,

            officialDOB: body.officialDOB,
            maritalStatus: body.maritalStatus,
            presentAddress: body.presentAddress,
            permanentAddress: body.permanentAddress,
            emergFirstName: body.emergFirstName,
            emergLastName: body.emergLastName,
            contactNumber: body.contactNumber,
            relationShip: body.relationShip,

            firstName: body.firstName,
            middleName: body.middleName,
            lastName: body.lastName,
            phone: body.phone,

            Department: body.Department,
            bloodGroup: body.bloodGroup,
            role: body.role,
            skill: body.skill,
            LeavesDate: body.LeavesDate,
            numberofLeave: body.numberofLeave,
            updated_at: Date.now(),
        };

        const updateStatus = await employee.findByIdAndUpdate(req.params.id, {
            $set: updateReq
        });

        if (updateStatus) {
            res.sendSuccess({}, "Employee details update");
        } else {
            res.sendError("Something went wrong");
        }
    } catch (error) {
        res.sendError(error.message)
    }
}

module.exports.updatePassword = async (req, res) => {
    const {
        body
    } = req;
    try {
        const findUser = await employee.findById(req.params.id);
        if (findUser) {
            bcrypt.compare(body.oldPassword, findUser.password, function (err, res) {
                if (err) {
                    res.sendBadRequest("Password is wrong");
                } else {
                    bcrypt.hash(body.password, 10, async (err, hash) => {
                        if (err) {
                            res.sendError(err.message);
                        } else {
                            const updateUser = await employee.findByIdAndUpdate(req.params.id, {
                                $set: {
                                    password: hash,
                                    isAuthorize: true,
                                    updated_at: Date.now()
                                }
                            });
                            if (updateUser) {
                                res.sendSuccess({}, "Password change successfully");
                            } else {
                                res.sendError("Something went wrong")
                            }
                        }
                    })
                }
            })
        } else {
            res.sendBadRequest("Employee not available");
        }
    } catch (error) {

    }
}

module.exports.deleteEmployee = async (req, res) => {
    try {
        const deleteEmployee = await employee.findByIdAndDelete(req.params.id);
        if (deleteEmployee) {
            res.sendSuccess({}, "Employee delete successfully");
        } else {
            res.sendBadRequest("Smployee not available");
        }
    } catch (error) {
        res.sendError(error.message);
    }
}

module.exports.sendResetPasswordLink = async (req, res) => {
    const { body } = req;
    try {
        const findStatus = await employee.findOne({ email: body.email });
        if (findStatus) {
            /* reset password login details mail*/
            let mailObj = {
                mail_file: "resetpasswordlink.hbs",
                data: {
                    company_name: config.company_name,
                    company_link: config.company_link,
                    user_name: `${findStatus.firstName} ${findStatus.lastName}`,
                    resetpassword_link: `${config.front_baseUrl}changePassword/${findStatus._id}`
                },
                to: body.email,
                subject: "Reset password"
            };
            await generalFunction.sendMail(mailObj);
            /* reset password login details */
            res.sendSuccess({}, "Please check your for login details");
        }
        else {
            res.sendBadRequest("User not available");
        }
    }
    catch (error) {
        res.sendError(error.message);
    }
}

module.exports.resetPassword = async (req, res) => {
    const { body } = req;
    bcrypt.hash(body.password, 10, async (err, hash) => {
        if (err) {
            res.sendError(err.message);
        } else {
            const modelStatus = await employee.findByIdAndUpdate(body.id, {
                $set: {
                    password: hash,
                    updated_at: Date.now()
                }
            })
            if (modelStatus) {
                res.sendSuccess({}, "Password reset successfully")
            } else {
                res.sendError("Password not reset");
            }
        }
    });
}

module.exports.getAllRoles = async (req, res) => {
    try {
        const roles = await role.find()
        if (roles.length > 0) {
            res.sendSuccess(roles, "Role details extracted");
        } else {
            res.sendSuccess([], "Role not available")
        }
    } catch (error) {
        res.sendError(error.message);
    }
}
