const _Dept = require("../models/dept.js");
const { Response } = require("../models/response.js");
const lookupService = require("../services/lookupService.js");

// get depts
const getDepts = async (req, res, next) => {
  const depts = await lookupService.getDepts();
  if (!depts) {
    res.status(200).send(Response(false, {}, "There is no departments"));
  } else {
    
    res.status(200).send(Response(true, depts, ''));
  }
};

// post dept
const postDepts = async (req, res, next) => {
  const { name, desc } = req.body;
  // validation
  if (!name && !desc) {
    res
      .status(200)
      .send(Response(false, {}, "Missing data" ));
  }

  // post
  const result = await lookupService.postDepts(name, desc);
  res.status(200).send(Response(true, result, ''));
};

// delete dept
const deleteDept = async (req, res, next) => {
  const { id } = req.body;

  const result = lookupService.deleteDept(id);
  res.status(200).send(Response(true, {}, 'Department deleted successfully'));
};

module.exports = {
  getDepts,
  postDepts,
  deleteDept,
};
