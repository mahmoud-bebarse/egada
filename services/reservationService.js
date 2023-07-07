const _Reservation = require("../models/reservation");

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

// get all
const getReservations = async () => {
  const reservations = await _Reservation.find({
    done: false,
    cancelled: false,
  });

  return reservations;
};

const putReservation = async (id, scheduleId, dateTime) => {
  const res = await _Reservation.findByIdAndUpdate(id, {
    schedule: scheduleId,
    date: dateTime,
  });
  return res;
};

// get by id
const getReservationById = async (id) => {
  const reservation = await _Reservation
    .findById(id, { done: false, cancelled: false })
    .populate("patient")
    .populate({
      path: "doctor",
      select: { rating: 0 },
      populate: "profileImg",
    });

  return reservation;
};

// get by doctorId
const getReservationByDoctorId = async (doctorId) => {
  const reservations = await _Reservation
    .find({
      doctor: doctorId,
      done: false,
      cancelled: false,
    })
    .select({ doctor: 0 })
    .populate("schedule")
    .populate({ path: "patient", select: { name: 1, dob: 1, _id: 0 } });
  return reservations;
};

const getReservationsByTodayDate = async (id) => {
  let dat = Date.now();
  dat = new Date(dat);
  let dwt = new Date(dat.setUTCHours(0, 0, 0, 0));
  console.log(dwt);
  const reservations = await _Reservation
    .find({
      doctor: id,
      date: dwt,
      done: false,
      cancelled: false,
    })
    .select({ doctor: 0 })
    .populate("schedule")
    .populate({ path: "patient", select: { name: 1, dob: 1, _id: 0 } });
  return reservations;
};

// get by patientId
const getReservationByPatientId = async (patientId) => {
  const reservations = await _Reservation
    .find({ patient: patientId, done: false, cancelled: false })
    .select({ patient: 0 })
    .populate("schedule")
    .populate({
      path: "doctor",
      populate: { path: "dept" },
      select: { schedules: 0, rating: 0 },
    })
    .populate({
      path: "doctor",
      populate:({path:"profileImg"})
    });
  return reservations;
};

// delete reservation
const deleteReservationByDoctorId = async (doctorId) => {
  const res = await _Reservation.find({ doctor: doctorId }).deleteMany();
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

const deleteReservation = async (id) => {
  const res = await _Reservation.find({ _id: id }).deleteMany();
  return res;
};

const makeDoneReservation = async (id) => {
  const res = await _Reservation.findByIdAndUpdate(id, {
    done: true,
    cancelled: false,
  });
  return res;
};

const makeDoneReservationbyDate = async (id, dateTime) => {
  const res = await _Reservation
    .find({ doctor: id, date: dateTime })
    .updateMany({ done: true, cancelled: false });
  return res;
};

const getDoneReservationByDoctorId = async (doctorId) => {
  const reservations = await _Reservation
    .find({
      doctor: doctorId,
      done: true,
      cancelled: false,
    })
    .select({ doctor: 0 })
    .populate("schedule")
    .populate({ path: "patient", select: { name: 1, dob: 1, _id: 0 } });
  return reservations;
};

const getDoneReservationByPatientId = async (patientId) => {
  const reservations = await _Reservation
    .find({ patient: patientId, done: true, cancelled: false })
    .select({ patient: 0 })
    .populate("schedule")
    .populate({
      path: "doctor",
      populate: { path: "dept" },
      select: { name: 1, dept: 1, inFavorites: 1 },
    })
    .populate({
      path: "doctor",
      populate: { path: "profileImg" },
    });
  return reservations;
};

const makeCancelledReservationbyDate = async (id, dateTime) => {
  const res = await _Reservation
    .find({ doctor: id, date: dateTime })
    .updateMany({ cancelled: true, done: false });
  return res;
};

const makeCancelledReservation = async (id) => {
  const res = await _Reservation.findByIdAndUpdate(id, {
    cancelled: true,
    done: false,
  });
  return res;
};

const getCancelledReservationByDoctorId = async (doctorId) => {
  const reservations = await _Reservation
    .find({
      doctor: doctorId,
      done: false,
      cancelled: true,
    })
    .select({ doctor: 0 })
    .populate("schedule")
    .populate({ path: "patient", select: { name: 1, dob: 1, _id: 0 } });
  return reservations;
};

const getCancelledReservationByPatientId = async (patientId) => {
  const reservations = await _Reservation
    .find({ patient: patientId, done: false, cancelled: true })
    .select({ patient: 0 })
    .populate("schedule")
    .populate({
      path: "doctor",
      populate: "dept",
      select: { name: 1, dept: 1, inFavorites: 1 },
    })
    .populate({
      path: "doctor",
      populate: { path: "profileImg" },
    });
  return reservations;
};

module.exports = {
  deleteReservationByDoctorId,
  deleteReservationByPatientId,
  getReservations,
  getReservationById,
  getReservationByDoctorId,
  getReservationsByTodayDate,
  getDoneReservationByDoctorId,
  getCancelledReservationByDoctorId,
  getReservationByPatientId,
  getDoneReservationByPatientId,
  getCancelledReservationByPatientId,
  postReservation,
  putReservation,
  deleteAllReservations,
  makeDoneReservation,
  makeCancelledReservation,
  makeCancelledReservationbyDate,
  makeDoneReservationbyDate,
  deleteReservation,
};
