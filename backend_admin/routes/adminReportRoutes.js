const express = require('express');
const Invoice = require('../../models/admin/adminInvoice');
const { generateReport } = require('../../services/admin/adminReportService');
const auth = require('../../middleware/admin/auth');

const router = express.Router();

router.get('/reports', async (req, res) => {
  try {
    const { start, end } = req.query;
    const query = {};
    if (start && end) {
      query.createdAt = { $gte: new Date(start), $lte: new Date(end) };
    }
    const invoices = await Invoice.find(query);
    const report = generateReport(invoices);
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/dashboard', async (req, res) => {
  try {
    const totalGSTCollected = await Invoice.aggregate([
      { $group: { _id: null, total: { $sum: "$gstAmount" } } }
    ]);
    const pendingPayments = await Invoice.countDocuments({ status: 'pending' });
    const totalInvoices = await Invoice.countDocuments();
    const monthlyGSTAverage = await Invoice.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          average: { $avg: "$gstAmount" }
        }
      },
      { $group: { _id: null, average: { $avg: "$average" } } }
    ]);

    res.status(200).json({
      totalGSTCollected: totalGSTCollected[0]?.total || 0,
      pendingPayments,
      totalInvoices,
      monthlyGSTAverage: monthlyGSTAverage[0]?.average || 0
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;