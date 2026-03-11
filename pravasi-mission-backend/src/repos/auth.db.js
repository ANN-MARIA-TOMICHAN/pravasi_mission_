// src/repos/auth.db.js
const { readPool, writePool } = require("../db");

// ---------------- SQL (kept in same file) ----------------
const SQL = {
  getUserByIdentifier: `
    SELECT
      u.id,
      u.first_name,
      u.last_name,
      u.email,
      u.phone_country_code,
      u.phone_number,
      u.password_hash
    FROM pravasi.app_user u
    WHERE u.email = $1::citext
       OR (u.phone_country_code || u.phone_number) = $1::text
    LIMIT 1;
  `,

  getUserByEmailOrPhone: `
    SELECT
      u.id,
      u.first_name,
      u.last_name,
      u.email,
      u.phone_country_code,
      u.phone_number
    FROM pravasi.app_user u
    WHERE u.email = $1::citext
       OR (u.phone_country_code = $2::text AND u.phone_number = $3::text)
    LIMIT 1;
  `,

  getUserWithRoles: `
    SELECT
      u.id,
      u.first_name,
      u.last_name,
      u.email,
      u.phone_country_code,
      u.phone_number,
      u.password_hash,
      u.is_phone_verified,
      COALESCE(
        json_agg(
          json_build_object(
            'role_id', r.id,
            'role_code', r.role_code,
            'role_name', r.role_name
          )
        ) FILTER (WHERE r.id IS NOT NULL),
        '[]'::json
      ) AS roles
    FROM pravasi.app_user u
    LEFT JOIN pravasi.app_user_role ur ON ur.user_id = u.id
    LEFT JOIN pravasi.user_role r ON r.id = ur.role_id
    WHERE u.email = $1::citext
    GROUP BY u.id
    LIMIT 1;
  `,

  insertRefreshToken: `
    INSERT INTO pravasi.auth_refresh_token
      (user_id, token_hash, expires_at, user_agent, ip)
    VALUES
      ($1::uuid, $2::text, $3::timestamptz, $4::text, $5::text)
  `,

  getRefreshToken: `
    SELECT id, user_id, expires_at, revoked_at
    FROM pravasi.auth_refresh_token
    WHERE user_id = $1::uuid
      AND token_hash = $2::text
    LIMIT 1
  `,

  revokeRefreshTokenById: `
    UPDATE pravasi.auth_refresh_token
    SET revoked_at = now()
    WHERE id = $1::uuid
  `,

  revokeRefreshTokenByHash: `
    UPDATE pravasi.auth_refresh_token
    SET revoked_at = now()
    WHERE user_id = $1::uuid
      AND token_hash = $2::text
      AND revoked_at IS NULL
  `,

  getUserRoles: `
    SELECT
      u.id,
      u.email,
      u.first_name,
      u.last_name,
      u.phone_country_code,
      u.phone_number,
      COALESCE(
        json_agg(r.role_code) FILTER (WHERE r.role_code IS NOT NULL),
        '[]'::json
      ) AS roles
    FROM pravasi.app_user u
    LEFT JOIN pravasi.app_user_role ur ON ur.user_id = u.id
    LEFT JOIN pravasi.user_role r ON r.id = ur.role_id
    WHERE u.id = $1::uuid
    GROUP BY u.id
  `,
  saveUserWithRoles:`
  SELECT pravasi.create_user_with_roles_json(
        $1::text,
        $2::text,
        $3::citext,
        $4::text,
        $5::text,
        $6::text,
        $7::smallint[],
        $8::uuid
      ) AS data;
  `,

  countRecentOtpRequests: `
    SELECT COUNT(*)::int AS total
    FROM pravasi.otp_verifications
    WHERE identifier = $1::text
      AND purpose = $2::text
      AND created_at >= (now() - interval '5 minutes');
  `,

  insertOtpVerification: `
    INSERT INTO pravasi.otp_verifications
      (identifier, otp_code, purpose, expires_at)
    VALUES
      ($1::text, $2::varchar(6), $3::text, $4::timestamptz)
    RETURNING id, identifier, purpose, created_at, expires_at, verified;
  `,

  markOtpVerified: `
    UPDATE pravasi.otp_verifications
    SET verified = true
    WHERE id = (
      SELECT id
      FROM pravasi.otp_verifications
      WHERE identifier = $1::text
        AND otp_code = $2::varchar(6)
        AND purpose = $3::text
        AND verified = false
        AND expires_at > now()
      ORDER BY created_at DESC
      LIMIT 1
    )
    RETURNING id, identifier, purpose, created_at, expires_at, verified;
  `,

  getLatestVerifiedOtp: `
    SELECT id, identifier, purpose, created_at, expires_at, verified
    FROM pravasi.otp_verifications
    WHERE identifier = $1::text
      AND purpose = $2::text
      AND verified = true
      AND expires_at > now()
    ORDER BY created_at DESC
    LIMIT 1;
  `,

  expireVerifiedOtp: `
    UPDATE pravasi.otp_verifications
    SET expires_at = now()
    WHERE identifier = $1::text
      AND purpose = $2::text
      AND verified = true
      AND expires_at > now();
  `,

  updatePasswordByIdentifier: `
    UPDATE pravasi.app_user
    SET password_hash = $2::text
    WHERE email = $1::citext
       OR (phone_country_code || phone_number) = $1::text
    RETURNING id;
  `
};

// ---------------- DB ACTIONS ----------------

async function saveUserWithRoles(firstName, lastName, email, phoneCountryCode, phoneNumber, passwordHash, roleIds, assignedBy) {
  const { rows } = await writePool.query(SQL.saveUserWithRoles, [
    firstName,
    lastName,
    email,
    phoneCountryCode,
    phoneNumber,
    passwordHash,
    roleIds,
    assignedBy,
  ]);
  return rows[0]?.data || null;
}

async function findUserByIdentifier({ identifier }) {
  const { rows } = await readPool.query(SQL.getUserByIdentifier, [identifier]);
  return rows[0] || null;
}

async function findUserByEmailOrPhone({ email, phoneCountryCode, phoneNumber }) {
  const { rows } = await readPool.query(SQL.getUserByEmailOrPhone, [
    email,
    phoneCountryCode,
    phoneNumber,
  ]);
  return rows[0] || null;
}

async function findUserWithRoles({ email }) {
  const { rows } = await readPool.query(SQL.getUserWithRoles, [
    email || ""
  ]);
  return rows[0] || null;
}

async function countRecentOtpRequests({ identifier, purpose }) {
  const { rows } = await writePool.query(SQL.countRecentOtpRequests, [identifier, purpose]);
  return Number(rows[0]?.total || 0);
}

async function createOtpVerification({ identifier, otpCode, purpose, expiresAt }) {
  const { rows } = await writePool.query(SQL.insertOtpVerification, [
    identifier,
    otpCode,
    purpose,
    expiresAt,
  ]);
  return rows[0] || null;
}

async function verifyOtpCode({ identifier, otpCode, purpose }) {
  const { rows } = await writePool.query(SQL.markOtpVerified, [identifier, otpCode, purpose]);
  return rows[0] || null;
}

async function getLatestVerifiedOtp({ identifier, purpose }) {
  const { rows } = await writePool.query(SQL.getLatestVerifiedOtp, [identifier, purpose]);
  return rows[0] || null;
}

async function expireVerifiedOtp({ identifier, purpose }) {
  await writePool.query(SQL.expireVerifiedOtp, [identifier, purpose]);
}

async function updatePasswordByIdentifier({ identifier, passwordHash }) {
  const { rows } = await writePool.query(SQL.updatePasswordByIdentifier, [identifier, passwordHash]);
  return rows[0] || null;
}

async function saveRefreshToken({ userId, tokenHash, expiresAt, userAgent, ip }) {
  await writePool.query(SQL.insertRefreshToken, [
    userId,
    tokenHash,
    expiresAt,
    userAgent || null,
    ip || null,
  ]);
}

async function findRefreshTokenRow({ userId, tokenHash }) {
  const { rows } = await writePool.query(SQL.getRefreshToken, [userId, tokenHash]);
  return rows[0] || null;
}

async function loadUserRoles({ userId }) {
  const { rows } = await readPool.query(SQL.getUserRoles, [userId]);
  return rows[0] || null;
}

async function rotateRefreshToken({
  oldTokenRowId,
  userId,
  newTokenHash,
  newExpiresAt,
  userAgent,
  ip,
}) {
  await writePool.query("BEGIN");
  try {
    await writePool.query(SQL.revokeRefreshTokenById, [oldTokenRowId]);
    await writePool.query(SQL.insertRefreshToken, [
      userId,
      newTokenHash,
      newExpiresAt,
      userAgent || null,
      ip || null,
    ]);
    await writePool.query("COMMIT");
  } catch (e) {
    await writePool.query("ROLLBACK");
    throw e;
  }
}

async function revokeRefreshToken({ userId, tokenHash }) {
  await writePool.query(SQL.revokeRefreshTokenByHash, [userId, tokenHash]);
}

module.exports = {
  // actions
  findUserByIdentifier,
  findUserByEmailOrPhone,
  findUserWithRoles,
  countRecentOtpRequests,
  createOtpVerification,
  verifyOtpCode,
  getLatestVerifiedOtp,
  expireVerifiedOtp,
  updatePasswordByIdentifier,
  saveRefreshToken,
  findRefreshTokenRow,
  loadUserRoles,
  rotateRefreshToken,
  revokeRefreshToken,
  saveUserWithRoles
};
