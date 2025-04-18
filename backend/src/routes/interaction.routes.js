const express = require("express");
const router = express.Router();
const {
  addInteraction,
  removeInteraction,
} = require("../controllers/interaction.controller");

router.post("/add-interaction", addInteraction);
router.delete("/remove-interaction/:userId/:stallId", removeInteraction);

module.exports = router;
