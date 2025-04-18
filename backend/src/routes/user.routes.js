const express = require("express");
const router = express.Router();
const { addUser, getUnseenStalls } = require("../controllers/user.controller");

router.post("/add-users", addUser);
router.get("/get-unseen-stalls/:userId", getUnseenStalls);

module.exports = router;
