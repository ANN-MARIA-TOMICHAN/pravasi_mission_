const express = require("express");
const router = express.Router();
const schemeDB = require("../repos/scheme.db");

router.get("/", async (req, res) => {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : 50;
    const data = await schemeDB.getSchemes({ limit });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to load schemes", error: err.message });
  }
});

router.get("/:schemeId", async (req, res) => {
  try {
    const schemeId = Number(req.params.schemeId);
    if (!Number.isFinite(schemeId)) {
      return res.status(400).json({ success: false, message: "Invalid scheme id" });
    }

    const data = await schemeDB.getSchemeById({ schemeId });
    if (!data) {
      return res.status(404).json({ success: false, message: "Scheme not found" });
    }

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to load scheme", error: err.message });
  }
});

module.exports = router;
