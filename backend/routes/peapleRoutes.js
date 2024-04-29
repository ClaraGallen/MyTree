const express = require("express");
const router = express.Router();

router.get("/test", require("../controllers/peapleController").test);
router.post(
  "/addRelation",
  require("../controllers/peapleController").addRelation
);

module.exports = router;
