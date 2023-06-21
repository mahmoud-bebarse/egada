const question = require("../models/question.js");
const { Response } = require("../models/response.js");
const questionAnswerService = require("../services/questionAnswerService.js");

const postQuestion = async (req, res, next) => {
  const { patientId, deptId, age, gender, title, desc } = req.body;
  if (!patientId || !deptId || !age || !gender || !title || !desc) {
    res.status(200).send(Response(false, {}, "Missing data"));
  } else {
    try {
      const quest = await questionAnswerService.postQuestion(
        patientId,
        deptId,
        age,
        gender,
        title,
        desc
      );
      res
        .status(200)
        .send(
          Response(true, quest, "Your question have been added successfully")
        );
    } catch (err) {
      res.status(500).send(Response(false, {}, err.message));
    }
  }
};

const putQuestion = async (req, res, next) => {
  const { deptId, age, gender, title, desc } = req.body;
  const { id } = req.params;
  if (!id || !question) {
    res.status(200).send(Response(false, {}, "Missing data"));
  } else {
    try {
      const Q = await questionAnswerService.putQuestion(
        id,
        deptId,
        age,
        gender,
        title,
        desc
      );
      res
        .status(200)
        .send(Response(true, {}, "Question have been updated successfully"));
    } catch (err) {
      res.status(500).send(Response(false, {}, err.message));
    }
  }
};

const getAllQuestions = async (req, res, next) => {
  try {
    const question = await questionAnswerService.getAllQuestions();
    res.status(200).send(Response(true, question, ""));
  } catch (err) {
    res.status(500).send(Response(false, {}, err.message));
  }
};

const getQuestion = async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    res.status(200).send(Response(false, {}, "Missing params"));
  } else {
    try {
      const question = await questionAnswerService.getQuestion(id);
      res.status(200).send(Response(true, question, ""));
    } catch (err) {
      res.status(500).send(Response(false, {}, err.message));
    }
  }
};
const getQuestionByPatientId = async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    res.status(200).send(Response(false, {}, "Missing params"));
  } else {
    try {
      const question = await questionAnswerService.getQuestionsByPatientId(id);
      res.status(200).send(Response(true, question, ""));
    } catch (err) {
      res.status(500).send(Response(false, {}, err.message));
    }
  }
};
const getQuestionByDeptId = async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    res.status(200).send(Response(false, {}, "Missing params"));
  } else {
    try {
      const question = await questionAnswerService.getQuestionsByDeptId(id);
      res.status(200).send(Response(true, question, ""));
    } catch (err) {
      res.status(500).send(Response(false, {}, err.message));
    }
  }
};

const deleteQuestion = async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    res.status(200).send(Response(false, {}, "Missing params"));
  } else {
    try {
      await questionAnswerService.deleteQuestion(id);
      res
        .status(200)
        .send(Response(true, {}, "Question have been deleted seccessfully"));
    } catch (err) {
      res.status(500).send(Response(false, {}, err.message));
    }
  }
};

const postAnswer = async (req, res, next) => {
  const { doctorId, ans, questionId } = req.body;
  if (!doctorId || !ans || !questionId) {
    res.status(200).send(Response(false, {}, "Missing data"));
  } else {
    try {
      const answer = await questionAnswerService.postAnswer(
        doctorId,
        ans,
        questionId
      );
      res
        .status(200)
        .send(Response(true, answer, "answer have been added successfully"));
    } catch (err) {
      res.status(500).send(Response(false, {}, err.message));
    }
  }
};

const putAnswer = async (req, res, next) => {
  const { answer } = req.body;
  const { id } = req.params;
  if (!id || !answer) {
    res.status(200).send(Response(false, {}, "Missing data"));
  } else {
    try {
      const ans = await questionAnswerService.putAnswer(id, answer);
      res
        .status(200)
        .send(Response(true, {}, "Answer have been updated successfully"));
    } catch (err) {
      res.status(500).send(Response(false, {}, err.message));
    }
  }
};

const getAllAnswers = async (req, res, next) => {
  try {
    const answer = await questionAnswerService.getAllAnswers();
    res.status(200).send(Response(true, answer, ""));
  } catch (err) {
    res.status(500).send(Response(false, {}, err.message));
  }
};

const deleteAnswer = async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    res.status(200).send(Response(false, {}, "Missing params"));
  } else {
    try {
      await questionAnswerService.deleteAnswer(id);
      res
        .status(200)
        .send(Response(true, {}, "Answer have been deleted seccessfully"));
    } catch (err) {
      res.status(500).send(Response(false, {}, err.message));
    }
  }
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
  getQuestionByDeptId,
  getQuestionByPatientId,
};
