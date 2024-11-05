// routes/admin/paymentRoutes.js
const express = require('express');
const router = express.Router();
const Payment = require('../../models/admin/Payment');
const Invoice = require('../../models/admin/adminInvoice');
const auth = require('../../middleware/admin/auth');
const mongoose = require('mongoose');

// Get all payments with filtering

router.get('/payments', async (req, res) => {
  try {
    const { filter } = req.query;
    let query = {};

    // Apply status filter
    if (filter && filter !== 'all') {
      query.status = filter;
    }

    const payments = await Payment.find(query)
      .populate({
        path: 'invoiceID',
        select: 'recruiter amount gstAmount status createdAt'
      })
      .sort({ transactionDate: -1 });

    const paymentData = payments.map(payment => ({
      totalAmount: payment.invoiceID.amount + payment.invoiceID.gstAmount,
      invoiceId: payment._id,
      transactionDate: payment.transactionDate,
      recruiter: payment.invoiceID.recruiter,
      status: payment.status
    }));

    res.status(200).json({
      success: true,
      data: paymentData,
      count: payments
    });
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message
    });
  }
});


// // Get single payment by ID
// router.get('/payments/:id',  async (req, res) => {
//   try {
//     const payment = await Payment.findById(req.params.id)
//       .populate({
//         path: 'invoiceID',
//         select: 'recruiter amount gstAmount status createdAt'
//       });

//     if (!payment) {
//       return res.status(404).json({
//         success: false,
//         message: 'Payment not found'
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: payment
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching payment',
//       error: error.message
//     });
//   }
// });

// // Create payment
// router.post('/payments', async (req, res) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const { invoiceID, amount, status } = req.body;

//     // Validate required fields
//     if (!invoiceID || !amount) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invoice ID and amount are required'
//       });
//     }

//     // Check if invoice exists
//     const invoice = await Invoice.findById(invoiceID).session(session);
//     if (!invoice) {
//       return res.status(404).json({
//         success: false,
//         message: 'Invoice not found'
//       });
//     }

//     // Create payment
//     const payment = new Payment({
//       invoiceID,
//       amount: parseFloat(amount),
//       status: status || 'pending',
//       transactionDate: new Date()
//     });

//     await payment.save({ session });

//     // Update invoice status if payment is successful
//     if (status === 'success') {
//       invoice.status = 'paid';
//       await invoice.save({ session });
//     }

//     await session.commitTransaction();

//     res.status(201).json({
//       success: true,
//       data: payment
//     });

//   } catch (error) {
//     await session.abortTransaction();
//     res.status(400).json({
//       success: false,
//       message: 'Error creating payment',
//       error: error.message
//     });
//   } finally {
//     session.endSession();
//   }
// });

// Update payment status
router.put('/payments/:id',  async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { status } = req.body;

    // Validate status
    if (!['pending', 'success', 'failed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    // Update payment
    const payment = await Payment.findById(req.params.id).session(session);
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    payment.status = status;
    await payment.save({ session });

    // Update corresponding invoice
    const invoice = await Invoice.findById(payment.invoiceID).session(session);
    if (invoice) {
      invoice.status = status === 'success' ? 'paid' : 'pending';
      await invoice.save({ session });
    }

    await session.commitTransaction();

    res.status(200).json({
      success: true,
      data: payment
    });

  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({
      success: false,
      message: 'Error updating payment',
      error: error.message
    });
  } finally {
    session.endSession();
  }
});

module.exports = router;