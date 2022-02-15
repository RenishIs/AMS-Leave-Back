const mongoose = require('mongoose');

const userSchema = mongoose.Schema({

    _id: mongoose.Schema.Types.ObjectId,
    firstName: {
        type: String
    },
    gender: {
        type: String
    },
    image: {
        type: String
    },

    middleName: {
        type: String
    },
    lastName: {
        type: String
    },
    password: {
        type: String
    },

    email: {
        type: String,
        unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    phone: {
        type: String
    },
    ctc: {
        type: String
    },
    dateOfJoining: {
        type: String
    },
    designation: {
        type: String
    },
    employeeLevel: {
        type: String
    },
    reportingTo: {
        type: String
    },
    workExperience: {
        type: String
    },
    educationDetail: [{
        course: String,
        instituteName: String,
        marksScored: String,
        yearOfCompletion: String
    }],
    experienceDetail: [{
        prevCompanyName: String,
        jobTitle: String,
        from: String,
        to: String,
        jobDescription: String
    }],
    officialDOB: {
        type: String
    },
    maritalStatus: {
        type: String
    },
    presentAddress: {
        type: String
    },
    permanentAddress: {
        type: String
    },
    emergFirstName: {
        type: String
    },
    emergLastName: {
        type: String
    },
    contactNumber: {
        type: String
    },
    relationShip: {
        type: String
    },
    role: {
        type: String
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now
    },
    updated_at: {
        type: Date
    },
    reportingUser: {
        type: Boolean
    },
    department: {
        type: String
    },
    bloodGroup: {
        type: String
    },
    skill: {
        type: Array
    },
    lastMessage: {
        type: String
    },
    isAuthorize: {
        type: Boolean,
        default: false,
    },

    sendInvitation: {
        type: Boolean,
        default: false,
    },
    employeeReportManager: {
        type: String
    },
    employeeCode: {
        type: Number
    },
    technology: {
        type: Array
    },
});

module.exports = mongoose.model('Employee', userSchema);