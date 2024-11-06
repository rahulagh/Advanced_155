const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema({
  recruiterId: {
    type: mongoose.Schema.Types.ObjectId, // Referencing the recruiter's _id
    ref: "Recruiter", // This refers to the 'Recruiter' model
    required: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  logo: {
    type: String,
    required: true,
  },
  documentType: {
    type: String,
    required: true,
  },
  documentUrl: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Document", DocumentSchema);
