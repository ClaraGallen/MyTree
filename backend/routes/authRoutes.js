const express = require("express");
const router = express.Router();

router.get("/test", require("../controllers/authController").test);
router.post("/register", require("../controllers/authController").registerUser);
// router.post("/login", loginUser);
// router.get("/Profile", getProfile);
// router.get("/logout", logoutUser);

module.exports = router;
