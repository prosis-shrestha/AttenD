const express = require("express");
const router = express.Router();
const { login, adminLogin } = require("../controllers/auth.controller");

router.get("/get-user/:code", login);
router.post("/admin-login", adminLogin);

module.exports = router;
