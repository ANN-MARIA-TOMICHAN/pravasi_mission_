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

async function ensureOtpSchema() {
  await writePool.query(`CREATE EXTENSION IF NOT EXISTS pgcrypto;`);
  await writePool.query(`
    CREATE TABLE IF NOT EXISTS pravasi.otp_verifications (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      identifier text NOT NULL,
      otp_code varchar(6) NOT NULL CHECK (otp_code ~ '^[0-9]{6}$'),
      purpose text NOT NULL CHECK (purpose IN ('signup', 'forgot_password')),
      created_at timestamptz NOT NULL DEFAULT now(),
      expires_at timestamptz NOT NULL,
      verified boolean NOT NULL DEFAULT false
    );
  `);
  await writePool.query(`
    CREATE INDEX IF NOT EXISTS idx_otp_verifications_identifier_purpose_created
      ON pravasi.otp_verifications (identifier, purpose, created_at DESC);
  `);
  await writePool.query(`
    CREATE INDEX IF NOT EXISTS idx_otp_verifications_identifier_purpose_verified
      ON pravasi.otp_verifications (identifier, purpose, verified);
  `);
}

ensureOtpSchema()
  .then(() => {
    app.listen(port, () => console.log(`API running on :${port}`));
  })
  .catch((err) => {
    console.error("Failed to ensure OTP schema:", err.message);
    process.exit(1);
  });
