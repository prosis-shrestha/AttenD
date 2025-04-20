const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function fetchAllTablesData() {
  try {
    const [usersResult, stallsResult, interactionsResult] = await Promise.all([
      pool.query('SELECT * FROM "User"'),
      pool.query('SELECT * FROM "Stall"'),
      pool.query("SELECT * FROM user_stall_interactions"),
    ]);

    return {
      users: usersResult.rows,
      stalls: stallsResult.rows,
      interactions: interactionsResult.rows,
    };
  } catch (error) {
    console.error("Error fetching all tables data:", error);
    throw error;
  }
}

module.exports = { pool, fetchAllTablesData };
