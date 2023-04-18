const express = require("express");
const doctorController = require("../controllers/doctorController.js");
const { authorize } = require("../middlewares/authorize.js");
const { verifyToken } = require("../middlewares/auth.js");

const router = express.Router();

// doctor
router.get("/all", doctorController.getDoctors);
router.get("/:id", doctorController.getDoctorById);
router.get("/reservations/:id", doctorController.getRservations);
router.post("/", doctorController.postDoctor);
router.put("/addSchedules/:id", doctorController.putDoctorSchedules);
router.get("/verifyOtp", doctorController.verifyDoctorOtp)
router.get("/resendOtp", doctorController.resendDoctorOtp)

module.exports = router;
