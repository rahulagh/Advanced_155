// server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); // Import the cors package
const connectDB = require('./config/db');
const errorHandler = require('./utils/errorHandler');
const auditTrailRoutes = require('./routes/auditTrailRoutes'); 
const planChangeLogRoutes = require('./routes/planChangeLogRoutes');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const crypto = require("crypto");
const cron = require('node-cron');
const path = require("path");
const cookiesParser = require("cookie-parser");
//
const adminUserRoutes = require('./routes/AdminUserRoutes');
const adminInvoiceRoutes = require('./routes/invoiceRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const adminReportRoutes = require('./routes/adminReportRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const systemSettingsRoutes = require('./routes/systemSettingRoutes');
const adminRecruiterRoutes=require('./routes/adminRecruiterRoutes')
const usersssRoutes=require('./routes/userSsRoutes')


// const { connectDB } = require("././config/db");
// const { initCronJobs } = require("../utils/recruiter/cronJobs");
// const app = express();

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

const app = express();
app.use(express.json()); // To parse JSON bodies
app.use(cookiesParser());
app.use(bodyParser.json());

// Use CORS to allow requests from both localhost and Vercel frontend
const corsOptions = {
    origin: ['http://localhost:3000', 'https://frontend-admin-murex.vercel.app'], // Allow requests from both localhost and Vercel
    credentials: true, // Allow cookies to be sent
};

app.use(cors(corsOptions));
const sessionStore = MongoStore.create({
  mongoUrl:
    "mongodb+srv://gademanicharan12:recruiterPortal@cluster0.nj0u1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  collectionName: "sessions",
});

// Initialize cron jobs
// initCronJobs();

app.use(
  session({
    secret: "agh",
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      // secure: process.env.NODE_ENV === "production",use this for production
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
    },
    genid: function (req) {
      return crypto.randomUUID(); // use UUIDs for session IDs
    },
  })
);

//
app.use('/api', adminUserRoutes);
app.use('/api', adminInvoiceRoutes);
app.use('/api', paymentRoutes);
app.use('/api', adminReportRoutes);
app.use('/api', settingsRoutes);
app.use('/api', systemSettingsRoutes);
// app.use("/api/recruiters", adminRecruiterRoutes);
app.use("/api/usersSS", usersssRoutes);

// API Routes
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/plans', require('./routes/planRoutes'));
app.use('/api/renewals', require('./routes/renewalRoutes')); 
app.use('/api/accounts', require('./routes/accountRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/billing', require('./routes/billingRoutes'));
app.use('/api/otp', require('./routes/otpRoutes')); 
app.use('/api/notifications', require('./routes/notificationRoutes')); // Ensure this matches the route
app.use('/api/audit-trail', auditTrailRoutes);
app.use('/api/plan-change-log', planChangeLogRoutes);

// Import and start cron jobs
const { startCronJobs } = require('./services/cronService');
startCronJobs();

// Import and run data seeding
const { seedData } = require('./utils/seedData');
seedData();

// Error handler middleware
app.use(errorHandler);

app.use((req, res) => {
  console.log(`404 - Not Found: ${req.method} ${req.url}`);
  res.status(404).send('Not Found');
});

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
