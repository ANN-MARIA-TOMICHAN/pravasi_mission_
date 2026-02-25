const express = require("express");
const router = express.Router();
const masterDB = require("../repos/master.db");

// GET /api/master/support-types
router.get("/support-types", async (req, res) => {
  try {
    const data = await masterDB.getSupportTypes();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed", error: err.message });
  }
});

// GET /api/master/skill-categories
router.get("/skill-categories", async (req, res) => {
  try {
    const data = await masterDB.getSkillCategories();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed", error: err.message });
  }
});

// GET /api/master/skills?category_ids=1,2,3
router.get("/skills", async (req, res) => {
  try {
    const { category_ids } = req.query;

    const categoryIds = category_ids
      ? String(category_ids)
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean)
          .map(Number)
      : [];

    const data = await masterDB.getSkills({ categoryIds });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed", error: err.message });
  }
});

module.exports = router;
