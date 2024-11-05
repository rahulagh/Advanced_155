const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  name: String,
  date: Date,
  venue: String,
  preparationMaterials: [String],
  announcements: [String],
});

module.exports = mongoose.model('Exam', examSchema);
