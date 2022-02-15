'use strict'
const timesheet = require("../models/timesheet");
const mongoose = require("mongoose");
const employee = require("../models/employee");

module.exports.saveTimeSheet =  async (req, res) => {
    let finalTimeSheetArray = [];
    await employee.find((err, docs) => {
        if (!err) {
            docs.map(ele => {
                req.body.time_sheet.map(item => {
                    if (item.employeeCode == ele.employeeCode) {
                        finalTimeSheetArray.push(item)
                    }
                })
            })
        }
        else {
            res.status(500).json({
                error: err,
                message: err.message,
                success: false
            });
        }
    });

    const timeSheet = new timesheet({
        _id: new mongoose.Types.ObjectId(),
        created_by: req.body.created_by,
        updated_by: req.body.updated_by,
        actual_date: req.body.actual_date,
        time_sheet: finalTimeSheetArray
    });

    await timeSheet.save().then(result => {
        res.status(200).json({
            message: "Time Sheet Inserted",
            data: result,
            success: true
        });
    }).catch(err => {
        res.status(500).json({
            error: err,
            message: err.message,
            success: false
        });
    });
};


module.exports.getTimeSheetByEmployeeCode = async (req, res) => {
    let sheetArray = [];
    const range = {}

    await timesheet.find(range).then((data) => {
        data.map(ele => {
            ele.time_sheet.map(obj => {
                if (obj.employeeCode == req.params.employeeCode) {
                    obj.displayDate = new Date(ele.actual_date).toLocaleDateString();
                    obj.actual_date = ele.actual_date;
                    sheetArray.push(obj);
                }
            });
        });
    });
    res.status(200).json({
        data: sheetArray,
        success: true,
        message: 'Succefully data received'
    });
};
