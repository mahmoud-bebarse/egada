const _Reservation = require("../models/reservation");

// get all
const getReservations = async () => {
  const reservations = await _Reservation.find({ done: false , cancelled: false });

  return reservations;
};

// get by id
const getReservationById = async (id) => {
  const reservation = await _Reservation
    .findById(id, { done : false , cancelled: false})
    .populate("patient")
    .populate("doctor");

  return reservation;
};

// get by doctorId
const getReservationByDoctorId = async (doctorId) => {
  const reservations = await _Reservation
    .find({
      doctor: doctorId,
      done: false,
      cancelled: false
    })
    .select({ doctor: 0 })
    .populate("schedule")
    .populate({ path: "patient", select: { name: 1, dob: 1, _id: 0 } });
  return reservations;
};
const getDoneReservationByDoctorId = async (doctorId) => {
  const reservations = await _Reservation
    .find({
      doctor: doctorId,
      done: true,
      cancelled: false
    })
    .select({ doctor: 0 })
    .populate("schedule")
    .populate({ path: "patient", select: { name: 1, dob: 1, _id: 0 } });
  return reservations;
};

const getCancelledReservationByDoctorId = async (doctorId) => {
  const reservations = await _Reservation
    .find({
      doctor: doctorId,
      done: false,
      cancelled: true
    })
    .select({ doctor: 0 })
    .populate("schedule")
    .populate({ path: "patient", select: { name: 1, dob: 1, _id: 0 } });
  return reservations;
};

// get by patientId
const getReservationByPatientId = async (patientId) => {
  const reservations = await _Reservation
    .find({ patient: patientId, done : false , cancelled: false})
    .select({ patient: 0 })
    .populate("schedule")
    .populate({
      path: "doctor",
      populate: "dept",
      select: { name: 1, dept: 1 },
    });
  return reservations;
};
const getDoneReservationByPatientId = async (patientId) => {
  const reservations = await _Reservation
    .find({ patient: patientId, done: true, cancelled : false })
    .select({ patient: 0 })
    .populate("schedule")
    .populate({
      path: "doctor",
      populate: "dept",
      select: { name: 1, dept: 1 },
    });
  return reservations;
};

const getCancelledReservationByPatientId = async (patientId) => {
  const reservations = await _Reservation
    .find({ patient: patientId, done: false, cancelled : true })
    .select({ patient: 0 })
    .populate("schedule")
    .populate({
      path: "doctor",
      populate: "dept",
      select: { name: 1, dept: 1 },
    });
  return reservations;
};

// post
const postReservation = async (patientId, doctorId, scheduleId, dateTime) => {
 
  const reservation = new _Reservation({
    patient: patientId,
    doctor: doctorId,
    schedule: scheduleId,
    date: dateTime,
  });

  const res = await reservation.save();
  return res;
};

// delete reservation
const deleteReservationByDoctorId = async (doctorId) => {
  const res = await _Reservation.find({ doctor: doctorId }).deleteMany();
  return res;
};

const makeDoneReservation = async (id) => {
  const res = await _Reservation.findByIdAndUpdate(id, { done: true });
  return res;
};
const makeDoneReservationbyDate = async (id , dateTime) => {
  const res = await _Reservation.find({ doctor: id , date: dateTime}).updateMany({done: true});
  return res;
};

const makeCancelledReservationbyDate = async (id , dateTime) => {
  const res = await _Reservation.find({ doctor: id , date: dateTime}).updateMany({cancelled: true});
  return res;
};

const makeCancelledReservation = async (id) => {
  const res = await _Reservation.findByIdAndUpdate(id, { cancelled: true });
  return res;
};

const deleteAllReservations = async () => {
  const reservation = await _Reservation.find().deleteMany();
  return reservation;
};
const deleteReservationByPatientId = async (patientId) => {
  const res = await _Reservation.find({ patient: patientId }).deleteMany();
  return res;
};
module.exports = {
  deleteReservationByDoctorId,
  deleteReservationByPatientId,
  getReservations,
  getReservationById,
  getReservationByDoctorId,
  getDoneReservationByDoctorId,
  getCancelledReservationByDoctorId,
  getReservationByPatientId,
  getDoneReservationByPatientId,
  getCancelledReservationByPatientId,
  postReservation,
  deleteAllReservations,
  makeDoneReservation,
  makeCancelledReservation,
  makeCancelledReservationbyDate,
  makeDoneReservationbyDate,
};
