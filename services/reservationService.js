const _Reservation = require("../models/reservation");

// get all
const getReservations = async () => {
  const reservations = await _Reservation
    .find({ status: true })
    .populate("patient")
    .populate("doctor");

  return reservations;
};

// get by id
const getReservationById = async (id) => {
  const reservation = await _Reservation
    .findById(id)
    .populate("patient")
    .populate("doctor");

  return reservation;
};

// get by doctorId
const getReservationByDoctorId = async (doctorId) => {
  const reservations = await _Reservation
    .find({ doctor: doctorId })
    .populate("patient");

  return reservations;
};

// get by patientId
const getReservationByPatientId = async (patientId) => {
  const reservations = await _Reservation
    .find({ patient: patientId })
    .populate("doctor");

  return reservations;
};

// post
const postReservation = async (patientId, doctorId, scheduleId) => {
  console.log("patient", patientId);
  console.log("doctor", doctorId);
  console.log("schedule", scheduleId);
  const reservation = new _Reservation({
    patient: patientId,
    doctor: doctorId,
    schedule: scheduleId,
  });

  const res = await reservation.save();
  return res;
};

// delete

module.exports = {
  getReservations,
  getReservationById,
  getReservationByDoctorId,
  getReservationByPatientId,
  postReservation,
};
