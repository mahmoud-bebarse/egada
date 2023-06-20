const _Patient = require("../models/patient.js");
const _Reservation = require("../models/reservation.js");
const _Rating = require("../models/rating.js");
const _Favorites = require("../models/favorites.js");
const _Doctor = require("../models/doctor.js");
const { generateOtp } = require("../services/mobileAuthService.js");

const getPatients = async () => {
  const patient = await _Patient.find({ status: true }).populate("profileImg");
  return patient;
};
const deleteAllPatients = async () => {
  const patient = await _Patient.find().deleteMany();
  return patient;
};
const getPatientById = async (id) => {
  const patient = _Patient
    .findOne({ $and: [{ _id: id }, { status: true }] })
    .populate("profileImg");
  return patient;
};

const postPatient = async (name, mobile, dob, imgId) => {
  const patient = new _Patient({
    name,
    mobile,
    dob,
    profileImg: imgId
  });

  await patient.save();

  // generate OTP and send it to verify mobile

  const result = await generateOtp(mobile);

  patient.otpId = result.data.otp_id;
  console.log(result.data);
  await patient.save();

  return patient;
};

const deletePatient = async (id) => {
  const res = await _Patient.findByIdAndDelete(id);

  return res;
};

const getPatientByMobile = async (mobile) => {
  const patient = await _Patient.findOne({
    $and: [{ mobile: mobile }, { status: true }],
  });

  return patient;
};

const postRating = async (patient, doctor, rate, comment) => {
  const rating = new _Rating({
    patient,
    doctor,
    rate,
    comment,
  });
  await rating.save();
  return rating;
};

const deleteRatingsByDocId = async (id) => {
  const rating = await _Rating.find({ doctor: id }).deleteMany();
  return rating;
};

const deleteRatingsById = async (id) => {
  const rating = await _Rating.find({ _id: id }).deleteMany();
  return rating;
};

const addToFavorites = async (patient, doctor) => {
  const favorites = new _Favorites({
    patient,
    doctor,
  });
  await favorites.save();
  return favorites;
};

const getFavoriteDoctors = async (patientId) => {
  const doctor = await _Favorites
    .find({ patient: patientId })
    .populate({
      path: "doctor",
      populate: {
        path: "rating",
        populate: { path: "patient", select: { name: 1, _id: 0 } },
      },
    })
    .populate({
      path: "doctor",
      populate: { path: "schedules" },
    })
    .populate({
      path: "doctor",
      populate: { path: "dept", select: { name: 1, _id: 0 } },
    })
    .select({ patient: 0 });
  return doctor;
};

const deleteFromFavorites = async (id) => {
  const doctor = await _Favorites.findByIdAndDelete(id);
  return doctor;
};

const getAllFavorites = async () => {
  const favorites = await _Favorites.find();
  return favorites;
};

const deleteAllFavorites = async () => {
  const favorites = await _Favorites.find().deleteMany();
  await _Doctor.find().updateMany({ inFavorites: false });
  return favorites;
};
module.exports = {
  getPatients,
  deleteAllPatients,
  postPatient,
  deletePatient,
  getPatientById,
  getPatientByMobile,
  postRating,
  deleteRatingsByDocId,
  deleteRatingsById,
  addToFavorites,
  getFavoriteDoctors,
  deleteFromFavorites,
  deleteAllFavorites,
  getAllFavorites,
};
