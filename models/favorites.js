const mongoose = require("mongoose");

const favoritesSchema = new mongoose.Schema({
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
  entryDate: { type: Date, default: Date.now },
});
const favorites = mongoose.model("favorites", favoritesSchema);
module.exports = favorites;
