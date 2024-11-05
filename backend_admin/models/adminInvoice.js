const mongoose = require('mongoose');

const AdminInvoiceSchema = new mongoose.Schema({
  recruiter: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true,
  },
  gstAmount: {
    type: Number,
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'paid'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('AdminInvoice', AdminInvoiceSchema);