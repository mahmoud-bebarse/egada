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

const deleteAllDoctors = async () => {
  const doctor = await _Doctor.find().deleteMany();
  return doctor;
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

const postDoctor = async (name, mobile, dept,address,fee) => {
  const doctor = new _Doctor({
    name,
    mobile,
    dept,
    address,
    fee
  });

   await doctor.save();

  const result = await generateOtp(mobile)

  doctor.otpId = result.data.otp_id;
  await doctor.save();

  return doctor;
};

const deleteDoctor = async (id) => {
  const res = await _Doctor.findByIdAndDelete(id);

  return res;
};

const getDoctorsByDept = async (deptId) => {
  const doctors = await _Doctor.find({
    $and: [{ status: true }, { dept: deptId }],
  }).populate({path:"dept", select:{name:1 , _id:0}});

  return doctors;
};

const addDoctorsSchedules = async (doctor,fromHr,fromMin,toHr,toMin,day) => {
  const schedule = new _Schedules({
    doctor,
    fromHr,
    fromMin,
    toHr,
    toMin,
    day,
  });
  const res = await schedule.save();
  return res;
};


const getDoctorByMobile = async (mobile) => {
  const doctor = await _Doctor.findOne({$and:[
    {mobile: mobile},
    {status: true}
  ]})

  return doctor ;
}

const getSchedulesByDoctorId = async (id) => {
  const schedules = await _Schedules.find({ doctor: id });
  
  return schedules ;
}

const deleteSchedules = async (id) => {
  const schedule = await _Schedules.find({ doctor: id }).deleteMany();
  return schedule;
}

module.exports = {
  getDoctors,
  deleteAllDoctors,
  getDoctorById,
  postDoctor,
  deleteDoctor,
  getDoctorsByDept,
  addDoctorsSchedules,
  getSchedulesByDoctorId,
  getDoctorByMobile,
  deleteSchedules,
};
