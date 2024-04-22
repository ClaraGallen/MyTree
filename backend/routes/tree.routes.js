const express = require("express");
const {
  testTree,
  CreateParent,
  CreateRelation
} = require("../controllers/tree.controller");
const router = express.Router();

router.get("/", testTree);
router.post("/parents", CreateParent);
router.post("/relation", CreateRelation);


module.exports = router;
