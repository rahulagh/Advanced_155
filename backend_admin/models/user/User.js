const mongoose = require("mongoose");
const jobPreferances = require("./jobPreferances");
const User = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  collegeName: {
    type: String,
    trim: true,
  },
  ugOrPg: {
    type: String,
    trim: true,
  },
  year: {
    type: String,
    trim: true,
  },
  department: {
    type: String,
    trim: true,
  },
  middleName: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  mobileNumber: {
    type: Number,
    trim: true,
    required: true,
  },
  mobilecountryCode: {
    type: String,
    trim: true,
  },
  phoneNumber: {
    type: String,
    trim: true,
  },
  phonecountryCode: {
    type: String,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  token: {
    type: String,
  },
  resetPasswordExpires: {
    type: Date,
  },
  accountType: {
    type: String,
    default: "User",
  },
  active: {
    type: Boolean,
    default: false,
  },
  address: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address",
  },
  tempaddress: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address",
  },
  gender: {
    type: String,
    trim: true,
  },
  maritialInfo: {
    type: String,
    trim: true,
  },
  dateOfBirth: {
    type: String,
    trim: true,
  },
  nationality: {
    type: String,
    trim: true,
  },
  personalWebsite: {
    type: String,
    trim: true,
  },
  linkedinProfile: {
    type: String,
    trim: true,
  },
  emergencyContact: {
    type: String,
    trim: true,
  },
  emergencyContactCode: {
    type: String,
    trim: true,
  },
  emergencyContactPhone: {
    type: Number,
    trim: true,
  },
  educationalInfo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "educationalInfo",
  },
  yearOfExperience: {
    type: Date,
    trim: true,
  },
  jobInfo: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "jobInfo",
    },
  ],
  isFresher: {
    type: Boolean,
  },
  jobPreferances: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "jobPreferances",
  },
  resumeLink: {
    type: String,
    trim: true,
  },
  workSampleLink: {
    type: String,
    trim: true,
  },
  awards: {
    type: String,
    trim: true,
  },
  publications: {
    type: String,
    trim: true,
  },
  hobbies: {
    type: String,
    trim: true,
  },
  volunteerExperience: {
    type: String,
    trim: true,
  },
  passportInfo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "passportInfo",
  },
  visaInfo: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "visaInfo",
    },
  ],
  completed: {
    type: Boolean,
  },

  trainingWorkShops: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "workshopInfo",
    },
  ],
  languages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "languageInfo",
    },
  ],
  skills: [
    {
      type: String,
      default: "User",
    },
  ],
  notificationPreferences: {
    type: [String],
    enum: ['email', 'sms', 'in-app'],
    default: ['email'],
  },
  notification: [
    {
      type: String,
      default: "JobSchema",
    },
  ],
  jobsApplied: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobSchema",
    },
  ],
  reminderFrequency: {
    type: String,
    enum: ['daily', 'weekly', 'monthly'],
    default: 'daily',
  },
  examRegistrations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
  }],
  calendarToken: String,
});
module.exports = mongoose.model("User", User);
