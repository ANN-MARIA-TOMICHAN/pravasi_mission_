// src/repos/auth.db.js
const { readPool, writePool } = require("../db");

// ---------------- SQL (kept in same file) ----------------
const SQL = {
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
  `
};

// ---------------- DB ACTIONS ----------------

async function saveUserWithRoles(firstName, lastName, email, phoneCountryCode, phoneNumber,passwordHash,roleIds,assignedBy,res) {
  try {
    const { rows } = await writePool.query(SQL.saveUserWithRoles, [
        firstName,
      lastName,
      email,
      phoneCountryCode,
      phoneNumber,
      passwordHash,
      roleIds,
      assignedBy
  ]);
  return res.status(201).json({ success: true, data: rows[0]?.data });
    }catch (err) {
    // Unique violations
    if (err.code === "23505") {
      return res.status(409).json({ success: false, message: "Email or phone already exists" });
    }
    return res.status(500).json({ success: false, message: "Signup failed", error: err.message });
  }
}

async function findUserWithRoles({ email }) {
  const { rows } = await readPool.query(SQL.getUserWithRoles, [
    email || ""
  ]);
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
  findUserWithRoles,
  saveRefreshToken,
  findRefreshTokenRow,
  loadUserRoles,
  rotateRefreshToken,
  revokeRefreshToken,
  saveUserWithRoles
};
