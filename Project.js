const mongoose = require('mongoose');
//schema of project

var projectSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  programCode: {
    type: String,
  },
  programManager: {
    type: String,
  },
  assessmentDate: {
    type: Date,
  },
  comment: {
    type: String,
  },
  titlesList: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Title',
      required: true,
    },
  ],
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
