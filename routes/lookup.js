const express = require("express");
const lookupController = require("../controllers/lookupController.js");
const { authorize } = require("../middlewares/authorize.js");
const { verifyToken } = require("../middlewares/auth.js");

const router = express.Router();

router.get("/depts", lookupController.getDepts);
router.post("/dept", lookupController.postDepts);
router.put("/:id", lookupController.putDepts);
router.delete("/dept", lookupController.deleteDept);
router.delete("/deleteAll",lookupController.deleteAll);

module.exports = router;
