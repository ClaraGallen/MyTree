const express = require("express");
const router = express.Router();

router.get("/test", require("../controllers/peopleController").test);
router.get("/:id", require("../controllers/peopleController").getPerson);
router.post(
  "/addRelation/:id",
  require("../controllers/peopleController").addRelation
);

module.exports = router;
