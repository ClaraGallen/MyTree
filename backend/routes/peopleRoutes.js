const express = require("express");
const router = express.Router();

router.get("/test", require("../controllers/peopleController").test);
router.get("/:id", require("../controllers/peopleController").getPerson);
router.post(
  "/addRelation/:id?",
  require("../controllers/peopleController").addRelation
);
router.post(
  "/addRelationByEmail/:email/:id?",
  require("../controllers/peopleController").addRelationByEmail
);
router.patch(
  "/updateRelation/:id?",
  require("../controllers/peopleController").updateRelation
);

module.exports = router;