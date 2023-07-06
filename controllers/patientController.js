const { Response } = require("../models/response.js");
const _Favorites = require("../models/favorites.js");
const _Doctor = require("../models/doctor.js");
const _Question = require("../models/question.js");
const patientService = require("../services/patientService.js");
const doctorService = require("../services/doctorService.js");
const reservationService = require("../services/reservationService.js");
const {
  verifyOtp,
  resendOtp,
  generateOtp,
} = require("../services/mobileAuthService.js");

// post patient
const postPatient = async (req, res, next) => {
  const { name, mobile, dob, imgId, token } = req.body;

  // validation
  if (!name && !mobile && !dob) {
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
      const result = await patientService.postPatient(name, mobile, dob, imgId, token);
      res.status(200).send(Response(true, result, "OTP sent seccessfully"));
    } catch (err) {
      res.status(500).send(Response(false, {}, err.message));
    }
  }
};

// Log in
const patientLogin = async (req, res, next) => {
  const { mobile } = req.body;
  // validation
  if (!mobile) {
    res.status(200).send(Response(false, {}, "Missing data"));
  } else {
    try {
      const found = await patientService.getPatientByMobile(mobile);
      if (!found) {
        res
          .status(200)
          .send(
            Response(false, "", "There is no patient with this mobile number")
          );
      } else {
        //generating otp
        const result = await generateOtp(mobile);
        found.otpId = result.data.otp_id;
        await found.save();

        res
          .status(200)
          .send(Response(true, found._id, "OTP sent successfully .. "));
      }
    } catch (err) {
      res.status(500).send(Response(false, {}, err.message));
    }
  }
};

const verifyPatientOtp = async (req, res, next) => {
  const { mobile, otpCode } = req.body;

  const patient = await patientService.getPatientByMobile(mobile);

  //verify otpCode
  verifyOtp(patient.otpId, otpCode).then(async (result) => {
    if (result.data.status === "APPROVED") {
      patient.isVerified = true;
      await patient.save();

      res.status(200).send(Response(true, patient, "Verified successfully"));
    } else {
      res.status(200).send(Response(false, {}, "invalid otp"));
    }
  });
};

const resendPatientOtp = async (req, res, next) => {
  const { mobile } = req.body;

  const patient = await patientService.getPatientByMobile(mobile);

  await resendOtp(patient.otpId);

  res.status(200).send(Response(true, {}, "OTP resent successfully"));
};

const putPatient = async (req, res, next) => {
  const { id } = req.params;
  const { name, mobile, dob, imgId, token } = req.body;

  if (!id) {
    res.status(200).send(Response(false, {}, "Missing params"));
  } else {
    try {
      if (mobile != null) {
        const found = await patientService.getPatientById(id);
        const patient = await patientService.putPatient(
          id,
          name,
          mobile,
          dob,
          imgId,
          token
        );
        const result = await generateOtp(mobile);
        found.otpId = result.data.otp_id;
        await patient.save();
        await found.save();
        res
          .status(200)
          .send(Response(true, {}, "patient has been upadated successfully"));
      } else {
        const user = await patientService.putPatient(
          id,
          name,
          mobile,
          dob,
          imgId,
          token
        );
        await user.save();
        res
          .status(200)
          .send(Response(true, {}, "patient has been upadated successfully"));
      }
    } catch (err) {
      res.status(500).send(Response(false, {}, err.message));
    }
  }
};

// get patients
const getPatients = async (req, res, next) => {
  try {
    const patients = await patientService.getPatients();
    if (!patients) {
      res.status(200).send(Response(false, {}, "There is no patient"));
    } else {
      res.status(200).send(Response(true, patients, ""));
    }
  } catch (err) {
    res.status(500).send(Response(false, {}, err.message));
  }
};

const getPatientById = async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    res.status(200).send(Response(false, {}, "Missing params"));
  }

  try {
    const patient = await patientService.getPatientById(id);
    if (!patient) {
      res
        .status(200)
        .send(Response(false, {}, "There is no patient with this id"));
    } else {
      res.status(200).send(Response(true, patient, ""));
    }
  } catch (err) {
    res.status(500).send(Response(false, {}, err.message));
  }
};

const deletePatients = async (req, res, next) => {
  try {
    await patientService.deleteAllPatients();
    await reservationService.deleteAllReservations();
    await _Favorites.find().deleteMany();
    await _Question.find().deleteMany();
    res
      .status(200)
      .send(Response(true, {}, "All patients has been deleted successfully"));
  } catch (err) {
    res.status(500).send(Response(false, {}, err.message));
  }
};

// delete patient
const deletePatient = async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    res.status(200).send(Response(false, {}, "Missing params"));
  }

  // delete
  try {
    await patientService.deletePatient(id);
    await reservationService.deleteReservationByPatientId(id);
    await _Favorites.find({ patient: id }).deleteMany();
    await _Question.find({ patientId: id }).deleteMany();
    res.status(200).send(Response(true, {}, "Patient deleted succssefully.."));
  } catch (err) {
    res.status(500).send(Response(false, {}, err.message));
  }
};

// get reservations by id
const getRservations = async (req, res, next) => {
  const { id } = req.params;
  if (!id) res.status(200).send(Response(false, {}, "Missing data"));
  try {
    const result = await reservationService.getReservationByPatientId(id);
    if (!result) {
      res.status(200).send(Response(false, {}, "There is no reservatons"));
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
    const result = await reservationService.getDoneReservationByPatientId(id);
    if (!result) {
      res.status(200).send(Response(false, {}, "There is no done reservatons"));
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
    const result = await reservationService.getCancelledReservationByPatientId(
      id
    );
    if (!result) {
      res
        .status(200)
        .send(Response(false, {}, "There is no cancelled reservatons"));
    } else {
      res.status(200).send(Response(true, result, ""));
    }
  } catch (err) {
    res.status(500).send(Response(false, {}, err.message));
  }
};

const addRating = async (req, res, next) => {
  const { patient, doctor, rate, comment } = req.body;
  if (!patient || !doctor) {
    res.status(200).send(Response(false, {}, "Missing data"));
  } else {
    try {
      const review = await patientService.postRating(
        patient,
        doctor,
        rate,
        comment
      );
      await review.save();
      const reviews = await doctorService.getRatings(doctor);
      const sum = reviews.reduce((acc, review) => acc + review.rate, 0);
      const avgRating = sum / reviews.length;
      const result = await doctorService.getDoctorById(doctor);
      result.rating.push(review._id);
      await result.save();
      const doctors = await doctorService.updateAvgRatingByDoctorId(
        doctor,
        avgRating
      );

      await doctors.save();
      res.status(200).send(Response(true, review, ""));
    } catch (err) {
      res.status(500).send(Response(false, {}, err.message));
    }
  }
};

const deleteRatingByDoctorId = async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    res.status(200).send(Response(false, {}, "Missing params"));
  } else {
    try {
      await patientService.deleteRatingsByDocId(id);
      await doctorService.updateAvgRatingByDoctorId(id, 0);
      res
        .status(200)
        .send(Response(true, {}, "Ratings deleted successfully.."));
    } catch (err) {
      res.status(500).send(Response(false, {}, err.message));
    }
  }
};

const deleteRatings = async (req, res, next) => {
  const { id } = req.params;
  const { doctor } = req.body;
  if (!id) {
    res.status(200).send(Response(false, {}, "Missing params"));
  } else {
    try {
      await patientService.deleteRatingsById(id);
      const reviews = await doctorService.getRatings(doctor);
      const sum = reviews.reduce((acc, review) => acc + review.rate, 0);
      const avgRating = sum / reviews.length;
      await doctorService.updateAvgRatingByDoctorId(doctor, avgRating);
      res.status(200).send(Response(true, {}, "Rating deleted successfully.."));
    } catch (err) {
      res.status(500).send(Response(false, {}, err.message));
    }
  }
};

const favorites = async (req, res, next) => {
  const { id } = req.params;
  const { doctorId } = req.body;

  if (!id || !doctorId) {
    res.status(200).send(Response(false, {}, "Missing data"));
  } else {
    try {
      const doctors = await _Favorites.find({ patient: id, doctor: doctorId });
      console.log(doctors);
      if (doctors.length != 0) {
        await _Favorites.find({ patient: id, doctor: doctorId }).deleteMany();
        await _Doctor.findByIdAndUpdate(doctorId, { inFavorites: false });
        res
          .status(200)
          .send(
            Response(true, {}, "Doctor deleted from favorites successfully..")
          );
      } else {
        await patientService.addToFavorites(id, doctorId);
        await _Doctor.findByIdAndUpdate(doctorId, { inFavorites: true });
        res
          .status(200)
          .send(Response(true, {}, "Doctor added to favorites successfully.."));
      }
    } catch (err) {
      res.status(500).send(Response(false, {}, err.message));
    }
  }
};

const allFavorites = async (req, res, next) => {
  try {
    const doctors = await patientService.getAllFavorites();
    if (!doctors) {
      res.status(200).send(Response(false, {}, "there is no favorites"));
    } else {
      res.status(200).send(Response(true, doctors, ""));
    }
  } catch (err) {
    res.status(500).send(Response(false, {}, err.message));
  }
};

const getFavorites = async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    res.status(200).send(Response(false, {}, "Missing params"));
  } else {
    try {
      const doctors = await patientService.getFavoriteDoctors(id);
      if (doctors.length == 0) {
        res.status(200).send(Response(true, [], "Favorites is empty"));
      } else {
        res.status(200).send(Response(true, doctors, ""));
      }
    } catch (err) {
      res.status(500).send(Response(false, {}, err.message));
    }
  }
};

const removeFromFavorites = async (req, res, next) => {
  const { id } = req.params;
  const { doctorId } = req.body;
  if (!id) {
    res.status(200).send(Response(false, {}, "Missing params"));
  } else {
    try {
      await patientService.deleteFromFavorites(id);
      await _Doctor.findByIdAndUpdate(doctorId, { inFavorites: false });
      res
        .status(200)
        .send(
          Response(true, {}, "Doctor removed from favorites successfully..")
        );
    } catch (err) {
      res.status(500).send(Response(false, {}, err.message));
    }
  }
};

const removeAllFavorites = async (req, res, next) => {
  try {
    await patientService.deleteAllFavorites();
    res
      .status(200)
      .send(
        Response(true, {}, "Doctors removed from favorites successfully..")
      );
  } catch (err) {
    res.status(500).send(Response(false, {}, err.message));
  }
};
module.exports = {
  getPatients,
  getPatientById,
  getRservations,
  getDoneRservations,
  getCancelledRservations,
  postPatient,
  putPatient,
  patientLogin,
  deletePatient,
  verifyPatientOtp,
  resendPatientOtp,
  deletePatients,
  addRating,
  deleteRatingByDoctorId,
  deleteRatings,
  favorites,
  getFavorites,
  removeFromFavorites,
  removeAllFavorites,
  allFavorites,
};
