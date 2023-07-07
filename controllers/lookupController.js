const _Dept = require("../models/dept.js");
const { Response } = require("../models/response.js");
const lookupService = require("../services/lookupService.js");

// get depts
const getDepts = async (req, res, next) => {
  const depts = await lookupService.getDepts();
  if (!depts) {
    res.status(200).send(Response(false, {}, "There is no departments"));
  } else {
    res.status(200).send(Response(true, depts, ""));
  }
};

// post dept
const postDepts = async (req, res, next) => {
  const { name, desc, imgId } = req.body;
  // validation
  if (!name && !desc) {
    res.status(200).send(Response(false, {}, "Missing data"));
  } else {
    try {
      // post
      const result = await lookupService.postDepts(name, desc, imgId);
      res.status(200).send(Response(true, result, ""));
    } catch (err) {
      res.status(500).send(Response(false, {}, err.message));
    }
  }
};

const putDepts = async (req, res, next) => {
  const { id } = req.params;
  const { name, desc, imgId } = req.body;
  if (!name || !desc || !id) {
    res.status(200).send(Response(false, {}, "Missing data"));
  } else {
    try {
      const dept = lookupService.putDepts(id, name, desc, imgId);
      res
        .status(200)
        .send(Response(true, {}, "dept has been updated successfully"));
    } catch (err) {
      res.status(500).send(Response(false, {}, err.message));
    }
  }
};
// delete dept
const deleteDept = async (req, res, next) => {
  const { id } = req.body;

  const result = lookupService.deleteDept(id);
  res.status(200).send(Response(true, {}, "Department deleted successfully"));
};

const deleteAll = async (req, res, next) => {
  const result = await lookupService.deleteAll();
  res.status(200).send(Response(true, {}, "All departments deleted successfully"));
}
module.exports = {
  getDepts,
  postDepts,
  putDepts,
  deleteDept,
  deleteAll
};
