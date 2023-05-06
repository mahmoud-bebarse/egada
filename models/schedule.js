const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "doctor",
  },
  fromHr: { type: Number, required: true, default: 0, min: 0, max: 23 },
  fromMin: { type: Number, required: false, default: 0, min: 0, max: 59 },
  toHr: { type: Number, required: true, default: 0, min: 0, max: 23 },
  toMin: { type: Number,required: false,default: 0, min: 0, max: 59,},
  day: { type: Number, required: true, default: 0, min: 0, max: 7 },
  status: { type: Boolean, default: true },
  entryDate: { type: Date, default: Date.now },
});
const Schedule = mongoose.model("schedule", scheduleSchema);
module.exports = Schedule;
