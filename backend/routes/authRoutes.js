const express = require("express");
const router = express.Router();

router.get("/test", require("../controllers/authController").test);
router.post("/register", require("../controllers/authController").registerUser);
router.post("/login", require("../controllers/authController").loginUser);
router.get("/logout", require("../controllers/authController").logoutUser);
// router.get("/Profile", getProfile);

module.exports = router;
