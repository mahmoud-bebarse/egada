const express = require("express");
const reservationController = require("../controllers/reservationController");
const { authorize } = require("../middlewares/authorize.js");
const { verifyToken } = require("../middlewares/auth.js");

const router = express.Router();

router.post("/", reservationController.postReservation);
router.delete("/delete/:id", reservationController.deleteReservations);
router.get("/", reservationController.getReservations);
router.delete("/deleteAll", reservationController.deleteReservationsAll);
module.exports = router; 