const express = require("express");
const patientController = require("../controllers/patientController.js");
const { authorize } = require("../middlewares/authorize.js");
const { verifyToken } = require("../middlewares/auth.js");

const router = express.Router();

router.get("/all", patientController.getPatients);
router.get("/:id", patientController.getPatientById);
router.get("/reservations/:id", patientController.getRservations);
router.post("/", patientController.postPatient);
router.post("/logIn", patientController.patientLogin);
router.put("/delete/:id", patientController.deletePatient);
router.post("/verifyOtp", patientController.verifyPatientOtp);
router.post("/resendOtp", patientController.resendPatientOtp);

module.exports = router;
