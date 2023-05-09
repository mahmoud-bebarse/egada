const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  mobile: { type: String, required: true, trim: true },
  isVerified: { type: Boolean, default: false },
  dob: { type: Date, required: true, default: Date.now },
  
  otpId: { type: String, trim: true },
  status: { type: Boolean, default: true },
  entryDate: { type: Date, default: Date.now },
});
const Patient = mongoose.model("patient", patientSchema);
module.exports = Patient;
