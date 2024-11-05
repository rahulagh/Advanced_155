const Recruiter = require("../../models/admin/adminRecruiter");
const sendEmail = require("../../utils/admin/sendEmail");

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
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const total = await Recruiter.countDocuments(query);
    const recruiters = await Recruiter.find(query)
      .select("-password")
      .skip(skip)
      .limit(limit);
    res.json({ recruiters, total, page, limit });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.approveRecruiter = async (req, res) => {
  try {
    const { id, reason } = req.body;
    const recruiter = await Recruiter.findByIdAndUpdate(
      id,
      { $set: { status: "approved" } },
      { new: true }
    );

    if (!recruiter) {
      return res.status(404).json({ message: "Recruiter not found" });
    }

    await sendEmail(
      recruiter.email,
      "Profile Approved",
      `Your profile has been approved. Reason: ${reason}`
    );

    res.json(recruiter);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.rejectRecruiter = async (req, res) => {
  try {
    const { id, reason } = req.body;
    const recruiter = await Recruiter.findByIdAndUpdate(
      id,
      { $set: { status: "rejected" } },
      { new: true }
    );

    if (!recruiter) {
      return res.status(404).json({ message: "Recruiter not found" });
    }

    await sendEmail(
      recruiter.email,
      "Profile Rejected",
      `Your profile has been rejected. Reason: ${reason}`
    );

    res.json(recruiter);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.verifyRecruiter = async (req, res) => {
  try {
    const { id } = req.params;
    const recruiter = await Recruiter.findByIdAndUpdate(
      id,
      { $set: { verified: true } },
      { new: true }
    );

    if (!recruiter) {
      return res.status(404).json({ message: "Recruiter not found" });
    }

    await sendEmail(
      recruiter.email,
      "Profile Verified",
      "Your profile has been verified."
    );

    res.json(recruiter);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
