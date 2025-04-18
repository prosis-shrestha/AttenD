const { pool } = require("../services/db.service");

const addInteraction = async (req, res) => {
  const { userId, stall_id, isLiked } = req.body;

  if (userId == null || stall_id == null || typeof isLiked !== "boolean") {
    return res.status(400).json({ error: "Invalid input" });
  }

  try {
    await pool.query(
      "INSERT INTO user_stall_interactions (user_id, stall_id, is_liked) VALUES ($1, $2, $3)",
      [userId, stall_id, isLiked]
    );
    res.status(200).json({ message: "Interaction saved successfully" });
  } catch (error) {
    console.error("Error saving interaction:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const removeInteraction = async (req, res) => {
  try {
    const { userId, stallId } = req.params;

    const query = `
            DELETE FROM "user_stall_interactions" 
            WHERE user_id = $1 AND stall_id = $2
        `;

    await pool.query(query, [userId, stallId]);
    res.json({ message: "Interaction removed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { addInteraction, removeInteraction };
