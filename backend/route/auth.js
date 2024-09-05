const express = require("express");
const auth = require("../controllers/auth");
const multer = require("multer");
const upload = multer();

const router = express.Router();

router.post("/register", upload.none(), auth.register);
router.post("/login", upload.none(), auth.login);

module.exports = router;
