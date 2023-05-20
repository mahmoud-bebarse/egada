const _Reservation = require("../models/reservation.js");
const { Response } = require("../models/response.js");
const reservationService = require("../services/reservationService.js");
const patientService = require("../services/patientService.js");
const doctorService = require("../services/doctorService.js");
const { trusted } = require("mongoose");

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
      res.status(500).send(Response(false, {}, err.message));
    }
  }
  if (!doctorId || !scheduleId || !dateTime) {
    res.status(200).send(Response(false, {}, "Missing data"));
  } else {
    try {
      const reservation = await reservationService.postReservation(
        patientId || newPatientId,
        doctorId,
        scheduleId,
        dateTime
      );

      //send response
      res.status(200).send(Response(true, reservation, ""));
    } catch (err) {
      res.status(500).send(Response(false, {}, err.message));
    }
  }
};

// delete reservations by doctor id
const deleteReservations = async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    res.status(200).send(Response(false, {}, "Missing params"));
  } else {
    try {
      await reservationService.deleteReservationByDoctorId(id);
      res
        .status(200)
        .send(Response(true, {}, "Reservations deleted successfully.."));
    } catch (err) {
      res.status(500).send(Response(false, {}, err.message));
    }
  }
};

const putReservations = async (req, res, next) => {
  const { id } = req.params;
  const { scheduleId, dateTime } = req.body;
  if (!id) {
    res.status(200).send(Response(false, {}, "Missing params"));
  } else {
    try {
      await reservationService.putReservation(id, scheduleId, dateTime);
      res
        .status(200)
        .send(Response(true, {}, "Reservation edited successfully.."));
    } catch (err) {
      res.status(500).send(Response(false, {}, err.message));
    }
  }
};

const doneReservation = async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    res.status(200).send(Response(false, {}, "Missing params"));
  } else {
    try {
      const result = await reservationService.makeDoneReservation(id);
      if (!result) {
        res
          .status(200)
          .send(Response(false, {}, "There is no reservation with this id"));
      } else {
        res
          .status(200)
          .send(
            Response(true, {}, "Added to Done Reservations successfully..")
          );
      }
    } catch (err) {
      res.status(500).send(Response(false, {}, err.message));
    }
  }
};

const doneReservationByDate = async (req, res, next) => {
  const { id } = req.params;
  const { dateTime } = req.body;
  if (!id) {
    res.status(200).send(Response(false, {}, "missing params"));
  } else {
    try {
      const result = await reservationService.makeDoneReservationbyDate(
        id,
        dateTime
      );
      if (!result) {
        res
          .status(200)
          .send(Response(false, {}, "there is no reservation in this date"));
      } else {
        res
          .status(200)
          .send(
            Response(true, {}, "Added to Done Reservations successfully..")
          );
      }
    } catch (err) {
      res.status(500).send(Response(false, {}, err.message));
    }
  }
};

const cancelledReservation = async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    res.status(200).send(Response(false, {}, "Missing data"));
  } else {
    try {
      const result = await reservationService.makeCancelledReservation(id);
      if (!result) {
        res
          .status(200)
          .send(Response(false, {}, "There is no reservation with this id"));
      } else {
        res
          .status(200)
          .send(
            Response(true, {}, "Added to cancelled reservations successfully..")
          );
      }
    } catch (err) {
      res.status(500).send(Response(false, {}, err.message));
    }
  }
};

const cancelledReservationByDate = async (req, res, next) => {
  const { id } = req.params;
  const { dateTime } = req.body;
  if (!id || !dateTime) {
    res.status(200).send(Response(false, {}, "Missing data"));
  } else {
    try {
      const result = await reservationService.makeCancelledReservation(
        id,
        dateTime
      );
      if (!result) {
        res
          .status(200)
          .send(Response(false, {}, "There is no reservation in this date"));
      } else {
        res
          .status(200)
          .send(
            Response(true, {}, "Added to cancelled Reservations successfully..")
          );
      }
    } catch (err) {
      res.status(500).send(Response(false, {}, err.message));
    }
  }
};

const deleteReservationsAll = async (req, res, next) => {
  try {
    await reservationService.deleteAllReservations();
    res
      .status(200)
      .send(Response(true, {}, "All reservations deleted successfully.."));
  } catch (err) {
    res.status(500).send(Response(false, {}, err.message));
  }
};

//get all reservations
const getReservations = async (req, res, next) => {
  try {
    const result = await reservationService.getReservations();
    if (!result) {
      res.status(200).send(Response(false, {}, "There is no reservation"));
    } else {
      res.status(200).send(Response(true, result, ""));
    }
  } catch (err) {
    res.status(500).send(Response(false, {}, err.message));
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
