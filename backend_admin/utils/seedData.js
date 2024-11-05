const bcrypt = require('bcryptjs');
const Invoice = require('../../models/admin/adminInvoice');
const Payment = require('../../models/admin/Payment');
const User = require('../../models/admin/AdminUser');
const { addDays } = require('./dateUtils');

exports.seedData = async () => {
  try {
    // // Clear existing data
    // await Invoice.deleteMany();
    // await Payment.deleteMany();
    // await User.deleteMany();
  
    console.log('Dummy data inserted successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
  }
};