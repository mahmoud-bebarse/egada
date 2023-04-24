const { Response } = require("../models/response.js");
const doctorService = require("../services/doctorService.js");
const patientService = require("../services/patientService.js");
const {
  verifyOtp,
  resendOtp,
  generateOtp,
} = require("../services/mobileAuthService.js");
const reservationService = require("../services/reservationService.js");

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

// get doctor by dept id

const getDoctorsByDept = async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    res.status(404).send(Response("404", {}, { message: "missing params" }));
  } else {
    try {
      const doctors = await doctorService.getDoctorsByDept(id);
      res.status(200).send(Response("200", doctors, {}));
    } catch (err) {
      res.status(500).send(Response("500", {}, { message: err.message }));
    }
  }
};
// get reservations by doctor id
const getRservations = async (req, res, next) => {
  const { id } = req.params;
  if (!id)
    res
      .status(404)
      .send(Response("404", {}, { message: "some missing fields" }));
  try {
    const result = await reservationService.getReservationByDoctorId(id);
    res.status(200).send(Response("200", result, {}));
  } catch (err) {
    res.status(500).send(Response("500", {}, { message: err.message }));
  }
};

// post doctor
const postDoctor = async (req, res, next) => {
  const { name, mobile, dept } = req.body;

  // validation
  if (!name && !mobile && !dept) {
    res
      .status(404)
      .send(Response("404", {}, { message: "some missing fields" }));
  }
  // checking if mobile already exists
  const find = await patientService.getPatientByMobile(mobile);
  const found = await doctorService.getDoctorByMobile(mobile);

  if (find || found) {
    res
      .status(400)
      .send(
        Response("400", {}, { message: "this mobile number already exists" })
      );
  } else {
    // post
    try {
      const result = await doctorService.postDoctor(name, mobile, dept);
      res.status(200).send(Response("200", result, {}));
    } catch (err) {
      res.status(500).send(Response("500", {}, { message: err.message }));
    }
  }
};

// Log in
const doctorLogin = async (req, res, next) => {
  const { mobile } = req.body;
  // validation
  if (!mobile)
    res.status(404).send(Response("404", {}, { message: "missing fields" }));
  const found = await doctorService.getDoctorByMobile(mobile);
  if (!found)
    res
      .status(404)
      .send(
        Response(
          "404",
          {},
          { message: "there is no doctor with this mobile number" }
        )
      );

  //generating otp
  const result = await generateOtp(mobile);
  found.otpId = result.data.otp_id;
  found.save();

  res
    .status(200)
    .send(Response("200", { message: "OTP sent successfully .. " }, {}));
};

// delete doctor

const deleteDoctor = async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    res
      .status(404)
      .send(Response("404", {}, { message: "some missing fields" }));
  }

  // delete
  try {
    const result = await doctorService.deleteDoctor(id);
    res.status(200).send(Response("200", result, {}));
  } catch (err) {
    res.status(500).send(Response("500", {}, { message: err.message }));
  }
};

// put doctor schedules
const putDoctorSchedules = async (req, res, next) => {
  const { id } = req.params;
  const { schedules } = req.body;

  try {
    const doctor = await doctorService.addDoctorsSchedules(id, schedules);
    res.status(200).send(Response("200", doctor, {}));
  } catch (err) {
    res.status(500).send(Response("500", {}, { message: err.message }));
  }
};

const getDoctorSchedules = async (req, res, next) => {
  const { id } = req.params;
  try {
    const schedules = await doctorService.getSchedulesByDoctorId(id);
    res.status(200).send(Response("200", schedules, {}));
  } catch (err) {
    res.status(500).send(Response("500", {}, { message: err.message }));
  }
};

const verifyDoctorOtp = async (req, res, next) => {
  const { mobile, otpCode } = req.body;

  const doctor = await doctorService.getDoctorByMobile(mobile);

  //verify otpCode
  verifyOtp(doctor.otpId, otpCode).then((result) => {
    if (result.data.status === "APPROVED") {
      doctor.isVerified = true;
      doctor.save();

      res
        .status(200)
        .send(Response("200", {}, { message: "verified successfully" }));
    } else {
      res.status(400).send(Response("400", {}, { message: "invalid otp" }));
    }
  });
};

const resendDoctorOtp = async (req, res, next) => {
  const { mobile } = req.body;

  const doctor = await doctorService.getDoctorByMobile(mobile);
  await resendOtp(doctor.otpId);

  res.status(200).send(Response("200", {}, {}));
};

module.exports = {
  getDoctors,
  postDoctor,
  doctorLogin,
  deleteDoctor,
  putDoctorSchedules,
  getDoctorSchedules,
  getDoctorById,
  getDoctorsByDept,
  getRservations,
  verifyDoctorOtp,
  resendDoctorOtp,
};
