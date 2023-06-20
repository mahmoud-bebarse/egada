const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  fileName: { type: String, required: true, trim: true },
  status: { type: Boolean, default: true },
  entryDate: { type: Date, default: Date.now },
});

const Image = mongoose.model("image", imageSchema);

module.exports = Image;
