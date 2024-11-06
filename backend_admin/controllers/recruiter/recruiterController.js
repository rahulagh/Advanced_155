// server/controllers/recruiterController.js
const Recruiter = require("../../models/recruiter/recruiter");
const Document = require("../../models/recruiter/document");
const {
  sendVerificationEmail,
  sendOTP,
  sendLoginAlert,
  sendApprovalEmail,
  sendDocumentsVerificationEmail,
  sendRejectionEmail,
  sendNotificationEmail,
} = require("../../services/emailService");
const { generateOTP } = require("../../services/otpService");
const {
  encryptData,
  decryptData,
} = require("../../services/encryptionService");
const { uploadToWasabi } = require("../../services/wasabi");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.register = async (req, res) => {
  try {
    const {
      fullName,
      companyName,
      email,
      jobTitle,
      contactNumber,
      companyWebsite,
      password,
      agreedToTerms,
      gstNumber,
      supervisorEmail,
    } = req.body;

    // Validate email format and business email
    const emailDomain = email.split("@")[1];
    const commonDomains = [
      "gmail.com",
      "yahoo.com",
      "hotmail.com",
      "outlook.com",
    ];
    if (
      !email.includes("@") ||
      email.split("@")[1].split(".").length < 2 ||
      commonDomains.includes(emailDomain.toLowerCase())
    ) {
      return res
        .status(400)
        .json({ message: "Invalid email format or not a business email" });
    }

    // Validate supervisor email
    if (
      !supervisorEmail.includes("@") ||
      supervisorEmail.split("@")[1].split(".").length < 2
    ) {
      return res
        .status(400)
        .json({ message: "Invalid supervisor email format" });
    }

    // Check if supervisor email domain matches company email domain
    if (email.split("@")[1] !== supervisorEmail.split("@")[1]) {
      return res.status(400).json({
        message:
          "Supervisor's email must use the same domain as the company email",
      });
    }

    // Validate GST number if provided
    if (
      gstNumber &&
      !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(
        gstNumber
      )
    ) {
      return res.status(400).json({ message: "Invalid GST number" });
    }

    // Check if terms are agreed
    if (!agreedToTerms) {
      return res
        .status(400)
        .json({ message: "You must agree to the terms and conditions" });
    }
    const otp = generateOTP();
    console.log(otp);
    const { iv, encryptedData: encryptedOTP } = encryptData(otp);
    // Create a temporary recruiter object
    const tempRecruiter = {
      fullName,
      companyName,
      email,
      jobTitle,
      contactNumber,
      companyWebsite,
      password: await bcrypt.hash(password, 10),
      agreedToTerms,
      gstNumber,
      supervisorEmail,
      isDocumentVerified: false,
    };

    // Store the temporary recruiter object in the session or a temporary storage
    req.session.tempRecruiter = tempRecruiter;
    req.session.save(async (err) => {
      if (err) {
        console.error("Session save error:", err);
        return res.status(500).json({ message: "Error saving session" });
      }
      await sendOTP(tempRecruiter.email, otp);
      res.status(200).json({
        message:
          "Please check your email for the OTP to complete registration.",
        sessionId: req.sessionID, // Send this to the client
        encryptedOTP,
        iv,
      });
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error initiating registration", error: error.message });
  }
};

exports.verifySignupOTP = async (req, res) => {
  try {
    const { email, otp, sessionId, encryptedOTP, iv } = req.body;
    const sessionStore = req.sessionStore;
    sessionStore.get(sessionId, async (err, session) => {
      if (err || !session) {
        return res.status(400).json({ message: "Invalid session" });
      }

      const tempRecruiter = session.tempRecruiter;

      if (!tempRecruiter || tempRecruiter.email !== email) {
        return res
          .status(400)
          .json({ message: "Invalid registration session" });
      }

      const decryptedOTP = decryptData(encryptedOTP, iv);

      if (otp !== decryptedOTP) {
        return res.status(400).json({ message: "Invalid OTP" });
      }

      // OTP is valid, create and save the new recruiter
      const recruiter = new Recruiter(tempRecruiter);
      await recruiter.save();

      // Clear the temporary recruiter data from the session
      delete req.session.tempRecruiter;

      // Send notification to supervisor
      await sendNotificationEmail(
        recruiter.supervisorEmail,
        "New Recruiter Signup",
        `A new recruiter (${recruiter.fullName}) has signed up from your company.`
      );

      res.status(200).json({
        message: "Registration completed successfully",
        recruiterId: recruiter._id,
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error verifying OTP and completing registration",
      error: error.message,
    });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const recruiter = await Recruiter.findOne({ verificationToken: token });
    if (!recruiter) {
      return res.status(400).json({ message: "Invalid verification token" });
    }

    recruiter.isVerified = true;
    await recruiter.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error verifying email", error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const recruiter = await Recruiter.findOne({ email });

    if (!recruiter) {
      return res.status(404).json({ message: "Email is not registered" });
    }

    if (!recruiter.isDocumentsSubmitted || !recruiter.isApproved) {
      return res
        .status(401)
        .json({ message: "Account is not verified or approved" });
    }

    const isPasswordValid = await bcrypt.compare(password, recruiter.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const otp = generateOTP();
    console.log(otp);
    const { iv, encryptedData: encryptedOTP } = encryptData(otp);

    res
      .status(200)
      .json({ message: "OTP sent to your email", encryptedOTP, iv });

    await sendOTP(recruiter.email, otp);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp, encryptedOTP, iv } = req.body;
    if (!encryptedOTP || !iv) {
      return res.status(400).json({ message: "Missing encryptedOTP or iv" });
    }

    const decryptedOTP = decryptData(encryptedOTP, iv);

    if (otp !== decryptedOTP) {
      return res.status(401).json({ message: "Invalid OTP" });
    }

    const recruiter = await Recruiter.findOne({ email });
    recruiter.lastLogin = new Date();
    await recruiter.save();
    await sendLoginAlert(recruiter.email, new Date(), req.ip);

    const token = jwt.sign({ id: recruiter._id }, "agh", { expiresIn: "1h" });

    res
      .status(200)
      .json({ message: "Login successful", token, id: recruiter.id });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error verifying OTP", error: error.message });
  }
};

//
exports.rejectRecruiter = async (req, res) => {
  try {
    const { recruiterId } = req.params;
    const { reason } = req.body;

    const recruiter = await Recruiter.findByIdAndUpdate(
      recruiterId,
      {
        isApproved: false,
        rejectionReason: reason,
      },
      { new: true }
    );

    if (!recruiter) {
      return res.status(404).json({ message: "Recruiter not found" });
    }

    res.json({ message: "Recruiter rejected successfully", recruiter });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error rejecting recruiter", error: error.message });
  }
};

exports.verifyRecruiter = async (req, res) => {
  try {
    const { recruiterId } = req.params;

    const recruiter = await Recruiter.findByIdAndUpdate(
      recruiterId,
      {
        isDocumentVerified: true,
      },
      { new: true }
    );

    if (!recruiter) {
      return res.status(404).json({ message: "Recruiter not found" });
    }

    res.json({
      message: "Recruiter documents verified successfully",
      recruiter,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error verifying recruiter documents",
      error: error.message,
    });
  }
};

exports.getNewRecruiterCount = async (req, res) => {
  try {
    const count = await Recruiter.countDocuments({
      isVerified: true,
      isApproved: false,
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    });
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching new recruiter count",
      error: error.message,
    });
  }
};

exports.getRecruiters = async (req, res) => {
  try {
    const { page = 1, status = "all", search = "" } = req.query;
    const limit = 10;
    const skip = (page - 1) * limit;

    let query = {};

    if (status !== "all") {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const recruiters = await Recruiter.find(query)
      .select("fullName email isApproved verified")
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Recruiter.countDocuments(query);

    res.json({
      recruiters,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error in getRecruiters:", error);
    res
      .status(500)
      .json({ message: "Error fetching recruiters", error: error.message });
  }
};

function getRecruiterStatus(recruiter) {
  if (recruiter.isApproved) {
    return "approved";
  } else {
    return "pending";
  }
}
//
exports.approveRecruiter = async (req, res) => {
  try {
    const { recruiterId } = req.params;
    const { reason } = req.body;

    const recruiter = await Recruiter.findByIdAndUpdate(
      recruiterId,
      {
        isApproved: true,
        approvalReason: reason,
      },
      { new: true }
    );

    if (!recruiter) {
      return res.status(404).json({ message: "Recruiter not found" });
    }

    res.json({ message: "Recruiter approved successfully", recruiter });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error approving recruiter", error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const recruiter = await Recruiter.findById(req.recruiterId);

    if (!recruiter) {
      return res.status(404).json({ message: "Profile not found" });
    }

    recruiter.verificationDocuments = recruiter.verificationDocuments.map(
      (doc) => {
        try {
          return {
            ...doc,
            data: Buffer.from(doc.data, "base64").toString("utf-8"),
          };
        } catch (err) {
          console.error("Failed to decode Base64 string:", err);
          return { ...doc, data: null }; // Handle error appropriately
        }
      }
    );

    res.status(200).json({
      fullName: recruiter.fullName,
      email: recruiter.email,
      isDocumentVerified: recruiter.isDocumentVerified,
      verificationDocuments: recruiter.verificationDocuments,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching profile", error: error.message });
  }
};

//
exports.verifyRecruiterDocuments = async (req, res) => {
  try {
    const recruiterId = req.params.recruiterId;
    const recruiter = await Recruiter.findById(recruiterId);
    if (!recruiter) {
      return res.status(404).json({ message: "Recruiter not found" });
    }

    recruiter.verificationDocuments = recruiter.verificationDocuments.map(
      (doc) => {
        try {
          return {
            ...doc,
            data: Buffer.from(doc.data, "base64").toString("utf-8"),
          };
        } catch (err) {
          console.error("Failed to decode Base64 string:", err);
          return { ...doc, data: null };
        }
      }
    );

    recruiter.isDocumentVerified = true;
    await recruiter.save();
    await sendDocumentsVerificationEmail(recruiter.email);

    res.json({ message: "Documents verified successfully", recruiter });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getUnverifiedRecruiters = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;
    const skip = (page - 1) * limit;

    const recruiters = await Recruiter.find({
      isVerified: true,
      isApproved: false,
    })
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(parseInt(limit))
      .select("fullName companyName email jobTitle companyWebsite createdAt");

    const totalRecruiters = await Recruiter.countDocuments({
      isVerified: true,
      isApproved: false,
    });

    res.status(200).json({
      recruiters,
      totalPages: Math.ceil(totalRecruiters / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching unverified recruiters",
      error: error.message,
    });
  }
};

exports.getUnverifiedDocuments = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;
    const skip = (page - 1) * limit;

    const recruiters = await Recruiter.find({
      isVerified: true,
      isApproved: true,
      isDocumentVerified: false,
    })
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(parseInt(limit))
      .select(
        "fullName companyName email jobTitle companyWebsite verificationDocuments createdAt"
      );

    const totalRecruiters = await Recruiter.countDocuments({
      isVerified: true,
      isApproved: true,
      isDocumentVerified: false,
    });

    const recruitersWithEncodedDocs = recruiters.map((recruiter) => {
      const recruiterObject = recruiter.toObject();
      recruiterObject.verificationDocuments =
        recruiterObject.verificationDocuments.map((doc) => ({
          ...doc,
          data: doc.data.toString("base64"),
        }));
      return recruiterObject;
    });

    res.status(200).json({
      recruiters: recruitersWithEncodedDocs,
      totalPages: Math.ceil(totalRecruiters / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching unverified documents",
      error: error.message,
    });
  }
};

exports.updatePreferences = async (req, res) => {
  try {
    const { id } = req.params;
    const clientData = req.body;

    const notificationPreferences = {
      newCandidateApplications: clientData["New Candidate Applications"],
      subscriptionRenewals: clientData["Subscription Renewals"],
      profileChanges: clientData["Profile Changes"],
      verificationStatuses: clientData["Verification Statuses"],
      jobApplicationUpdates: clientData["Job Application Updates"],
      paymentConfirmations: clientData["Payment Confirmations"],
      loginAlerts: clientData["Login Alerts"],
      unusualActivity: clientData["Unusual Activity"],
    };

    const updatedRecruiter = await Recruiter.findByIdAndUpdate(
      id,
      { notificationPreferences },
      { new: true, runValidators: true }
    );

    if (!updatedRecruiter) {
      return res
        .status(404)
        .json({ success: false, error: "Recruiter not found" });
    }

    res.status(200).json({
      success: true,
      message: "Notification preferences updated successfully",
      notificationPreferences: updatedRecruiter.notificationPreferences,
    });
  } catch (error) {
    console.error("Error updating notification preferences:", error);
    res.status(500).json({
      success: false,
      error: "An error occurred while updating notification preferences",
    });
  }
};

// Validate file
function validateFile(file, allowedTypes, maxSize) {
  return file && allowedTypes.includes(file.mimetype) && file.size <= maxSize;
}

// Get file extension
function getFileExtension(filename) {
  return filename.split(".").pop();
}

// Upload document
exports.uploadDocument = async (req, res) => {
  try {
    console.log("Received request body:", req.body);
    console.log("Received files:", req.files);

    const { companyName, documentType, recruiterId } = req.body;
    const logo = req.files["logo"][0];
    const document = req.files["document"][0];

    // Validate input
    if (!companyName || !documentType || !logo || !document || !recruiterId) {
      return res.status(400).json({ msg: "Missing required fields" });
    }

    // Validate file types and sizes
    if (!validateFile(logo, ["image/jpeg", "image/png"], 500 * 1024)) {
      return res.status(400).json({ msg: "Invalid logo file" });
    }

    if (
      !validateFile(
        document,
        ["application/pdf", "image/jpeg", "image/png"],
        1 * 1024 * 1024
      )
    ) {
      return res.status(400).json({ msg: "Invalid document file" });
    }

    // Upload files to Wasabi
    const logoUrl = await uploadToWasabi(
      logo.buffer,
      `logos/${companyName}-logo.${getFileExtension(logo.originalname)}`,
      logo.mimetype
    );
    const documentUrl = await uploadToWasabi(
      document.buffer,
      `documents/${companyName}-${documentType}.${getFileExtension(
        document.originalname
      )}`,
      document.mimetype
    );

    // Save document info to MongoDB, including the recruiterId
    const newDocument = new Document({
      companyName,
      logo: logoUrl,
      documentType,
      documentUrl,
      recruiterId, // Save the recruiter ID
    });

    await newDocument.save();
    await Recruiter.findByIdAndUpdate(recruiterId, {
      isDocumentsSubmitted: true,
    });

    res.json({
      msg: "Document uploaded successfully",
    });
  } catch (err) {
    console.error("Error in document upload:", err);
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
};

exports.getCompanyDetails = async (req, res) => {
  try {
    const { recruiterId } = req.params;
    const recruiterData = await Recruiter.findById(recruiterId);
    res.status(200).json({
      companyName: recruiterData.companyName,
      companyWebsite: recruiterData.companyWebsite,
    });
  } catch (error) {
    console.error(error);
  }
};
