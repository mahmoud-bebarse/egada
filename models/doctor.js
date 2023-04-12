const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  mobile: { type: String, required: true, trim: true },
  isVerified: { type: Boolean, default: false },
  dept: { type: mongoose.Schema.Types.ObjectId, ref: "Dept" },
  dates: { type: [mongoose.Schema.Types.ObjectId], ref: "DoctorDate" },

  status: { type: Boolean, default: true },
  entryDate: { type: Date, default: Date.now },
});
const Doctor = mongoose.model("doctor", doctorSchema);
module.exports = Doctor;
