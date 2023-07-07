const _Dept = require("../models/dept.js");

// get depts
const getDepts = async () => {
  const depts = await _Dept.find({ status: true });
  return depts;
};

const postDepts = async (name, desc, imgId) => {
  const dept = new _Dept({
    name,
    desc,
    profileImg: imgId
  });
  const res = await dept.save();
  return res;
};

const putDepts = async (name, desc, imgId, id) => {
  const dept = _Dept.findByIdAndUpdate(id, {
    name,
    desc,
    profileImg: imgId
  })
  await dept.save();
  return dept
};

const deleteDept = async (id) => {
  const res = await _Dept.findByIdAndDelete(id);

  return res;
};

const deleteAll = async () => {
  const res = await _Dept.find().deleteMany();
  return res ;
}
module.exports = {
  getDepts,
  postDepts,
  putDepts,
  deleteDept,
  deleteAll
};
