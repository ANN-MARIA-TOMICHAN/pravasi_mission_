const { readPool } = require("../db");

const SQL = {
  baseSelect: `
    SELECT
      sd.scheme_id,
      sd.scheme_name,
      sd.skill_sector,
      sd.objective_purpose,
      sd.target_beneficiaries,
      sd.eligibility_criteria,
      sd.duration,
      sd.course_fee_raw,
      sd.course_fee_amount,
      sd.nature_of_assistance,
      sd.implementing_mechanism,
      sd.application_process_nodal_office,
      sd.funding_source,
      sd.annual_outlay_raw,
      sd.annual_outlay_amount_lakhs,
      sd.existing_beneficiaries_raw,
      sd.existing_beneficiaries_count,
      sd.potential_linkage_with_pravasi_mission,
      sd.remarks_gaps_identified,
      mst.scheme_type_name,
      mc.category_name,
      COALESCE((
        SELECT json_agg(mda.department_agency_name ORDER BY mda.department_agency_name)
        FROM scheme.master_department_agency mda
        WHERE mda.department_agency_id = ANY(COALESCE(sd.department_agency_id, '{}'::bigint[]))
          AND COALESCE(mda.is_active, true) = true
      ), '[]'::json) AS department_agencies
    FROM scheme.scheme_details sd
    LEFT JOIN scheme.master_scheme_type mst ON mst.id = sd.scheme_type_id
    LEFT JOIN scheme.master_category mc ON mc.category_id = sd.category_id
  `,
};

async function getDashboardSchemes({ limit = 2 } = {}) {
  const safeLimit = Number.isFinite(Number(limit)) ? Math.max(1, Math.min(Number(limit), 20)) : 2;
  const sql = `
    ${SQL.baseSelect}
    ORDER BY sd.scheme_id DESC
    LIMIT $1::int;
  `;
  const { rows } = await readPool.query(sql, [safeLimit]);
  return rows;
}

async function getSchemes({ limit = 50 } = {}) {
  const safeLimit = Number.isFinite(Number(limit)) ? Math.max(1, Math.min(Number(limit), 100)) : 50;
  const sql = `
    ${SQL.baseSelect}
    ORDER BY sd.scheme_id DESC
    LIMIT $1::int;
  `;
  const { rows } = await readPool.query(sql, [safeLimit]);
  return rows;
}

async function getSchemeById({ schemeId }) {
  const sql = `
    ${SQL.baseSelect}
    WHERE sd.scheme_id = $1::bigint
    LIMIT 1;
  `;
  const { rows } = await readPool.query(sql, [schemeId]);
  return rows[0] || null;
}

module.exports = {
  getDashboardSchemes,
  getSchemes,
  getSchemeById,
};
