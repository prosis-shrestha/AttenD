const express = require("express");
const router = express.Router();
const { addStall } = require("../controllers/stall.controller");

router.post("/add-stall", addStall);

module.exports = router;
