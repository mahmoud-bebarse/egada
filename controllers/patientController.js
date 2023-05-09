const { Response } = require("../models/response.js");
const patientService = require("../services/patientService.js");
const doctorService = require("../services/doctorService.js");
const reservationService = require("../services/reservationService.js");
const {
  verifyOtp,
  resendOtp,
  generateOtp,
} = require("../services/mobileAuthService.js");

// get patients
const getPatients = async (req, res, next) => {
  try {
    const patients = await patientService.getPatients();
    res.status(200).send(Response("200", patients, {}));
  } catch (err) {
    res.status(500).send(Response("500", {}, err.message ));
  }
};

const deletePatients = async (req, res, next) => {
  try {
    await patientService.deleteAllPatients();
    res.status(200).send(Response("200", {}, "all patients has been deleted successfully"));
  } catch (err) {
    res.status(500).send(Response("500", {}, err.message));
  }
};

const getPatientById = async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    res.status(404).send(Response("404", {},  "missing params" ));
  }

  try {
    const patient = await patientService.getPatientById(id);
    res.status(200).send(Response("200", patient, ''));
  } catch (err) {
    res.status(500).send(Response("500", {},  err.message ));
  }
};

// get reservations by id
const getRservations = async (req, res, next) => {
  const { id } = req.params;
  if (!id)
    res
      .status(404)
      .send(Response("404", {}, "some missing fields"));
  try {
    const result = await reservationService.getReservationByPatientId(id);
    res.status(200).send(Response("200", result, ""));
  } catch (err) {
    res.status(500).send(Response("500", {},  err.message ));
  }
};

const getDoneRservations = async (req, res, next) => {
  const { id } = req.params;
  if (!id)
    res
      .status(404)
      .send(Response("404", {}, "some missing fields"));
  try {
    const result = await reservationService.getDoneReservationByPatientId(id);
    res.status(200).send(Response("200", result, ""));
  } catch (err) {
    res.status(500).send(Response("500", {},  err.message ));
  }
};
// post patient
const postPatient = async (req, res, next) => {
  const { name, mobile, dob } = req.body;

  // validation
  if (!name && !mobile && !dob) {
    res
      .status(404)
      .send(Response("404", {},  "some missing fields" ));
  }
  // checking if mobile already exists
  const find = await patientService.getPatientByMobile(mobile);
  const found = await doctorService.getDoctorByMobile(mobile);
  if (find || found) {
    res
      .status(400)
      .send(
        Response("400", {}, "this mobile number already exists" )
      );
  } else {
    // post
    try {
      const result = await patientService.postPatient(name, mobile, dob);
      res.status(200).send(Response("200", result, 'OTP sent seccessfully'));
    } catch (err) {
      res.status(500).send(Response("500", {},  err.message ));
    }
  }
};

// Log in
const patientLogin = async (req, res, next) => {
  const { mobile } = req.body;
  // validation
  if (!mobile)
    res.status(404).send(Response("404", {}, "missing fields" ));
  const found = await patientService.getPatientByMobile(mobile);
  if (!found)
    res
      .status(404)
      .send(
        Response(
          "404",
          {},
           "there is no patient with this mobile number" 
        )
      );

  //generating otp
  const result = await generateOtp(mobile);
  found.otpId = result.data.otp_id;
  found.save();

  res
    .status(200)
    .send(Response("200",found._id, "OTP sent successfully .. " ));
};

// delete patient
const deletePatient = async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    res
      .status(404)
      .send(Response("404", {},  "some missing fields" ));
  }

  // delete
  try {
    await patientService.deletePatient(id);
    await reservationService.deleteReservationByPatientId(id);
    res.status(200).send(Response("200",{}, 'Patient deleted succssefully..'));
  } catch (err) {
    res.status(500).send(Response("500", {}, err.message ));
  }
};

const verifyPatientOtp = async (req, res, next) => {
  const { mobile, otpCode } = req.body;

  const patient = await patientService.getPatientByMobile(mobile);

  //verify otpCode
  verifyOtp(patient.otpId, otpCode).then((result) => {
    if (result.data.status === "APPROVED") {
      patient.isVerified = true;
      patient.save();

      res
        .status(200)
        .send(Response("200", {patient},  "verified successfully" ));
    } else {
      res.status(400).send(Response("400", {},  "invalid otp" ));
    }
  });
};

const resendPatientOtp = async (req, res, next) => {
  const { mobile } = req.body;

  const patient = await patientService.getPatientByMobile(mobile);

  await resendOtp(patient.otpId);

  res.status(200).send(Response("200", {}, 'OTP resent successfully'));
};

module.exports = {
  getPatients,
  getPatientById,
  getRservations,
  getDoneRservations,
  postPatient,
  patientLogin,
  deletePatient,
  verifyPatientOtp,
  resendPatientOtp,
  deletePatients
};
