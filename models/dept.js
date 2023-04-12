const mongoose = require("mongoose");

const deptSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  desc: {type: String, required: false, default: ''},
  
  status: { type: Boolean, default: true },
  entryDate: { type: Date, default: Date.now },
});
const Dept = mongoose.model("dept", deptSchema);
module.exports = Dept;
