const express = require("express");
const reservationController = require("../controllers/reservationController");


const router = express.Router();

router.post("/", reservationController.postReservation);
router.delete("/delete/:id", reservationController.deleteReservations);
router.get("/", reservationController.getReservations);
router.delete("/deleteAll", reservationController.deleteReservationsAll);
router.put("/doneReservations/:id", reservationController.doneReservation);
module.exports = router; 