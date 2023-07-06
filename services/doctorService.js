const _Doctor = require("../models/doctor.js");
const _Schedules = require("../models/schedule.js");
const _Rating = require("../models/rating.js");
const { generateOtp } = require("../services/mobileAuthService.js");

const postDoctor = async (
  name,
  mobile,
  dept,
  address,
  fee,
  desc,
  govern,
  imgId,
  token
) => {
  
    const doctor = new _Doctor({
      name,
      mobile,
      dept,
      address,
      fee,
      desc,
      governorate: govern,
      profileImg: imgId,
      token
    })
    await doctor.save();
    const result = await generateOtp(mobile);

    doctor.otpId = result.data.otp_id;
    await doctor.save();

    return doctor;
  
};

const putDoctor = async (
  id,
  name,
  mobile,
  dept,
  address,
  fee,
  desc,
  govern,
  imgId,
  token
) => {
  const doctor = await _Doctor.findByIdAndUpdate(id, {
    name,
    mobile,
    dept,
    address,
    fee,
    desc,
    governorate: govern,
    profileImg: imgId,
    token
  });

  await doctor.save();
  return doctor;
};

const getDoctors = async () => {
  const doctors = await _Doctor
    .find({ status: true })
    .populate("dept")
    .populate("schedules")
    .populate({
      path: "rating",
      populate: { path: "patient", select: { name: 1, _id: 0 } },
    })
    .populate("profileImg");
  return doctors;
};

const getDoctorById = async (id) => {
  const doctor = await _Doctor
    .findOne({
      $and: [{ _id: id }, { status: true }],
    })
    .populate("dept")
    .populate("schedules")
    .populate({
      path: "rating",
      populate: { path: "patient", select: { name: 1, _id: 0 } },
    })
    .populate("profileImg");

  return doctor;
};

const deleteAllDoctors = async () => {
  const doctor = await _Doctor.find().deleteMany();
  return doctor;
};

const getDoctorsByDept = async (deptId) => {
  const doctors = await _Doctor
    .find({
      $and: [{ status: true }, { dept: deptId }],
    })
    .populate({ path: "dept", select: { name: 1, _id: 0 } })
    .populate("schedules")
    .populate({
      path: "rating",
      populate: { path: "patient", select: { name: 1, _id: 0 } },
    })
    .populate("profileImg");

  return doctors;
};

const getDoctorByGovern = async (govern) => {
  const doctors = await _Doctor
    .find({
      $and: [{ status: true }, { governorate: govern }],
    })
    .populate({ path: "dept", select: { name: 1, _id: 0 } })
    .populate("schedules")
    .populate({
      path: "rating",
      populate: { path: "patient", select: { name: 1, _id: 0 } },
    });

  return doctors;
};

const getDoctorByMobile = async (mobile) => {
  const doctor = await _Doctor.findOne({
    $and: [{ mobile: mobile }, { status: true }],
  });

  return doctor;
};

const deleteDoctor = async (id) => {
  const res = await _Doctor.findByIdAndDelete(id);

  return res;
};

const addDoctorsSchedules = async (
  doctor,
  fromHr,
  fromMin,
  toHr,
  toMin,
  day
) => {
  const schedule = new _Schedules({
    doctor: doctor,
    fromHr: fromHr,
    fromMin: fromMin,
    toHr: toHr,
    toMin: toMin,
    day: day,
  });
  await schedule.save();
  return schedule;
};

const getSchedulesByDoctorId = async (id) => {
  const schedules = await _Schedules.find({ doctor: id });

  return schedules;
};

const deleteAllSchedules = async () => {
  const schedule = await _Schedules.find().deleteMany();
  return schedule;
};


const deleteSchedules = async (id) => {
  const schedule = await _Schedules.find({ doctor: id }).deleteMany();
  return schedule;
};

const deleteSchedule = async (id) => {
  const schedule = await _Schedules.findByIdAndDelete(id);

  return schedule ;
}
const getRatings = async (id) => {
  const rating = await _Rating
    .find({ doctor: id })
    .populate({ path: "patient", select: { name: 1, _id: 0 } })
    .populate({ path: "doctor", select: { name: 1, _id: 0 } });
  return rating;
};

const updateAvgRatingByDoctorId = async (id, rating) => {
  const rate = await _Doctor.findByIdAndUpdate(id, { generalRate: rating });
  return rate;
};
module.exports = {
  getDoctors,
  deleteAllDoctors,
  getDoctorById,
  postDoctor,
  putDoctor,
  deleteDoctor,
  getDoctorsByDept,
  getDoctorByGovern,
  addDoctorsSchedules,
  getSchedulesByDoctorId,
  getDoctorByMobile,
  deleteSchedules,
  deleteSchedule,
  deleteAllSchedules,
  getRatings,
  updateAvgRatingByDoctorId,
};
