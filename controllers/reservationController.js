const _Reservation = require("../models/reservation.js");
const { Response } = require("../models/response.js");
const reservationService = require("../services/reservationService.js");
const patientService = require("../services/patientService.js");
const doctorService = require("../services/doctorService.js");

const postReservation = async (req, res, next) => {
  const {
    patientId,
    doctorId,
    scheduleId,
    date,
    patientName,
    patientMobile,
    patientDob,
  } = req.body;

  if (!patientId) {
    try {
      const result = await patientService.postPatient(
        patientName,
        patientMobile,
        patientDob
      );
      var newPatientId = result._id;
    } catch (err) {
      res.status(500).send(Response("500", {}, err.message ));
    }
  }
  if(!doctorId || !scheduleId || !date) res.status(404).send(Response("404", {}, "missing data"));
  try {
    const reservation = await reservationService.postReservation(
      patientId || newPatientId,
      doctorId,
      scheduleId,
      date
    );

    // update patient reservations array
    const patient = await patientService.getPatientById(
      patientId || newPatientId
    );
    patient.reservations.push(reservation.id);
    await patient.save();
    // update doctor reservations array
    const doctor = await doctorService.getDoctorById(doctorId);
    doctor.reservations.push(reservation.id);
    await doctor.save();

    //send response
    res.status(200).send(Response("200", reservation, ''));
  } catch (err) {
    res.status(500).send(Response("500", {}, err.message ));
  }
};

// delete reservations by doctor id 
const deleteReservations = async (req, res, next) => {
  const { id } = req.params;
  if (!id) res.status(404).send(Response("404", {}, "missing params"));
  try {
    await reservationService.deleteReservationByDoctorId(id);
    res.status(200).send(Response("200", {}, 'reservations deleted successfully..'));
  } catch (err) {
    res.status(500).send(Response("500", {}, err.message));
  }
};

const deleteReservationsAll = async (req, res, next) => {
  try {
    await reservationService.deleteAllReservations();
    res.status(200).send(Response("200", {}, 'reservations deleted successfully..'));
  } catch (err) {
    res.status(500).send(Response("500", {}, err.message));
  }
};

//get all reservations 
const getReservations = async (req, res, next) => {
  try {
    const result = await reservationService.getReservations();
    res.status(200).send(Response("200", result , ''));
  } catch (err) {
    res.status(500).send(Response("500", {}, err.message));
  }
}
module.exports = {
  postReservation,
  deleteReservations,
  getReservations,
  deleteReservationsAll
};
