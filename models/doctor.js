const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  mobile: { type: String, required: true, trim: true },
  address: { type: String, required: true, trim: true },
  desc: { type: String, required: true, trim: true },
  fee: { type: Number, required: true, default: 0 },
  isVerified: { type: Boolean, default: false },
  dept: { type: mongoose.Schema.Types.ObjectId, ref: "dept", required: true },
  schedules: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "schedule",
    required: false,
  },
  generalRate: { type: Number, required: false, default: 0 },
  rating: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "rating",
    required: false,
  },
  inFavorites: { type: Boolean, default: false },
  governorate: { type: String, required: true, trim: true },
  profileImg: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "image",
    required: false,
  },
  token: { type: String, required: false, trim: true },
  otpId: { type: String, trim: true },
  status: { type: Boolean, default: true },
  entryDate: { type: Date, default: Date.now },
});
const Doctor = mongoose.model("doctor", doctorSchema);
module.exports = Doctor;
