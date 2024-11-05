// routes/admin/invoiceRoutes.js
const express = require('express');
const Invoice = require('../../models/admin/adminInvoice');
const Payment = require('../../models/admin/Payment');
const mongoose = require('mongoose');

const router = express.Router();

router.post('/invoices', async (req, res) => {
  // Start a transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { recruiterName, amount, gstAmount, dueDate, description, status } = req.body;

    // Validate required fields
    if (!recruiterName || !amount || !dueDate) {
      return res.status(400).json({
        message: 'Recruiter name, amount, and due date are required'
      });
    }

    // Create new invoice
    const newInvoice = new Invoice({
      recruiter: recruiterName,
      amount: parseFloat(amount),
      gstAmount: parseFloat(gstAmount),
      dueDate: new Date(dueDate),
      status: status || 'pending'
    });

    // Save invoice
    await newInvoice.save({ session });

    // Create corresponding payment record
    const payment = new Payment({
      invoiceID: newInvoice._id,
      amount: parseFloat(amount),
      status: status || 'pending',
      transactionDate: new Date()
    });

    // Save payment
    await payment.save({ session });

    await session.commitTransaction();

    res.status(201).json({
      success: true,
      data: {
        invoice: newInvoice,
        payment: payment
      }
    });

  } catch (error) {
    await session.abortTransaction();
    console.error('Invoice creation error:', error);
    res.status(500).json({
      message: 'Error creating invoice',
      error: error.message
    });
  } finally {
    session.endSession();
  }
});

// Modify the PUT route to update both invoice and payment status
router.put('/invoices/:id', async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const { status } = req.body;

    // Update invoice
    const updatedInvoice = await Invoice.findByIdAndUpdate(
      id,
      { status },
      { new: true, session }
    );

    if (!updatedInvoice) {
      throw new Error('Invoice not found');
    }

    // Update corresponding payment
    await Payment.findOneAndUpdate(
      { invoiceID: id },
      { status },
      { session }
    );

    await session.commitTransaction();
    res.json(updatedInvoice);

  } catch (error) {
    await session.abortTransaction();
    console.error('Error updating invoice:', error);
    res.status(500).json({
      message: 'Error updating invoice status',
      error: error.message
    });
  } finally {
    session.endSession();
  }
});

router.get('/invoices', async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};

    if (status) query.status = status;

    const invoices = await Invoice.find(query).populate('recruiter');
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;