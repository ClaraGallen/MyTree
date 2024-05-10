const express = require("express");
const router = express.Router();
const { upload, dir } = require("../utils/imageUtils");

router.get("/test", require("../controllers/peopleController").test);
router.get("/:id", require("../controllers/peopleController").getPerson);
router.post(
  "/addRelation/:id?",
  (req, res, next) => {
    if (req.body.image || req.files) {
      upload.single("image")(req, res, next);
    } else {
      next();
    }
  },
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
router.delete(
  "/deletePerson/:id",
  require("../controllers/peopleController").deletePersonController
);
router.use("/uploads", express.static(dir));

module.exports = router;
