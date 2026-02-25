require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const returneeRoutes = require("./routes/returnee.routes");
const masterRoutes = require("./routes/master.routes");
const {writePool,readPool}=require('./db')
const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));

app.get("/health", (_, res) => res.json({ ok: true }));
app.get("/health/db", async (req, res) => {
  try {
    await writePool.query("SELECT 1");
    await readPool.query("SELECT 1");
    res.json({ success: true, message: "Both DBs OK" });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/returnee", returneeRoutes);
app.use("/api/master", masterRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`API running on :${port}`));
