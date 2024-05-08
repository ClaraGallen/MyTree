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
router.get(
  "/getRelation/:id1/:id2",
  require("../controllers/peopleController").getRelationController
);
router.patch(
  "/updatePerson/:id?",
  require("../controllers/peopleController").updateRelationController
);
router.delete(
  "/deleteRelation/:id1/:id2?",
  require("../controllers/peopleController").deleteRelationController
);

module.exports = router;
