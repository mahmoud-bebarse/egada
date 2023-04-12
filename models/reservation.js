const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
  time: {type: mongoose.Schema.Types.ObjectId},

  status: { type: Boolean, default: true },
  entryDate: { type: Date, default: Date.now },
});
const Reservation = mongoose.model("reservation", reservationSchema);
module.exports = Reservation;
