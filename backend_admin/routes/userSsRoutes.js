const express = require("express");
const router = express.Router();
const userController = require("../controllers/AdminUserController");

router.get("/", userController.getUsers);
router.put("/:id", userController.updateUser);
router.put("/:id/approve-certification", userController.approveCertification);
router.put("/:id/reject-certification", userController.rejectCertification);
router.put("/:id/verify", userController.verifyUser);

module.exports = router;
