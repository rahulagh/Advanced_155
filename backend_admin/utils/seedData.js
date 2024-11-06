const bcrypt = require('bcryptjs');
const Invoice = require('../models/adminInvoice');
const Payment = require('../models/Payment');
const User = require('../models/AdminUser');
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