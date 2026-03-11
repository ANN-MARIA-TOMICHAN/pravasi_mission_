CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS pravasi.otp_verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier text NOT NULL,
  otp_code varchar(6) NOT NULL CHECK (otp_code ~ '^[0-9]{6}$'),
  purpose text NOT NULL CHECK (purpose IN ('signup', 'forgot_password')),
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL,
  verified boolean NOT NULL DEFAULT false
);

CREATE INDEX IF NOT EXISTS idx_otp_verifications_identifier_purpose_created
  ON pravasi.otp_verifications (identifier, purpose, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_otp_verifications_identifier_purpose_verified
  ON pravasi.otp_verifications (identifier, purpose, verified);
