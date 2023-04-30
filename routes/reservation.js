const express = require("express");
const reservationController = require("../controllers/reservationController");
const { authorize } = require("../middlewares/authorize.js");
const { verifyToken } = require("../middlewares/auth.js");

const router = express.Router();

router.post("/", reservationController.postReservation);
router.delete("/:id", reservationController.deleteReservations);
router.get("/", reservationController.getReservations);
module.exports = router; 