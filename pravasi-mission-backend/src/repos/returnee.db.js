// src/repos/returnee.db.js
const { readPool, writePool } = require("../db");

// ---------------- SQL ----------------
const SQL = {
  saveBasicInfo: `
    SELECT pravasi.save_user_basic_info_json(
      $1::uuid,
      $2::numeric,
      $3::text,
      $4::smallint,

      $5::text,
      $6::date,
      $7::text,
      $8::text,
      $9::text,
      $10::text,
      $11::text,
      $12::text,
      $13::text,
      $14::text,
      $15::text,

      $16::smallint[],
      $17::smallint[],
      $18::smallint[]
    ) AS data;
  `,

  getProfile: `
    SELECT json_build_object(
      'user', json_build_object(
        'id', u.id,
        'first_name', u.first_name,
        'last_name', u.last_name,
        'email', u.email,
        'phone_country_code', u.phone_country_code,
        'phone_number', u.phone_number
      ),
      'profile', json_build_object(
        'id', p.id,
        'annual_family_income', p.annual_family_income,
        'was_nrk_nri', p.was_nrk_nri,
        'work_experience_years', p.work_experience_years,

        'father_or_guardian_name', p.father_or_guardian_name,
        'date_of_birth', p.date_of_birth,
        'gender', p.gender,
        'nationality', p.nationality,
        'passport_number', p.passport_number,
        'id_document_url', p.id_document_url,
        'address_line1', p.address_line1,
        'address_line2', p.address_line2,
        'state', p.state,
        'district', p.district,
        'pincode', p.pincode
      ),
      'support_needed', COALESCE((
        SELECT json_agg(json_build_object('id', st.id, 'code', st.code, 'name', st.name) ORDER BY st.id)
        FROM pravasi.returnee_profile_support rps
        JOIN master.support_type st ON st.id = rps.support_type_id
        WHERE rps.profile_id = p.id
      ), '[]'::json),
      'skill_categories', COALESCE((
        SELECT json_agg(json_build_object('id', sc.id, 'code', sc.code, 'name', sc.name) ORDER BY sc.id)
        FROM pravasi.returnee_profile_skill_category pc
        JOIN master.skill_category sc ON sc.id = pc.category_id
        WHERE pc.profile_id = p.id
      ), '[]'::json),
      'skills', COALESCE((
        SELECT json_agg(json_build_object(
          'id', s.id,
          'code', s.code,
          'name', s.name,
          'category_id', s.category_id
        ) ORDER BY s.id)
        FROM pravasi.returnee_profile_skill ps
        JOIN master.skill s ON s.id = ps.skill_id
        WHERE ps.profile_id = p.id
      ), '[]'::json)
    ) AS data
    FROM pravasi.app_user u
    JOIN pravasi.user_profile p ON p.user_id = u.id
    WHERE u.id = $1::uuid;
  `,
};

// ---------------- DB ACTIONS ----------------

async function saveBasicInfo({
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
}) {
  const params = [
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
  ];

  try {
    const { rows } = await writePool.query(SQL.saveBasicInfo, params);
    return rows[0]?.data || null;
  } catch (error) {
    console.error("Error in saveBasicInfo:", error);
    throw error;
  }
}

async function getProfile({ userId }) {
  const { rows } = await readPool.query(SQL.getProfile, [userId]);
  return rows[0]?.data || null;
}

module.exports = {
  saveBasicInfo,
  getProfile,
};
