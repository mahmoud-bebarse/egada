const _Dept = require("../models/dept.js");
const { Response } = require("../models/response.js");

// get depts
const getDepts = async () => {
  const depts = await _Dept.find({ status: true });
  return depts;
};

const postDepts = async (name, desc, entryDate) => {
    const dept = new _Dept({
        name,
        desc
    })
    const res = await dept.save();
    return res ; 
}

module.exports = {
    getDepts,
    postDepts
}