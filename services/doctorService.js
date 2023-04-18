const _Doctor = require("../models/doctor.js");
const _Schedules = require("../models/schedule.js");
const {generateOtp} = require("../services/mobileAuthService.js");

const getDoctors = async () => {
  const doctors = await _Doctor
    .find({ status: true })
    .populate("dept")
    .populate("schedules");
  return doctors;
};

const getDoctorById = async (id) => {
  const doctor = await _Doctor
    .findOne({
      $and: [{ _id: id }, { status: true }],
    })
    .populate("dept")
    .populate("schedules");

  return doctor;
};

const postDoctor = async (name, mobile, dept, schedules) => {
  const doctor = new _Doctor({
    name,
    mobile,
    dept,
    schedules,
  });

   await doctor.save();

  const result = await generateOtp(mobile)

  doctor.otpId = result.data.otp_id;
  console.log(result.data);
  await doctor.save();

  return doctor;
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
  }).populate("schedules");

  return doctor;
};

const getDoctorByMobile = async (mobile) => {
  const doctor = await _Doctor.findOne({$and:[
    {mobile: mobile},
    {status: true}
  ]})

  return doctor
}

module.exports = {
  getDoctors,
  getDoctorById,
  postDoctor,
  getDoctorsByDept,
  addDoctorsSchedules,
  getDoctorByMobile
};
