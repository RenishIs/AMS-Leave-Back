const mongoose = require('mongoose');

const timeSheetScheme = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    created_by: { type: String },
    updated_by: { type: String },
    actual_date: { type: String },
    time_sheet: [{
        employeeCode: { type: Number },
        employeeName: { type: String },
        shift: { type: String },
        shiftInTime: { type: String },
        shiftOutTime: { type: String },
        arrivalInTime: { type: String },
        arrivalOutTime: { type: String },
        workDuration: { type: String },
        overTime: { type: String },
        totalDuration: { type: String },
        lateBy: { type: String },
        earlyGoBy: { type: String },
        status: { type: String },
        punchRecords: [{ type: String }],
        actual_date: { type: String },
        displayDate: { type: String },
    }],
});

module.exports = mongoose.model('timeSheet', timeSheetScheme);