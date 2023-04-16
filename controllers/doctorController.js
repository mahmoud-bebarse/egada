const _Doctor = require("../models/doctor.js");
const { Response } = require("../models/response.js");
const doctorService = require("../services/doctorService.js");

// get doctors
const getDoctors = async (req, res, next) => {
  const doctors = await doctorService.getDoctors();
  res.status(200).send(Response("200", doctors, {}));
};

// get doctor by id
const getDoctorById = async (req, res, next) => {
  const { id } = req.body;
  if (!id) {
    res.status(404).send(Response("404", {}, { message: "missing params" }));
  }

  try {
    const doctor = await doctorService.getDoctorById(id);
    res.status(200).send(Response("200", doctor, {}));
  } catch (err) {
    res.status(500).send(Response("500", {}, { message: err.message }));
  }
};

// post doctor
const postDoctor = async (req, res, next) => {
  const { name, mobile, dept, schedules } = req.body;
  // validation
  if (!name && !mobile && !dept && !schedules) {
    res
      .status(404)
      .send(Response("404", {}, { message: "some missing fields" }));
  }

  // post
  const result = await doctorService.postDoctor(name, mobile, dept, schedules);
  res.status(200).send(Response("200", result, {}));
};

// put doctor schedules
const putDoctorSchedules = async (req, res, next) => {
  const { id } = req.params;
  const { schedules } = req.body;

  try {
    const doctor = await doctorService.addDoctorsSchedules(id, schedules);
    res.status(200).send(Response("200", doctor, {}));
  } catch {
    res.status(500).send(Response("500", {}, { message: err.message }));
  }
};

module.exports = {
  getDoctors,
  postDoctor,
  putDoctorSchedules,
  getDoctorById,
};
