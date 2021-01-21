const mongoose = require('mongoose');
//schema of title
var titleSchema = new mongoose.Schema({
  newTitle: {
    type: String,
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
  },
});

const Title = mongoose.model('Title', titleSchema);

module.exports = Title;
