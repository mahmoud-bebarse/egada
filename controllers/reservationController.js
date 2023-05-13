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
    dateTime,
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
      res.status(500).send(Response("500", {}, err.message));
    }
  }
  if (!doctorId || !scheduleId || !dateTime) {
    res.status(404).send(Response("404", {}, "missing data"));
  } else {
    try {
      const reservation = await reservationService.postReservation(
        patientId || newPatientId,
        doctorId,
        scheduleId,
        dateTime
      );

      //send response
      res.status(200).send(Response("200", reservation, ""));
    } catch (err) {
      res.status(500).send(Response("500", {}, err.message));
    }
  }
};

// delete reservations by doctor id
const deleteReservations = async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    res.status(404).send(Response("404", {}, "missing params"));
  } else {
    try {
      await reservationService.deleteReservationByDoctorId(id);
      res
        .status(200)
        .send(Response("200", {}, "reservations deleted successfully.."));
    } catch (err) {
      res.status(500).send(Response("500", {}, err.message));
    }
  }
};

const putReservations = async (req,res,next) => {
  const { id } = req.params;
  const { scheduleId, dateTime } = req.body;
  if (!id) {
    res.status(404).send(Response("404", {}, "missing params"));
  } else {
    try {
      await reservationService.putReservation(id, scheduleId, dateTime);
      res
        .status(200)
        .send(Response("200", {}, "reservations edited successfully.."));
    } catch (err) {
      res.status(500).send(Response("500", {}, err.message));
    }
  }
 }

const doneReservation = async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    res.status(404).send(Response("404", {}, "missing params"));
  } else {
    try {
      await reservationService.makeDoneReservation(id);
      res
        .status(200)
        .send(Response("200", {}, "Added to Done Reservations successfully.."));
    } catch (err) {
      res.status(500).send(Response("500", {}, err.message));
    }
  }
};

const doneReservationByDate = async (req, res, next) => {
  const { id } = req.params;
  const { dateTime } = req.body;
  if (!id) {
    res.status(404).send(Response("404", {}, "missing params"));
  } else {
    try {
      await reservationService.makeDoneReservationbyDate(id ,dateTime);
      res
        .status(200)
        .send(Response("200", {}, "Added to Done Reservations successfully.."));
    } catch (err) {
      res.status(500).send(Response("500", {}, err.message));
    }
  }
};

const cancelledReservation = async (req, res, next) => {
  const { id } = req.params;
  if (!id ) {
    res.status(404).send(Response("404", {}, "missing params or data"));
  } else {
    try {
      await reservationService.makeCancelledReservation(id);
      res
        .status(200)
        .send(
          Response("200", {}, "Added to cancelled Reservations successfully..")
        );
    } catch (err) {
      res.status(500).send(Response("500", {}, err.message));
    }
  }
};

const cancelledReservationByDate = async (req, res, next) => {
  const { id } = req.params;
  const { dateTime } = req.body;
  if (!id || !dateTime) {
    res.status(404).send(Response("404", {}, "missing params or data"));
  } else {
    try {
      await reservationService.makeCancelledReservation(id,dateTime);
      res
        .status(200)
        .send(
          Response("200", {}, "Added to cancelled Reservations successfully..")
        );
    } catch (err) {
      res.status(500).send(Response("500", {}, err.message));
    }
  }
};

const deleteReservationsAll = async (req, res, next) => {
  try {
    await reservationService.deleteAllReservations();
    res
      .status(200)
      .send(Response("200", {}, "reservations deleted successfully.."));
  } catch (err) {
    res.status(500).send(Response("500", {}, err.message));
  }
};

//get all reservations
const getReservations = async (req, res, next) => {
  try {
    const result = await reservationService.getReservations();
    res.status(200).send(Response("200", result, ""));
  } catch (err) {
    res.status(500).send(Response("500", {}, err.message));
  }
};
module.exports = {
  postReservation,
  putReservations,
  deleteReservations,
  getReservations,
  deleteReservationsAll,
  doneReservation,
  doneReservationByDate,
  cancelledReservation,
  cancelledReservationByDate,
};
