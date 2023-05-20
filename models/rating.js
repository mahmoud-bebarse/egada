const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "patient",
    required: true,
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "doctor",
    required: true,
  },
  rate: { type: Number, required: false, default: 1 },
  comment: { type: String, required: false, default: "" },
  entryDate: { type: Date, default: Date.now },
});
const rating = mongoose.model("rating", ratingSchema);
module.exports = rating;
