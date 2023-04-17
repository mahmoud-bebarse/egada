const _Doctor = require("../models/doctor.js");
const { Response } = require("../models/response.js");
const doctorService = require("../services/doctorService.js");
const { verifyOtp, resendOtp } = require("../services/mobileAuthService.js");

// get doctors
const getDoctors = async (req, res, next) => {
  const doctors = await doctorService.getDoctors();
  res.status(200).send(Response("200", doctors, {}));
};

// get doctor by id
const getDoctorById = async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    res.status(404).send(Response("404", {}, { message: "missing params" }));
  }

  try {
    const doctor = await doctorService.getDoctorById(id); 
    res.status(200).send(Response("200", doctor, {}));
  } catch (err) {
    res.status(500).send(Response("500", {}, { message: err.message }));
  }
};

// post doctor
const postDoctor = async (req, res, next) => {
  const { name, mobile, dept, schedules } = req.body;
  // validation
  if (!name && !mobile && !dept && !schedules) {
    res
      .status(404)
      .send(Response("404", {}, { message: "some missing fields" }));
  }

  // post
  const result = await doctorService.postDoctor(name, mobile, dept, schedules);
  res.status(200).send(Response("200", result, {}));
};

// put doctor schedules
const putDoctorSchedules = async (req, res, next) => {
  const { id } = req.params;
  const { schedules } = req.body;

  try {
    const doctor = await doctorService.addDoctorsSchedules(id, schedules);
    res.status(200).send(Response("200", doctor, {}));
  } catch {
    res.status(500).send(Response("500", {}, { message: err.message }));
  }
};

const verifyDoctorOtp = async (req, res, next) => {
  const { mobile, otpCode } = req.body;

  const doctor = await doctorService.getDoctorByMobile(mobile);

  //verify otpCode
  const result = await verifyOtp(doctor, otpCode);

  return result;
};

const resendDoctoerOtp = async (req, res, next) => {
  const { mobile } = req.body;

  const doctor = await doctorService.getDoctorByMobile(mobile);

  const result = await resendOtp(doctor);

  return result;
};

module.exports = {
  getDoctors,
  postDoctor,
  putDoctorSchedules,
  getDoctorById,
  verifyDoctorOtp,
  resendDoctoerOtp,
};
