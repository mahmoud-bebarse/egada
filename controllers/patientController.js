const { Response } = require("../models/response.js");
const patientService = require("../services/patientService.js");
const doctorService = require("../services/doctorService.js")
const reservationService = require("../services/reservationService.js");
const { verifyOtp, resendOtp, generateOtp } = require("../services/mobileAuthService.js");

// get patients
const getPatients = async (req, res, next) => {
  try {
    const patients = await patientService.getPatients();
    res.status(200).send(Response("200", patients, {}));
  } catch (err) {
    res.status(500).send(Response("500", {}, { message: err.message }));
  }
};

const getPatientById = async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    res.status(404).send(Response("404", {}, { message: "missing params" }));
  }

  try {
    const patient = await patientService.getPatientById(id);
    res.status(200).send(Response("200", patient, {}));
  } catch (err) {
    res.status(500).send(Response("500", {}, { message: err.message }));
  }
};

// get reservations by id
const getRservations = async (req, res, next) => {
  const { id } = req.params;
  if (!id) res.status(404).send(Response("404", {}, { message: "some missing fields" }));
  try {
    const result = await reservationService.getReservationByPatientId(id);
    res.status(200).send(Response("200", result, {}));
  } catch (err) {
    res.status(500).send(Response("500", {}, { message: err.message }));
  }
}
// post patient
const postPatient = async (req, res, next) => {
  const { name, mobile, dob } = req.body;

  // validation
  if (!name && !mobile && !dob) {
    res
    .status(404)
    .send(Response("404", {}, { message: "some missing fields" }));
  }
  // checking if mobile already exists
  const find = patientService.getPatientByMobile(mobile);
  const found = doctorService.getDoctorByMobile(mobile);
  if (find || found)
    res
      .status(400)
      .send(
        Response("400", {}, { message: "this mobile number already exists" })
      );

  // post
  try {
    const result = await patientService.postPatient(name, mobile, dob);
    res.status(200).send(Response("200", result, {}));
  } catch (err) {
    res.status(500).send(Response("500", {}, { message: err.message }));
  }
};

// Log in 
const patientLogin = async (req, res, next) => {
  const { mobile } = req.body;
  // validation
  if (!mobile) res.status(404).send(Response("404", {}, { message: "missing fields" }));
  const found = await patientService.getPatientByMobile(mobile);
  if (!found) res.status(404).send(Response("404", {}, { message: "there is no patient with this mobile number" }));

  //generating otp
  const result = await generateOtp(mobile);
  found.otpId = result.data.otp_id;
  
  res.status(200).send(Response("200", {}, { message: "Logged in successfully .. " }));
}
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
  const { mobile, otpCode } = req.body;

  const patient = await patientService.getPatientByMobile(mobile);

  //verify otpCode
  const result = await verifyOtp(patient, otpCode);

  res.status(200).send(Response("200", result, {}));
  
}

const resendPatientOtp = async (req, res, next) => {
  const { mobile } = req.body;

  const patient = await patientService.getPatientByMobile(mobile);

  await resendOtp(patient);

  res.status(200).send(Response("200", {}, {}));  

}

module.exports = {
  getPatients,
  getPatientById,
  getRservations,
  postPatient,
  patientLogin,
  deletePatient,
  verifyPatientOtp,
  resendPatientOtp,
};
