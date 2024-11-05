const express = require('express');
const Settings = require('../models/Settings');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/settings', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
      await settings.save();
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/settings', async (req, res) => {
  try {
    const { reminderDays } = req.body;
    if (typeof reminderDays !== 'number' || reminderDays < 1) {
      return res.status(400).json({ message: 'Invalid reminderDays value' });
    }
    const settings = await Settings.findOneAndUpdate(
      {}, 
      { reminderDays },
      { upsert: true, new: true }
    );
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;