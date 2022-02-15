const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    Name:{ type: String,},
    Description: {
      type: String,
      default: null
    },
    projectStatus: {
      type: String,
      default: null
    },
    projectType: {
      type: String,
      default: null
    },
    Inhouse: {
      type: String,
      default: null
    },
    isError:{ type:Boolean },
    teamMembers: [{ employeeid: String,employeename:String, status: String }],
    createdAt: { type: Date, required: true, default: Date.now },
    updated_at: { type: Date },
  });


module.exports = mongoose.model('project', projectSchema);