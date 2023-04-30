const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "patient" },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: "doctor" , required :true},
  schedule: { type: mongoose.Schema.Types.ObjectId, ref: "schedule" ,required:true },

  status: { type: Boolean, default: true },
  entryDate: { type: Date, default: Date.now },
});
const Reservation = mongoose.model("reservation", reservationSchema);
module.exports = Reservation;
