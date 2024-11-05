const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
  reminderDays: {
    type: Number,
    default: 7,
  },
});

module.exports = mongoose.model('Settings', SettingsSchema);