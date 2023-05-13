const express = require("express");
const reservationController = require("../controllers/reservationController");

const router = express.Router();

router.post("/", reservationController.postReservation);
router.put("/:id", reservationController.putReservations);
router.delete("/delete/:id", reservationController.deleteReservations);
router.get("/", reservationController.getReservations);
router.delete("/deleteAll", reservationController.deleteReservationsAll);
router.put("/doneReservation/:id", reservationController.doneReservation);
router.put("/doneReservations/:id", reservationController.doneReservationByDate);
router.put("/cancelledReservation/:id", reservationController.cancelledReservation);
router.put("/cancelledReservations/:id", reservationController.cancelledReservationByDate);


module.exports = router;
