const express = require("express");
const patientController = require("../controllers/patientController.js");

const router = express.Router();

router.get("/all", patientController.getPatients);
router.get("/:id", patientController.getPatientById);
router.get("/reservations/:id", patientController.getRservations);
router.get("/doneReservations/:id", patientController.getDoneRservations);
router.get("/cancelledReservations/:id", patientController.getCancelledRservations);
router.post("/", patientController.postPatient);
router.post("/logIn", patientController.patientLogin);
router.delete("/delete/:id", patientController.deletePatient);
router.delete("/deleteAll", patientController.deletePatients)
router.post("/verifyOtp", patientController.verifyPatientOtp);
router.post("/resendOtp", patientController.resendPatientOtp);
router.post("/rating", patientController.addRating);
router.delete("/deleteRatings/:id", patientController.deleteRating);
module.exports = router;
