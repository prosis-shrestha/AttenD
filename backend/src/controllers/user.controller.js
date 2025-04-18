const { pool } = require("../services/db.service");

const addUser = async (req, res) => {
  try {
    const { username, number, gender, code } = req.body;
    const query = `
            INSERT INTO "User" (username, number, gender, code) 
            VALUES ($1, $2, $3, $4) 
            RETURNING *;
        `;
    const result = await pool.query(query, [username, number, gender, code]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getUnseenStalls = async (req, res) => {
  try {
    const { userId } = req.params;
    const query = `
            SELECT DISTINCT s.* 
            FROM "Stall" s
            LEFT JOIN user_stall_interactions usi ON 
                s.id = usi.stall_id AND 
                usi.user_id = $1
            WHERE usi.id IS NULL
            ORDER BY s.id;
        `;

    const result = await pool.query(query, [userId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { addUser, getUnseenStalls };
