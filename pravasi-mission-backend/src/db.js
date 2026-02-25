const { Pool } = require("pg");

const writePool = new Pool({
  connectionString: process.env.DB_WRITE_URL,
  // ssl: { rejectUnauthorized: false }   // enable if required
});

const readPool = new Pool({
  connectionString: process.env.DB_READ_URL,
  // ssl: { rejectUnauthorized: false }
});

// Optional: log connections
writePool.on("connect", () => console.log("✅ Connected to WRITE DB"));
readPool.on("connect", () => console.log("✅ Connected to READ DB"));

module.exports = {
  writePool,
  readPool
};
