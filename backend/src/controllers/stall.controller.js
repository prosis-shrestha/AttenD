const { pool } = require("../services/db.service");

const addStall = async (req, res) => {
  try {
    const { stall_name, stall_desc, stall_dept, stall_img } = req.body;

    const maxIdResult = await pool.query(
      'SELECT MAX(id) as max_id FROM "Stall"'
    );
    const nextId = (maxIdResult.rows[0].max_id || 0) + 1;

    const result = await pool.query(
      'INSERT INTO "Stall" (id, stall_name, stall_desc, stall_dept, stall_img) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [nextId, stall_name, stall_desc, stall_dept, stall_img]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error adding stall:", error);
    res.status(500).json({ error: "Failed to add stall" });
  }
};

module.exports = { addStall };
