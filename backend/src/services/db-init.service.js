const fs = require("fs");
const path = require("path");
const { pool } = require("./db.service");

const initializeDatabase = async () => {
  try {
    // Get all user-defined tables in the 'public' schema
    const { rows } = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE';
    `);

    // If no tables exist in the public schema, run init.sql
    if (rows.length === 0) {
      console.log("No tables found. Running init.sql...");
      const initSqlPath = path.join(__dirname, "init.sql");
      const initSql = fs.readFileSync(initSqlPath, "utf-8");
      await pool.query(initSql);
      console.log("Database initialized.");
    } else {
      console.log("Tables already exist. Skipping init.sql.");
    }
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};

module.exports = initializeDatabase;
