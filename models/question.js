const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "patient",
    required: true,
  },
  question: { type: String, required: true, trim: true },
  answer: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "answer",
    required: false,
  },
  status: { type: Boolean, default: true },
  entryDate: { type: Date, default: Date.now },
});

const Question = mongoose.model("question", questionSchema);

module.exports = Question ;
