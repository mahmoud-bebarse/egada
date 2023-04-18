const _Patient = require("../models/patient.js");
const _Reservation = require("../models/reservation.js");
const { generateOtp } = require('../services/mobileAuthService.js')

const getPatients = async () => {
  const patient = await _Patient.find({ status: true }).populate({
    path: "reservations",
    populate: "doctor",
  });
  return patient;
};

const getPatientById = async (id) => {
  const patient = _Patient
    .findOne({ $and: [{ _id: id }, { status: true }] })
    .populate({
      path: "reservations",
      populate: "doctor",
    });
  return patient;
};

const postPatient = async (name, mobile, dob) => {
  const patient = new _Patient({
    name,
    mobile,
    dob,
  });

  const res = await patient.save();

  // generate OTP and send it to verify mobile
  generateOtp(mobile);

  return res;
};

const deletePatient = async (id) => {
  const res = await _Patient.findByIdAndUpdate(id, {
    status: false,
  });

  return res;
};

const getPatientByMobile = async (mobile) => {
  const patient = await _Patient.findOne({$and:[
    {mobile: mobile},
    {status: true}
  ]})

  return patient
}

module.exports = {
  getPatients,
  postPatient,
  deletePatient,
  getPatientById,
  getPatientByMobile
};
