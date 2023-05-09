const { Response } = require("../models/response.js");
const doctorService = require("../services/doctorService.js");
const patientService = require("../services/patientService.js");
const {
  verifyOtp,
  resendOtp,
  generateOtp,
} = require("../services/mobileAuthService.js");
const reservationService = require("../services/reservationService.js");
const _Schedules = require("../models/schedule.js");



// get doctors
const getDoctors = async (req, res, next) => {
  const doctors = await doctorService.getDoctors();
  res.status(200).send(Response("200", doctors, ""));
};

const deleteDoctors = async (req, res, next) => {
  try {
    await doctorService.deleteAllDoctors();
    res
      .status(200)
      .send(Response("200", {}, "all doctors has been deleted successfully"));
  } catch (err) {
    res.status(500).send(Response("500", {}, err.message));
  }
};

// get doctor by id
const getDoctorById = async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    res.status(404).send(Response("404", {}, "missing params"));
  }

  try {
    const doctor = await doctorService.getDoctorById(id);
    res.status(200).send(Response("200", doctor, ""));
  } catch (err) {
    res.status(500).send(Response("500", {}, err.message));
  }
};

// get doctor by dept id

const getDoctorsByDept = async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    res.status(404).send(Response("404", {}, "missing params"));
  } else {
    try {
      const doctors = await doctorService.getDoctorsByDept(id);
      res.status(200).send(Response("200", doctors, ""));
    } catch (err) {
      res.status(500).send(Response("500", {}, err.message));
    }
  }
};
// get reservations by doctor id
const getRservations = async (req, res, next) => {
  const { id } = req.params;
  if (!id) res.status(404).send(Response("404", {}, "some missing fields"));
  try {
    const result = await reservationService.getReservationByDoctorId(id);
    res.status(200).send(Response("200", result, ""));
  } catch (err) {
    res.status(500).send(Response("500", {}, err.message));
  }
};

const getDoneRservations = async (req, res, next) => {
  const { id } = req.params;
  if (!id) res.status(404).send(Response("404", {}, "some missing fields"));
  try {
    const result = await reservationService.getDoneReservationByDoctorId(id);
    res.status(200).send(Response("200", result, ""));
  } catch (err) {
    res.status(500).send(Response("500", {}, err.message));
  }
};

const getCancelledRservations = async (req, res, next) => {
  const { id } = req.params;
  if (!id) res.status(404).send(Response("404", {}, "some missing fields"));
  try {
    const result = await reservationService.getCancelledReservationByDoctorId(id);
    res.status(200).send(Response("200", result, ""));
  } catch (err) {
    res.status(500).send(Response("500", {}, err.message));
  }
};

// post doctor
const postDoctor = async (req, res, next) => {
  const { name, mobile, dept,address,fee } = req.body;

  // validation
  if (!name && !mobile && !dept && !address && !fee) {
    res.status(404).send(Response("404", {}, "some missing fields"));
  }
  // checking if mobile already exists
  const find = await patientService.getPatientByMobile(mobile);
  const found = await doctorService.getDoctorByMobile(mobile);

  if (find || found) {
    res
      .status(400)
      .send(Response("400", {}, "this mobile number already exists"));
  } else {
    // post
    try {
      const result = await doctorService.postDoctor(name, mobile, dept,address,fee);
      res.status(200).send(Response("200", {result}, "OTP sent successfully"));
    } catch (err) {
      res.status(500).send(Response("500", {}, err.message));
    }
  }
};

// Log in
const doctorLogin = async (req, res, next) => {
  const { mobile } = req.body;
  // validation
  if (!mobile) res.status(404).send(Response("404", {}, "missing fields"));
  const found = await doctorService.getDoctorByMobile(mobile);
  if (!found)
    res
      .status(404)
      .send(Response("404", {} , "there is no doctor with this mobile number"));

  //generating otp
  const result = await generateOtp(mobile);
  found.otpId = result.data.otp_id;
  found.save();

  res.status(200).send(Response("200",found._id , "OTP sent successfully .. "));
};

// delete doctor

const deleteDoctor = async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    res.status(404).send(Response("404", {}, "some missing fields"));
  }

  // delete
  try {
    await doctorService.deleteDoctor(id);
    await reservationService.deleteReservationByDoctorId(id);
    await doctorService.deleteSchedules(id);
    res.status(200).send(Response("200", {}, "Doctor deleted successfully.."));
  } catch (err) {
    res.status(500).send(Response("500", {}, err.message));
  }
};

// post doctor schedules
const postDoctorSchedules = async (req, res, next) => {
  const { id } = req.params;
  const { fromHr,fromMin,toHr,toMin, day } = req.body;
  if (!fromHr || !toHr ) {
    res.status(404).send(Response("404", {}, "missing fields"));
  } else
  {
    try {
      const schedule = await doctorService.addDoctorsSchedules(
        id,
        fromHr,
        fromMin,
        toHr,
        toMin,
        day
      );
      await schedule.save();
      const doctor = await doctorService.getDoctorById(id);
      doctor.schedules.push(schedule.id);
      await doctor.save();

      res.status(200).send(Response("200", schedule, ""));
    } catch (err) {
      res.status(500).send(Response("500", {}, err.message));
    }
  }
  
};

const putSchedules = async (req, res, next) => {
  const { doctorId, id } = req.params;
  const { fromHr, fromMin, toHr, toMin, day } = req.body;
  if (!doctorId || !id) res.status(404).send(Response("404", {}, "missing params"));
  try {
    const schedule = await _Schedules.findOneAndUpdate({ doctor: doctorId, _id: id },{fromHr,fromMin,toHr,toMin,day});
    schedule.save();
    res.status(200).send(Response("200", schedule, ""));
  } catch (err) {
    res.status(500).send(Response("500", {}, err.message));
  }
};

const getDoctorSchedules = async (req, res, next) => {
  const { id } = req.params;
  if (!id) res.status(404).send(Response("404", {}, "missing params"));
  try {
    const schedules = await doctorService.getSchedulesByDoctorId(id);
    res.status(200).send(Response("200", schedules, ""));
  } catch (err) {
    res.status(500).send(Response("500", {}, err.message));
  }
};

const deleteSchedules = async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    res.status(404).send(Response("404", {}, "missing params"));
  } else {
    try {
      await doctorService.deleteSchedules(id);
      res
        .status(200)
        .send(Response("200", {}, "Schedules deleted successfully.."));
    } catch (err) {
      res.status(500).send(Response("500", {}, err.message));
    }
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

      res.status(200).send(Response("200", {doctor}, "verified successfully"));
    } else {
      res.status(400).send(Response("400", {}, "invalid otp"));
    }
  });
};

const resendDoctorOtp = async (req, res, next) => {
  const { mobile } = req.body;

  const doctor = await doctorService.getDoctorByMobile(mobile);
  await resendOtp(doctor.otpId);

  res.status(200).send(Response("200", {}, "OTP resent successfully.."));
};

module.exports = {
  getDoctors,
  postDoctor,
  doctorLogin,
  deleteDoctor,
  postDoctorSchedules,
  getDoctorSchedules,
  getDoctorById,
  getDoctorsByDept,
  getRservations,
  getDoneRservations,
  getCancelledRservations,
  verifyDoctorOtp,
  resendDoctorOtp,
  deleteDoctors,
  deleteSchedules,
  putSchedules,
};
