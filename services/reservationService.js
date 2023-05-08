const _Reservation = require("../models/reservation");

// get all
const getReservations = async () => {
  const reservations = await _Reservation.find({ status: true });

  return reservations;
};

// get by id
const getReservationById = async (id) => {
  const reservation = await _Reservation
    .findById(id, { status: true })
    .populate("patient")
    .populate("doctor");

  return reservation;
};

// get by doctorId
const getReservationByDoctorId = async (doctorId) => {
  const reservations = await _Reservation.find({
    doctor: doctorId, status: true,
  }).select({ doctor: 0 })
    .populate("schedule")
    .populate({path:"patient", select: {name: 1 , dob: 1, _id :0}});
  return reservations;
};

// get by patientId
const getReservationByPatientId = async (patientId) => {
  const reservations = await _Reservation
    .find({ patient: patientId, status: true })
    .select({ patient: 0 })
    .populate("schedule")
    .populate({
      path: "doctor",
      populate: "dept",
      select: { name: 1, dept: 1, _id: 0 },
    });
  return reservations;
};

// post
const postReservation = async (patientId, doctorId, scheduleId, dateTime) => {
  console.log("patient", patientId);
  console.log("doctor", doctorId);
  console.log("schedule", scheduleId);
  const reservation = new _Reservation({
    patient: patientId,
    doctor: doctorId,
    schedule: scheduleId,
    date : dateTime
  });

  const res = await reservation.save();
  return res;
};

// delete reservation
const deleteReservationByDoctorId  = async (doctorId) => {
  const res = await _Reservation.find({ doctor: doctorId }).deleteMany();
  return res;
};

const deleteAllReservations = async () => {
  const reservation = await _Reservation.find().deleteMany();
  return reservation;
}
const deleteReservationByPatientId = async (patientId) => {
  const res = _Reservation.find({ patient: patientId }).deleteMany();
  return res;
};
module.exports = {
  deleteReservationByDoctorId,
  deleteReservationByPatientId,
  getReservations,
  getReservationById,
  getReservationByDoctorId,
  getReservationByPatientId,
  postReservation,
  deleteAllReservations
};
