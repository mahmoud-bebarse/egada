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

  try {
    const reservation = await reservationService.postReservation(
      patientId || newPatientId,
      doctorId,
      scheduleId
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

module.exports = {
  postReservation,
};
