// src/repos/master.db.js
const { readPool } = require("../db");

// ---------------- SQL ----------------
const SQL = {
  getSupportTypes: `
    SELECT id, code, name
    FROM master.support_type
    ORDER BY id
  `,

  getSkillCategories: `
    SELECT id, code, name
    FROM master.skill_category
    ORDER BY id
  `,

  getSkillsBase: `
    SELECT id, category_id, code, name
    FROM master.skill
  `,
};

// ---------------- DB ACTIONS ----------------

async function getSupportTypes() {
  const { rows } = await readPool.query(SQL.getSupportTypes);
  return rows;
}

async function getSkillCategories() {
  const { rows } = await readPool.query(SQL.getSkillCategories);
  return rows;
}

async function getSkills({ categoryIds }) {
  let sql = SQL.getSkillsBase;
  const params = [];

  if (categoryIds && categoryIds.length > 0) {
    sql += ` WHERE category_id = ANY($1::int[])`;
    params.push(categoryIds);
  }

  sql += ` ORDER BY category_id, id`;

  const { rows } = await readPool.query(sql, params);
  return rows;
}

module.exports = {
  getSupportTypes,
  getSkillCategories,
  getSkills,
};
