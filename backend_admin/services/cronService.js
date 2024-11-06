const cron = require('node-cron');
const Invoice = require('../models/adminInvoice');
const User = require('../models/AdminUser');
const Settings = require('../models/Settings');
const { sendReminderEmail, sendAdminAlertEmail } = require('./AdminEmailService');
const { isWithinDays } = require('../utils/dateUtils');

const sendReminders = async () => {
  try {
    const settings = await Settings.findOne();
    const reminderDays = settings ? settings.reminderDays : 7;

    const pendingInvoices = await Invoice.find({ status: 'pending' }).populate('recruiter');

    for (const invoice of pendingInvoices) {
      if (isWithinDays(invoice.dueDate, reminderDays)) {
        await sendReminderEmail(invoice.recruiter.email, invoice);
      }
    }
  } catch (error) {
    console.error('Error sending reminders:', error);
  }
};

const sendAdminAlerts = async () => {
  const totalGSTDue = await Invoice.aggregate([
    { $match: { status: 'pending' } },
    { $group: { _id: null, total: { $sum: '$gstAmount' } } }
  ]);

  const admins = await User.find({ role: 'admin' });

  for (const admin of admins) {
    await sendAdminAlertEmail(admin.email, totalGSTDue[0].total);
  }
};

exports.startCronJobs = () => {
  cron.schedule('0 0 * * *', sendReminders);
  cron.schedule('0 0 1 * *', sendAdminAlerts);
};