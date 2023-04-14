const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
  from: { type: Number, required: true, default: 0 },
  to: { type: Number, required: true, default: 0 },
  date: { type: Date, required: true, default: Date.now },

  status: { type: Boolean, default: true },
  entryDate: { type: Date, default: Date.now },
});
const Schedule = mongoose.model("schedule", scheduleSchema);
module.exports = Schedule;
