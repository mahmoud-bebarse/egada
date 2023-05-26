const { Response } = require("../models/response.js");
const _Favorites = require("../models/favorites.js");
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
    if (!patients) {
      res.status(200).send(Response(false, {}, "There is no patient"));
    } else {
      res.status(200).send(Response(true, patients, ""));
    }
  } catch (err) {
    res.status(500).send(Response(false, {}, err.message));
  }
};

const deletePatients = async (req, res, next) => {
  try {
    await patientService.deleteAllPatients();
    await reservationService.deleteAllReservations();
    res
      .status(200)
      .send(Response(true, {}, "All patients has been deleted successfully"));
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
// post patient
const postPatient = async (req, res, next) => {
  const { name, mobile, dob } = req.body;

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
      const result = await patientService.postPatient(name, mobile, dob);
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
  if (!mobile) res.status(200).send(Response(false, {}, "Missing data"));
  const found = await patientService.getPatientByMobile(mobile);
  if (!found)
    res
      .status(200)
      .send(Response(false, "", "There is no patient with this mobile number"));

  //generating otp
  const result = await generateOtp(mobile);
  found.otpId = result.data.otp_id;
  found.save();

  res.status(200).send(Response(true, found._id, "OTP sent successfully .. "));
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
    res.status(200).send(Response(true, {}, "Patient deleted succssefully.."));
  } catch (err) {
    res.status(500).send(Response(false, {}, err.message));
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
      const doctors = await doctorService.updateAvgRatingByDoctorId(doctor, avgRating);
      
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
      res.status(200).send(Response(true, {}, "Ratings deleted successfully.."));
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
      const doctors = await _Favorites.find({ patient: id ,doctor: doctorId });
      if (doctors) {
        await _Favorites.find({ patient: id, doctor: doctorId }).deleteMany();
        res.status(200).send(Response(true, {}, "Doctor deleted from favorites successfully.."));
      } else {
        await patientService.addToFavorites(id, doctorId);
        res.status(200).send(Response(true, {}, "Doctor added to favorites successfully.."));
      }
    } catch (err) {
      res.status(500).send(Response(false, {}, err.message));
    }
  }
};

const getFavorites = async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    res.status(200).send(Response(false, {}, "Missing params"));
  } else {
    try {
      const doctors = await patientService.getFavoriteDoctors(id);
      if (!doctors) {
        res.status(200).send(Response(false, {}, "Favorites is empty"));
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

  if (!id) {
    res.status(200).send(Response(false, {}, "Missing params"));
  } else {
    try {
      await patientService.deleteFromFavorites(id);
      res.status(200).send(Response(true, {}, "Doctor removed from favorites successfully.."));
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
      res
        .status(200)
        .send(
          Response(true, doctors, "")
        );
    }
   } catch (err) {
     res.status(500).send(Response(false, {}, err.message));
  }
};

const removeAllFavorites = async (req, res, next) => {
  try {
    await patientService.deleteAllFavorites();
    res
      .status(200)
      .send(Response(true, {}, "Doctors removed from favorites successfully.."));
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
  allFavorites
};
