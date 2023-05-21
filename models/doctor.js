const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  mobile: { type: String, required: true, trim: true },
  address: { type: String, required: true, trim: true },
  desc: { type: String, required: true, trim: true },
  fee: { type: Number, required: true, default: 0 },
  isVerified: { type: Boolean, default: false },
  dept: { type: mongoose.Schema.Types.ObjectId, ref: "dept", required: false },
  schedules: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "schedule",
    required: false,
  },
  rating: { type: Number, required: false, default: 0 },
  governorate: { type: String, required: true, trim: true },
  otpId: { type: String, trim: true },
  status: { type: Boolean, default: true },
  entryDate: { type: Date, default: Date.now },
});
const Doctor = mongoose.model("doctor", doctorSchema);
module.exports = Doctor;
