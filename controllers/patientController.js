const _Patient = require("../models/patient.js");
const { Response } = require("../models/response.js");
const patientService = require("../services/patientService.js");

// get patients
const getPatients = async (req, res, next) => {
  try {
    const patients = await patientService.getPatients();
    res.status(200).send(Response("200", patients, {}));
  } catch (err) {
    res.status(500).send(Response("500", {}, { message: err.message }));
  }
};

// post patient
const postPatient = async (req, res, next) => {
  const { name, mobile, dob } = req.body;
  // validation
  if (!name && !mobile && !dob) {
    res
      .status(404)
      .send(Response("404", {}, { message: "some missing fields" }));
  }

  // post
  try {
    const result = await patientService.postPatient(name, mobile, dob);
    res.status(200).send(Response("200", result, {}));
  } catch (err) {
    res.status(500).send(Response("500", {}, { message: err.message }));
  }
};

// delete patient
const deletePatient = async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    res
      .status(404)
      .send(Response("404", {}, { message: "some missing fields" }));
  }

  // delete
  try {
    const result = await patientService.deletePatient(id);
    res.status(200).send(Response("200", result, {}));
  } catch (err) {
    res.status(500).send(Response("500", {}, { message: err.message }));
  }
};

module.exports = {
  getPatients,
  postPatient,
  deletePatient,
};
