const _Doctor = require("../models/doctor.js");
const _Schedules = require("../models/schedule.js");
const _Rating = require("../models/rating.js");
const { generateOtp } = require("../services/mobileAuthService.js");

const getDoctors = async () => {
  const doctors = await _Doctor
    .find({ status: true })
    .populate("dept")
    .populate("schedules")
    .populate({
      path: "rating",
      populate: { path: "patient", select: { name: 1, _id: 0 } },
    });
  return doctors;
};

const deleteAllDoctors = async () => {
  const doctor = await _Doctor.find().deleteMany();
  return doctor;
};
const deleteAllSchedules = async () => {
  const schedule = await _Schedules.find().deleteMany();
  return schedule;
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
    });

  return doctor;
};

const postDoctor = async (name, mobile, dept, address, fee, desc, govern) => {
  const doctor = new _Doctor({
    name,
    mobile,
    dept,
    address,
    fee,
    desc,
    governorate: govern,
  });

  await doctor.save();

  const result = await generateOtp(mobile);

  doctor.otpId = result.data.otp_id;
  await doctor.save();

  return doctor;
};

const deleteDoctor = async (id) => {
  const res = await _Doctor.findByIdAndDelete(id);

  return res;
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
      populate: ({ path: "patient", select: { name: 1, _id: 0 } }),
    });

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

const getDoctorByMobile = async (mobile) => {
  const doctor = await _Doctor.findOne({
    $and: [{ mobile: mobile }, { status: true }],
  });

  return doctor;
};

const getSchedulesByDoctorId = async (id) => {
  const schedules = await _Schedules.find({ doctor: id });

  return schedules;
};

const deleteSchedules = async (id) => {
  const schedule = await _Schedules.find({ doctor: id }).deleteMany();
  return schedule;
};
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
  deleteDoctor,
  getDoctorsByDept,
  getDoctorByGovern,
  addDoctorsSchedules,
  getSchedulesByDoctorId,
  getDoctorByMobile,
  deleteSchedules,
  deleteAllSchedules,
  getRatings,
  updateAvgRatingByDoctorId,
};
