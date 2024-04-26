const express = require("express");
const router = express.Router();

router.get("/test", require("../controllers/peapleController").test);

module.exports = router;
