const _Doctor = require("../models/doctor.js");
const _Schedules = require("../models/schedule.js");

const getDoctors = async () => {
  const doctors = await _Doctor
    .find({ status: true })
    .populate("dept")
    .populate("schedules");
  return doctors;
};

const getDoctorById = async (id) => {
  const doctor = await _Doctor.findOne({
    $and: [{ id: id }, { status: true }],
  });

  return doctor;
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

const addDoctorsSchedules = async (doctorId, schedules) => {
  const result = await _Schedules.insertMany(schedules);
  const schedulesIds = result.map((a) => a._id);

  const doctor = await _Doctor.findByIdAndUpdate(doctorId, {
    schedules: schedulesIds,
  });

  return doctor;
};

module.exports = {
  getDoctors,
  getDoctorById,
  postDoctor,
  getDoctorsByDept,
  addDoctorsSchedules,
};
