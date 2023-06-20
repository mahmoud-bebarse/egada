const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "doctor",
    required: true,
  },
  answer: { type: String, required: true, trim: true },

  status: { type: Boolean, default: true },
  entryDate: { type: Date, default: Date.now },
});

const Answer = mongoose.model("answer", answerSchema);

module.exports = Answer ;
