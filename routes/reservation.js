const express = require("express");
const reservationController = require("../controllers/reservationController");
const { authorize } = require("../middlewares/authorize.js");
const { verifyToken } = require("../middlewares/auth.js");

const router = express.Router();

router.post("/", reservationController.postReservation);
module.exports = router; 