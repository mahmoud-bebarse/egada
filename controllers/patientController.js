const { Response } = require("../models/response.js");
const patientService = require("../services/patientService.js");
const {verifyOtp, resendOtp} = require('../services/mobileAuthService.js')

// get patients
const getPatients = async (req, res, next) => {
  try {
    const patients = await patientService.getPatients();
    res.status(200).send(Response("200", patients, {}));
  } catch (err) {
    res.status(500).send(Response("500", {}, { message: err.message }));
  }
};

// post patient
const postPatient = async (req, res, next) => {
  const { name, mobile, dob } = req.body;
  // validation
  if (!name && !mobile && !dob) {
    res
      .status(404)
      .send(Response("404", {}, { message: "some missing fields" }));
  }

  // post
  try {
    const result = await patientService.postPatient(name, mobile, dob);
    res.status(200).send(Response("200", result, {}));
  } catch (err) {
    res.status(500).send(Response("500", {}, { message: err.message }));
  }
};

// delete patient
const deletePatient = async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    res
      .status(404)
      .send(Response("404", {}, { message: "some missing fields" }));
  }

  // delete
  try {
    const result = await patientService.deletePatient(id);
    res.status(200).send(Response("200", result, {}));
  } catch (err) {
    res.status(500).send(Response("500", {}, { message: err.message }));
  }
};

const verifyPatientOtp = async (req, res, next) => {
  const {mobile, otpCode} = req.body;

  const patient = await patientService.getPatientByMobile(mobile);
  
  //verify otpCode
  const result = await verifyOtp(patient, otpCode);

  return result;
  
}

const resendPatientOtp = async (req, res, next) => {
  const {mobile} = req.body;

  const patient = await patientService.getPatientByMobile(mobile);

  const result = await resendOtp(patient);

  return result;

}

module.exports = {
  getPatients,
  postPatient,
  deletePatient,
  verifyPatientOtp,
  resendPatientOtp
};
