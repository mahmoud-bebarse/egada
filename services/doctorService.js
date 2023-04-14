const _Doctor = require("../models/doctor.js");

const getDoctors = async () => {
  const doctors = await _Doctor.find({ status: true }).populate("dept");
  return doctors;
};

const postDoctor = async (name, mobile, dept, schedules) => {
  const doctor = new _Doctor({
    name,
    mobile,
    dept,
    schedules,
  });

  const res = await doctor.save();
  return res;
};

const getDoctorsByDept = async (deptId) => {
  const doctors = await _Doctor.find({
    $and: [{ status: true }, { dept: deptId }],
  });

  return doctors;
};

module.exports = {
  getDoctors,
  postDoctor,
};
