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
const _Favorites = require("../models/favorites.js");
const _Answer = require("../models/answer.js");
const _Rating = require("../models/rating.js");

// post doctor
const postDoctor = async (req, res, next) => {
  const { name, mobile, dept, address, fee, desc, govern, imgId } = req.body;

  // validation
  if (!name || !mobile || !dept || !address || !fee || !desc || !govern) {
    res.status(200).send(Response(false, {}, "Missing data"));
  }
  // checking if mobile already exists
  const find = await patientService.getPatientByMobile(mobile);
  const found = await doctorService.getDoctorByMobile(mobile);

  if (find || found) {
    res
      .status(200)
      .send(Response(false, {}, "This mobile number already exists"));
  } else {
    // post
    try {
      const result = await doctorService.postDoctor(
        name,
        mobile,
        dept,
        address,
        fee,
        desc,
        govern,
        imgId
      );
      res.status(200).send(Response(true,  result , "OTP sent successfully"));
    } catch (err) {
      res.status(500).send(Response(false, {}, err.message));
    }
  }
};

// Log in
const doctorLogin = async (req, res, next) => {
  const { mobile } = req.body;
  // validation
  if (!mobile) res.status(200).send(Response(false, {}, "Missing data"));
  const found = await doctorService.getDoctorByMobile(mobile);
  if (!found)
    res
      .status(200)
      .send(Response(false, {}, "There is no doctor with this mobile number"));

  //generating otp
  const result = await generateOtp(mobile);
  found.otpId = result.data.otp_id;
  found.save();

  res.status(200).send(Response(true, found, "OTP sent successfully .. "));
};

const verifyDoctorOtp = async (req, res, next) => {
  const { mobile, otpCode } = req.body;

  const doctor = await doctorService.getDoctorByMobile(mobile);

  //verify otpCode
  verifyOtp(doctor.otpId, otpCode).then((result) => {
    if (result.data.status === "APPROVED") {
      doctor.isVerified = true;
      doctor.save();

      res.status(200).send(Response(true, { doctor }, "verified successfully"));
    } else {
      res.status(200).send(Response(false, {}, "invalid otp"));
    }
  });
};

const resendDoctorOtp = async (req, res, next) => {
  const { mobile } = req.body;

  const doctor = await doctorService.getDoctorByMobile(mobile);
  await resendOtp(doctor.otpId);

  res.status(200).send(Response(true, {}, "OTP resent successfully.."));
};

const putDoctor = async (req, res, next) => {
  const { id } = req.params;
  const { name, mobile, dept, address, fee, desc, govern, imgId } = req.body;

  if (!id) {
    res.status(200).send(Response(false, {}, "Missing params"));
  } else {
    try {
      if (mobile != null) {
        const found = await doctorService.getDoctorById(id);
        const doctor = await doctorService.putDoctor(
          id,
          name,
          mobile,
          dept,
          address,
          fee,
          desc,
          govern,
          imgId
        );
        const result = await generateOtp(mobile);
        found.otpId = result.data.otp_id;
        await doctor.save();
        await found.save();
        res
          .status(200)
          .send(Response(true, {}, "doctor has been upadated successfully"));
      } else {
        const user = await doctorService.putDoctor(
          id,
          name,
          mobile,
          dept,
          address,
          fee,
          desc,
          govern,
          imgId
        );
        await user.save();
        res
          .status(200)
          .send(Response(true, {}, "doctor has been upadated successfully"));
      }
    } catch (err) {
      res.status(500).send(Response(false, {}, err.message));
    }
  }
};

// get doctors
const getDoctors = async (req, res, next) => {
  const doctors = await doctorService.getDoctors();
  if (!doctors) {
    res.status(200).send(Response(false, {}, "There is no doctor"));
  } else {
    res.status(200).send(Response(true, doctors, ""));
  }
};

// get doctor by id
const getDoctorById = async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    res.status(200).send(Response(false, {}, "Missing params"));
  }

  try {
    const doctor = await doctorService.getDoctorById(id);
    if (!doctor) {
      res
        .status(200)
        .send(Response(false, {}, "There is no doctor with this id"));
    } else {
      res.status(200).send(Response(true, doctor, ""));
    }
  } catch (err) {
    res.status(500).send(Response(false, {}, err.message));
  }
};

// get doctor by dept id

const getDoctorsByDept = async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    res.status(200).send(Response(false, {}, "Missing params"));
  } else {
    try {
      const doctors = await doctorService.getDoctorsByDept(id);
      if (!doctors) {
        res
          .status(200)
          .send(Response(false, {}, "There is no doctor in this department"));
      } else {
        res.status(200).send(Response(true, doctors, ""));
      }
    } catch (err) {
      res.status(500).send(Response(false, {}, err.message));
    }
  }
};

const getDoctorsByGovern = async (req, res, next) => {
  const { govern } = req.body;
  if (!govern) {
    res.status(200).send(Response(false, {}, "Missing data"));
  } else {
    try {
      const doctor = await doctorService.getDoctorByGovern(govern);
      if (!doctor) {
        res
          .status(200)
          .send(
            Response(
              false,
              {},
              "there is no doctor with this department in this governorate"
            )
          );
      } else {
        res.status(200).send(Response(true, doctor, ""));
      }
    } catch (err) {
      res.status(500).send(Response(false, {}, err.message));
    }
  }
};

const deleteDoctors = async (req, res, next) => {
  try {
    await doctorService.deleteAllDoctors();
    await reservationService.deleteAllReservations();
    await doctorService.deleteAllSchedules();
    await patientService.deleteAllFavorites();
    await _Answer.find().deleteMany();
    await _Rating.find().deleteMany();
    res
      .status(200)
      .send(Response(true, {}, "all doctors has been deleted successfully"));
  } catch (err) {
    res.status(500).send(Response(false, {}, err.message));
  }
};

// delete doctor

const deleteDoctor = async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    res.status(200).send(Response(false, {}, "Missing params"));
  }

  // delete
  try {
    await doctorService.deleteDoctor(id);
    await reservationService.deleteReservationByDoctorId(id);
    await doctorService.deleteSchedules(id);
    await _Favorites.find({ doctor: id }).deleteMany();
    await _Answer.find({ doctorId: id }).deleteMany();
    await _Rating.find({ doctor: id }).deleteMany();
    res.status(200).send(Response(true, {}, "Doctor deleted successfully.."));
  } catch (err) {
    res.status(500).send(Response(false, {}, err.message));
  }
};

// get reservations by doctor id
const getRservations = async (req, res, next) => {
  const { id } = req.params;
  if (!id) res.status(200).send(Response(false, {}, "Missing params"));
  try {
    const result = await reservationService.getReservationByDoctorId(id);
    if (!result) {
      res.status(200).send(Response(false, {}, "there is no reservations"));
    } else {
      res.status(200).send(Response(true, result, ""));
    }
  } catch (err) {
    res.status(500).send(Response(false, {}, err.message));
  }
};

// get reservations by doctor id for today
const getRservationsForToday = async (req, res, next) => {
  const { id } = req.params;
  if (!id) res.status(200).send(Response(false, {}, "Missing params"));
  try {
    const result = await reservationService.getReservationsByTodayDate(id);
    if (result.length == 0) {
      res.status(200).send(Response(true, {}, "There is no reservations for today"));
    } else {
      res.status(200).send(Response(true, result, ""));
    }
  } catch (err) {
    res.status(500).send(Response(false, {}, err.message));
  }
};

const getDoneRservations = async (req, res, next) => {
  const { id } = req.params;
  if (!id) res.status(200).send(Response(false, {}, "Missing params"));
  try {
    const result = await reservationService.getDoneReservationByDoctorId(id);
    if (!result) {
      res
        .status(200)
        .send(Response(false, {}, "There is no done reservations"));
    } else {
      res.status(200).send(Response(true, result, ""));
    }
  } catch (err) {
    res.status(500).send(Response(false, {}, err.message));
  }
};

const getCancelledRservations = async (req, res, next) => {
  const { id } = req.params;
  if (!id) res.status(200).send(Response(false, {}, "Missing params"));
  try {
    const result = await reservationService.getCancelledReservationByDoctorId(
      id
    );
    if (!result) {
      res
        .status(200)
        .send(Response(false, {}, "There is no cancelled reservations"));
    } else {
      res.status(200).send(Response(true, result, ""));
    }
  } catch (err) {
    res.status(500).send(Response(false, {}, err.message));
  }
};

// post doctor schedules
const postDoctorSchedules = async (req, res, next) => {
  const { doctor } = req.params;
  const { fromHr, fromMin, toHr, toMin, day } = req.body;
  if (!doctor || !day) {
    res.status(200).send(Response(false, {}, "Missing data"));
  } else {
    try {
      const schedule = await doctorService.addDoctorsSchedules(
        doctor,
        fromHr,
        fromMin,
        toHr,
        toMin,
        day
      );
      await schedule.save();
      const doctors = await doctorService.getDoctorById(doctor);
      if (!doctors) {
        res
          .status(200)
          .send(Response(false, {}, "There is no doctor with this id "));
      } else {
        doctors.schedules.push(schedule._id);
        await doctors.save();

        res.status(200).send(Response(true, schedule, ""));
      }
    } catch (err) {
      res.status(500).send(Response(false, {}, err.message));
    }
  }
};

const putSchedules = async (req, res, next) => {
  const { doctorId, id } = req.params;
  const { fromHr, fromMin, toHr, toMin, day } = req.body;
  if (!doctorId || !id)
    res.status(200).send(Response(false, {}, "Missing params"));
  try {
    const schedule = await _Schedules.findOneAndUpdate(
      { doctor: doctorId, _id: id },
      { fromHr, fromMin, toHr, toMin, day }
    );
    schedule.save();
    res.status(200).send(Response(true, {}, "Schedule has been updated successfully"));
  } catch (err) {
    res.status(500).send(Response(false, {}, err.message));
  }
};

const getDoctorSchedules = async (req, res, next) => {
  const { id } = req.params;
  if (!id) res.status(200).send(Response(false, {}, "Missing params"));
  try {
    const schedules = await doctorService.getSchedulesByDoctorId(id);
    if (!schedules) {
      res
        .status(200)
        .send(Response(false, {}, "No schedules have been added before"));
    } else {
      res.status(200).send(Response(true, schedules, ""));
    }
  } catch (err) {
    res.status(500).send(Response(false, {}, err.message));
  }
};

const deleteSchedules = async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    res.status(200).send(Response(false, {}, "Missing params"));
  } else {
    try {
      await doctorService.deleteSchedules(id);
      res
        .status(200)
        .send(Response(true, {}, "Schedules deleted successfully.."));
    } catch (err) {
      res.status(500).send(Response(false, {}, err.message));
    }
  }
};

const deleteSchedule = async (req, res, next) => {
  const { id } = req.params; 
  if (!id) {
    res.status(200).send(Response(false, {}, "Missing params"));
  } else {
    try {
      await doctorService.deleteSchedule(id);
      res
        .status(200)
        .send(Response(true, {}, "Schedule has been deleted successfully.."));
    } catch (err) {
      res.status(500).send(Response(false, {}, err.message));
    }
  }
}

const deleteSchedulesAll = async (req, res, next) => {
  try {
    await doctorService.deleteAllSchedules();
    res
      .status(200)
      .send(Response(true, {}, "Schedules deleted successfully.."));
  } catch (err) {
    res.status(500).send(Response(false, {}, err.message));
  }
};

const getRatingsByDoctorId = async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    res.status(200).send(Response(false, {}, "Missing params"));
  } else {
    try {
      const result = await doctorService.getRatings(id);
      if (!result) {
        res
          .status(200)
          .send(Response(false, {}, "There is no ratings on this doctor"));
      } else {
        res.status(200).send(Response(true, result, ""));
      }
    } catch (err) {
      res.status(500).send(Response(false, {}, err.message));
    }
  }
};

module.exports = {
  getDoctors,
  postDoctor,
  putDoctor,
  doctorLogin,
  deleteDoctor,
  postDoctorSchedules,
  getDoctorSchedules,
  getDoctorById,
  getDoctorsByDept,
  getDoctorsByGovern,
  getRservations,
  getRservationsForToday,
  getDoneRservations,
  getCancelledRservations,
  verifyDoctorOtp,
  resendDoctorOtp,
  deleteDoctors,
  deleteSchedules,
  deleteSchedule,
  deleteSchedulesAll,
  putSchedules,
  getRatingsByDoctorId,
};
