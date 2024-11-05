const mongoose = require('mongoose');

const SettingSchema = new mongoose.Schema({
  notificationTemplates: {
    welcome: String,
    passwordReset: String,
  },
  integrationKeys: {
    apiKey: String,
    secretKey: String,
  },
});

module.exports = mongoose.model('SystemSetting', SettingSchema);