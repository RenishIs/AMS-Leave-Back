
/* model  */

const user = require('../models/employee');
const role = require('../models/role');
const leave = require('../models/leave');
const generalFunction = require('../helper/general_functions');

/* model  */

module.exports.add = async (req, res) => {
    const { body, user } = req;
    try {
        const findActiveUser = await user.findById(user.userId);
        if (findActiveUser) {
            if (findActiveUser.reportingUser) {
                /* finding reporting user */
                const reportingUser = await user.findById(findActiveUser.employeeReportManager);
                if (reportingUser) {
                    const RolesIds = await role.aggregate([{ $match: { $or: [{ role: 'admin' }, { role: 'hr' }] } }])
                    if (RolesIds) {

                        const RoleWiseUser = await user.aggregate([{ $match: { $or: [{ role: RolesIds[1]._id }, { role: RolesIds[0]._id }] } }])

                        const ccMailList = [];

                        for (const user of RoleWiseUser) {
                            if (user.email) ccMailList.push(user.email);
                        }

                        /* add leave for empoyee */
                        const leaveData = new leave({
                            user_id: body._id,
                            title: body.title,
                            date: body.date,
                            reason: body.reason
                        })
                        const addLeaveStatus = await leaveData.save();
                        if (addLeaveStatus) {
                            /* Leave mail*/
                            let mailObj = {
                                mail_file: "leave_info.hbs",
                                data: {
                                    company_name: 'Albiorix Technology Pvt. Ltd',
                                    company_link: 'https://www.albiorixtech.com/',
                                    user_name: `${findActiveUser.firstName} ${findActiveUser.lastName}`,
                                    leave_title: body.title,
                                    leave_date: body.date,
                                    leave_reason: body.reason,
                                },
                                to: [reportingUser.email],
                                cc: ccMailList,
                                subject: "Leave Information"
                            };
                            await generalFunction.sendMail(mailObj);
                            /* Leave mail*/
                            res.sendSuccess("Leave added successfully")
                        }
                        else {
                            res.sendError("Something went wrong");
                        }
                        /* add leave for empoyee */
                    }
                    else {
                        res.sendError("Default roles not available");
                    }
                }
                else {

                }
                /* finding reporting user */
            }
            else {
                const RolesIds = await role.aggregate([{ $match: { $or: [{ role: 'admin' }, { role: 'hr' }] } }])
                if (RolesIds) {

                    const RoleWiseUser = await user.aggregate([{ $match: { $or: [{ role: RolesIds[1]._id }, { role: RolesIds[0]._id }] } }])

                    const toMailList = [];

                    for (const user of RoleWiseUser) {
                        if (user.email) toMailList.push(user.email);
                    }

                    /* add leave for empoyee */
                    const leaveData = new leave({
                        user_id: body._id,
                        title: body.title,
                        date: body.date,
                        reason: body.reason
                    })

                    const addLeaveStatus = await leaveData.save();
                    if (addLeaveStatus) {

                        /* Leave mail*/
                        let mailObj = {
                            mail_file: "leave_info.hbs",
                            data: {
                                company_name: 'Albiorix Technology Pvt. Ltd',
                                company_link: 'https://www.albiorixtech.com/',
                                user_name: `${findActiveUser.firstName} ${findActiveUser.lastName}`,
                                leave_title: body.title,
                                leave_date: body.date,
                                leave_reason: body.reason
                            },
                            to: toMailList,
                            subject: "Leave Information"
                        };

                        await generalFunction.sendMail(mailObj,);
                        /* Leave mail*/

                        res.sendSuccess("Leave added successfully")
                    }
                    else {
                        res.sendError("Something went wrong");
                    }
                    /* add leave for empoyee */
                }
                else {
                    res.sendError("Default roles not available");
                }
            }
        }
        else {
            res.sendError("User not available");
        }
    }
    catch (error) {
        res.sendError(error.message);
    }
}

module.exports.get = async (req, res) => {
    const { user } = req;
    try {
        const findStatus = await leave.find({ user_id: user.userId });
        if (findStatus) {
            res.sendSuccess(findStatus, "Leave details extracted");
        }
        else {
            res.sendSuccess([], "Leave not available");
        }
    }
    catch (error) {
        res.sendError(error.message);
    }
}