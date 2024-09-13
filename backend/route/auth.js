const express = require("express");
const auth = require("../controllers/auth");
const multer = require("multer");
const {checkBlacklist} = require("../middleware/checkBlackList");
const upload = multer();

const router = express.Router();

router.post("/register", upload.none(), auth.register);
router.post("/login", upload.none(), auth.login);
router.get("/logout", upload.none(), checkBlacklist, auth.logout);

module.exports = router;
