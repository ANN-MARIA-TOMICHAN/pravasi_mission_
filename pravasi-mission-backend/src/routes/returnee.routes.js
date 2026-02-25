const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middleware/auth");
const returneeDB = require("../repos/returnee.db");

// POST /api/returnee/profile/basic
router.post("/profile/basic", requireAuth, async (req, res) => {
  const userId = req.user.id;

  const {
    annual_family_income = null,
    was_nrk_nri = null,
    work_experience_years = null,

    father_or_guardian_name = null,
    date_of_birth = null,
    gender = null,
    nationality = null,
    passport_number = null,
    id_document_url = null,

    address_line1 = null,
    address_line2 = null,
    state = null,
    district = null,
    pincode = null,

    support_type_ids = [],
    skill_category_ids = [],
    skill_ids = [],
  } = req.body || {};
console.log("gender===",gender)
  if (was_nrk_nri && !["NRK", "NRI"].includes(was_nrk_nri)) {
    return res.status(400).json({ success: false, message: "was_nrk_nri must be NRK or NRI" });
  }

  if (!Array.isArray(support_type_ids) ||
      !Array.isArray(skill_category_ids) ||
      !Array.isArray(skill_ids)) {
    return res.status(400).json({
      success: false,
      message: "support_type_ids, skill_category_ids, skill_ids must be arrays",
    });
  }

  try {
    const data = await returneeDB.saveBasicInfo({
      userId,
      annual_family_income,
      was_nrk_nri,
      work_experience_years,
      father_or_guardian_name,
      date_of_birth,
      gender,
      nationality,
      passport_number,
      id_document_url,
      address_line1,
      address_line2,
      state,
      district,
      pincode,
      support_type_ids,
      skill_category_ids,
      skill_ids,
    });

    return res.json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Save profile failed", error: err.message });
  }
});

// GET /api/returnee/profile
router.get("/profile", requireAuth, async (req, res) => {
  const userId = req.user.id;

  try {
    const data = await returneeDB.getProfile({ userId });

    if (!data) {
      return res.status(404).json({ success: false, message: "Profile not found" });
    }

    return res.json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Fetch profile failed", error: err.message });
  }
});

module.exports = router;
