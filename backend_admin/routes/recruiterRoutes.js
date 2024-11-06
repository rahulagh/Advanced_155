const express = require("express");
const router = express.Router();
const recruiterController = require("../controllers/recruiter/recruiterController");
const multer = require("multer");
// const auth = require("../../middleware/recruiter/auth");
// const upload = require("../../middleware/recruiter/upload");

const upload = multer({
  limits: {
    fileSize: 1 * 1024 * 1024, // 1MB
  },
});

router.post("/register", recruiterController.register);
router.post("/signup/verify-otp", recruiterController.verifySignupOTP);
router.post(
  "/documents",
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "document", maxCount: 1 },
  ]),
  recruiterController.uploadDocument
);
router.get("/verify/:token", recruiterController.verifyEmail);
router.post("/login", recruiterController.login);
router.post("/verify-otp", recruiterController.verifyOTP);
router.get(
  "/admin/unverified-recruiters",
  recruiterController.getUnverifiedRecruiters
);
router.get(
  "/admin/unverified-documents",
  recruiterController.getUnverifiedDocuments
);
router.put("/admin/approve/:recruiterId", recruiterController.approveRecruiter);
router.put("/admin/reject/:recruiterId", recruiterController.rejectRecruiter);
router.put("/admin/verify/:recruiterId", recruiterController.verifyRecruiter);
router.get("/getAllRecruiters", recruiterController.getRecruiters);
// router.put(
//   "/admin/verify-documents/:recruiterId",
//   recruiterController.verifyRecruiterDocuments
// );
router.get(
  "/admin/new-recruiter-count",
  recruiterController.getNewRecruiterCount
);
router.get("/profile", recruiterController.getProfile);
router.put(
  "/:id/notification-preferences",
  recruiterController.updatePreferences
);
// router.get("/getAllRecruiters", recruiterController.getRecruiters);
router.get('/CompanyDetails/:recruiterId',recruiterController.getCompanyDetails)

module.exports = router;
