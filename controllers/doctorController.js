const _Doctor = require("../models/doctor.js");
const { Response } = require("../models/response.js");
const doctorService = require("../services/doctorService.js");

// get doctors
const getDoctors = async (req, res, next) => {
  const doctors = await doctorService.getDoctors();
  res.status(200).send(Response("200", doctors, {}));
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

module.exports = {
  getDoctors,
  postDoctor,
};
