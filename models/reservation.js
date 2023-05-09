const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "patient" },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "doctor",
    required: true,
  },
  schedule: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "schedule",
    required: true,
  },
  date: { type: Date, default: Date.now , required: true},
  done: { type: Boolean, default: false },
  cancelled: { type: Boolean, default: false },
  entryDate: { type: Date, default: Date.now },
});
const Reservation = mongoose.model("reservation", reservationSchema);
module.exports = Reservation;
