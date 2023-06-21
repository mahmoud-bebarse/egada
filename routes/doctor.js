const express = require("express");
const doctorController = require("../controllers/doctorController.js");

const router = express.Router();

// doctor
router.get("/all", doctorController.getDoctors);
router.get("/:id", doctorController.getDoctorById);
router.get("/dept/:id", doctorController.getDoctorsByDept);
router.get("/govern/get", doctorController.getDoctorsByGovern);
router.get("/reservations/:id", doctorController.getRservations);
router.get("/doneReservations/:id", doctorController.getDoneRservations);
router.get(
  "/cancelledReservations/:id",
  doctorController.getCancelledRservations
);
router.post("/", doctorController.postDoctor);
router.post("/logIn", doctorController.doctorLogin);
router.put("/update/:id", doctorController.putDoctor);
router.delete("/delete/:id", doctorController.deleteDoctor);
router.delete("/deleteAll", doctorController.deleteDoctors);
router.delete("/schedules/delete/:id", doctorController.deleteSchedules);
router.delete("/schedules/deleteAll", doctorController.deleteSchedulesAll);
router.get("/schedules/:id", doctorController.getDoctorSchedules);
router.post("/addSchedules/:doctor", doctorController.postDoctorSchedules);
router.post("/verifyOtp", doctorController.verifyDoctorOtp);
router.post("/resendOtp", doctorController.resendDoctorOtp);
router.put("/:doctorId/schedules/:id", doctorController.putSchedules);
router.get("/ratings/:id", doctorController.getRatingsByDoctorId);
module.exports = router;
