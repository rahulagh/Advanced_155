const express = require('express');
const SystemSetting = require('../../models/admin/SystemSettings');
const auth = require('../../middleware/admin/auth');

const router = express.Router();

router.get('/system-settings', async (req, res) => {
  try {
    let settings = await SystemSetting.findOne();
    if (!settings) {
      settings = await SystemSetting.create({
        notificationTemplates: {
          welcome: 'Welcome to our platform!',
          passwordReset: 'Click here to reset your password.',
        },
        integrationKeys: {
          apiKey: '',
          secretKey: '',
        },
      });
    }
    res.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ message: 'Error fetching settings' });
  }
});

router.put('/system-settings', async (req, res) => {
  try {
    const { notificationTemplates, integrationKeys } = req.body;
    const settings = await SystemSetting.findOneAndUpdate(
      {},
      { notificationTemplates, integrationKeys },
      { new: true, upsert: true }
    );
    res.json(settings);
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ message: 'Error updating settings' });
  }
});

module.exports = router;