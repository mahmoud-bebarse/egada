const express = require("express");
const doctorController = require("../controllers/doctorController.js");
const { authorize } = require("../middlewares/authorize.js");
const { verifyToken } = require("../middlewares/auth.js");

const router = express.Router();

//User
router.get("/all", doctorController.getDoctors);

router.post("/", doctorController.postDoctor)

module.exports = router; 