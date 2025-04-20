const { pool } = require("../services/db.service");

const login = async (req, res) => {
  try {
    const { code } = req.params;
    const query = 'SELECT * FROM "User" WHERE code = $1';
    const result = await pool.query(query, [code]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error in login:", err.message);
    res.status(500).json({ error: err.message });
  }
};

const adminLogin = async (req, res) => {
  try {
    const { code } = req.body;
    const adminCode = process.env.ADMIN_CODE;
    if (code === adminCode) {
      res.json({ success: true, message: "Admin access granted" });
    } else {
      res.status(401).json({ error: "Invalid admin code" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { login, adminLogin };
