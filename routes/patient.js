const express = require("express");
const patientController = require("../controllers/patientController.js");
const { authorize } = require("../middlewares/authorize.js");
const { verifyToken } = require("../middlewares/auth.js");

const router = express.Router();

router.get("/all", patientController.getPatients);
router.post("/", patientController.postPatient);
router.delete("/:id", patientController.deletePatient);
router.get("/verifyOtp", patientController.verifyPatientOtp)
router.get("/resendOtp", patientController.resendPatientOtp)

module.exports = router;
