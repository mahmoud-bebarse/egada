const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "patient",
    required: true,
  },
  deptId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "dept",
    required: true,
  },
  age: { type: Number, required: true },
  gender: { type: String, required: true, trim: true },
  title: { type: String, required: true, trim: true, maxLength: 50 },
  desc: { type: String, required: true, trim: true, maxLength: 250 },
  answer: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "answer",
    required: false,
  },
  status: { type: Boolean, default: true },
  entryDate: { type: Date, default: Date.now },
});

const Question = mongoose.model("question", questionSchema);

module.exports = Question;
