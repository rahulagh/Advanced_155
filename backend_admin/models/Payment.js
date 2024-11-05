
const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  invoiceID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AdminInvoice',
    required: true,
  },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'success', 'failed'], required: true },
  transactionDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Payment', PaymentSchema);
