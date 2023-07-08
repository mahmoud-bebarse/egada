const _Question = require("../models/question");
const _Answer = require("../models/answer");

const postQuestion = async (patientId, deptId, age, gender, title, desc) => {
  const Q = new _Question({
    patientId,
    deptId,
    age,
    gender,
    title,
    desc,
  });
  await Q.save();
  return Q;
};

const putQuestion = async (id, deptId, age, gender, title, desc) => {
  const Q = await _Question.findByIdAndUpdate(id, {
    deptId,
    age,
    gender,
    title,
    desc,
  });
  return Q;
};

const getQuestion = async (id) => {
  const question = await _Question
    .findById(id)
    .populate({
      path: "answer",
      populate: {
        path: "doctorId",
        select: { name: 1, _id: 1, profileImg: 0 },
      },
    })
    .populate({
      path: "deptId",
      select: { name: 1 },
    });

  return question;
};

const getAllQuestions = async () => {
  const question = await _Question
    .find()
    .populate({
      path: "answer",
      populate: {
        path: "doctorId",
        select: { name: 1, _id: 1, profileImg: 0 },
      },
    })
    .populate({
      path: "deptId",
      select: { name: 1 },
    });
  return question;
};

const getQuestionsByDeptId = async (id) => {
  const question = await _Question
    .find({ deptId: id })
    .populate({
      path: "answer",
      populate: {
        path: "doctorId",
        select: { name: 1, _id: 1, profileImg: 0 },
      },
    })
    .populate({
      path: "deptId",
      select: { name: 1 },
    });
  return question;
};

const getQuestionsByPatientId = async (id) => {
  const question = await _Question
    .find({ patientId: id })
    .populate({
      path: "answer",
      populate: {
        path: "doctorId",
        select: { name: 1, _id: 1, profileImg: 0 },
      },
    })
    .populate({
      path: "deptId",
      select: { name: 1 },
    });
  return question;
};

const deleteQuestion = async (id) => {
  const Q = await _Question.findById(id);
  Q.answer.forEach(async (item) => {
    const ans = await _Answer.findByIdAndDelete(item);
    return ans;
  });
  Q.deleteOne();
  return Q;
};

const postAnswer = async (doctorId, ans, questionId) => {
  const A = new _Answer({
    doctorId,
    answer: ans,
  });
  await A.save();
  const question = await _Question.findOne({ _id: questionId });
  question.answer.push(A._id);
  await question.save();
  return A;
};

const putAnswer = async (id, answer) => {
  const A = await _Answer.findByIdAndUpdate(id, { answer });
  return A;
};

const getAllAnswers = async () => {
  const answer = await _Answer.find().populate({
    path: "doctorId",
    select: { name: 1, _id: 1, profileImg: 0 },
  });
  return answer;
};

const deleteAnswer = async (id) => {
  const ans = await _Answer.findByIdAndDelete(id);
  return ans;
};

module.exports = {
  postQuestion,
  getQuestion,
  getAllQuestions,
  getAllAnswers,
  putQuestion,
  deleteQuestion,
  postAnswer,
  putAnswer,
  deleteAnswer,
  getQuestionsByDeptId,
  getQuestionsByPatientId,
};
