const mongoose = require("mongoose");

const jobPreferencesSchema = new mongoose.Schema({
  preferredWorkingHours: {
    type: String,
    trim: true,
  },
  preferredCompanySize: {
    type: String,
    trim: true,
  },
  preferredWorkEnvironment: {
    type: String, // Changed from Date to String
    trim: true,
  },
  cities: {
    type: String, // Changed from Date to String
    trim: true,
  },
  state: {
    type: String, // Changed from Date to String
    trim: true,
  },
  preferredRoleLevel: {
    type: String, // Changed from Date to String
    trim: true,
  },
  preferredBenefits: {
    type: String,
    trim: true,
  },
  preferredCompanyCulture: {
    type: String,
    trim: true,
  },
  positionAppliedFor: {
    type: String,
    trim: true,
  },
  careerGoals: {
    type: String,
    trim: true,
  },
  additionalComments: {
    // Changed from additionalCommands to additionalComments for clarity
    type: String,
    trim: true,
  },
  desiredIndustry: {
    type: String,
    trim: true,
  },
  currentEmploymentStatus: {
    type: String,
    trim: true,
  },
  preferredJobType: {
    type: String,
    trim: true,
  },
  preferredCountry: {
    type: String,
    trim: true,
  },
  minSalary: {
    type: String,
    trim: true,
  },
  maxSalary: {
    type: String,
    trim: true,
  },
  availableToStart: {
    type: String,
    trim: true,
  },
  willingnessToRelocate: {
    type: String,
    trim: true,
  },
  willingnessToTravel: {
    type: String,
    trim: true,
  },
});

const JobPreferences = mongoose.model("JobPreferences", jobPreferencesSchema);

module.exports = JobPreferences;
