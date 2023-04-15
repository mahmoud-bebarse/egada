const _Dept = require("../models/dept.js");
const { Response } = require("../models/response.js");
const lookupService = require("../services/lookupService.js");

// get doctors
const getDepts = async (req, res, next) => {
  const depts = await lookupService.getDepts();
  res.status(200).send(Response("200", depts, {}));
};

// post doctor
const postDepts = async (req, res, next) => {
  const { name, desc } = req.body;
  // validation
  if (!name && !desc) {
    res
      .status(404)
      .send(Response("404", {}, { message: "some missing fields" }));
  }

  // post
  const result = await lookupService.postDepts(name, desc);
  res.status(200).send(Response("200", result, {}));
};

// delete
const deleteDept = async (req, res, next) => {
  const { id } = req.body;

  const result = lookupService.deleteDept(id);
  res.status(200).send(Response("200", result, {}));
};

module.exports = {
  getDepts,
  postDepts,
  deleteDept,
};
