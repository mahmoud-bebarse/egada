const _Patient = require("../models/patient.js");
const _Reservation = require("../models/reservation.js");
const { generateOtp } = require('../services/mobileAuthService.js')

const getPatients = async () => {
  const patient = await _Patient.find({status : true}).populate({
    path: "reservations",
    populate: "doctor",
  });
  return patient;
};
const deleteAllPatients = async () => {
  const patient = await _Patient.find().deleteMany();
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
  const patient = await _Patient.findOne({$and:[
    {mobile: mobile},
    {status: true}
  ]})

  return patient
}

module.exports = {
  getPatients,
  deleteAllPatients,
  postPatient,
  deletePatient,
  getPatientById,
  getPatientByMobile
};
