const express = require("express");
const doctorController = require("../controllers/doctorController.js");
const { authorize } = require("../middlewares/authorize.js");
const { verifyToken } = require("../middlewares/auth.js");

const router = express.Router();

// doctor
router.get("/all", doctorController.getDoctors);
router.get("/:id", doctorController.getDoctorById);
router.get("/dept/:id", doctorController.getDoctorsByDept);
router.get("/reservations/:id", doctorController.getRservations);
router.post("/", doctorController.postDoctor);
router.post("/logIn", doctorController.doctorLogin);
router.put("/delete/:id", doctorController.deleteDoctor);
router.get("/schedules/:id", doctorController.getDoctorSchedules);
router.put("/addSchedules/:id", doctorController.putDoctorSchedules);
router.post("/verifyOtp", doctorController.verifyDoctorOtp);
router.post("/resendOtp", doctorController.resendDoctorOtp);

module.exports = router;
