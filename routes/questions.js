const express = require("express");
const questionsController = require("../controllers/questionAndAnswerController");

const router = express.Router();

router.post("/", questionsController.postQuestion);
router.post("/answer", questionsController.postAnswer);
router.put("/:id", questionsController.putQuestion);
router.put("/answer/:id", questionsController.putAnswer);
router.delete("/:id", questionsController.deleteQuestion);
router.delete("/answer/:id", questionsController.deleteAnswer);
router.get("/:id", questionsController.getQuestion);
router.get("/get/all", questionsController.getAllQuestions);
router.get("/answer/get/all", questionsController.getAllAnswers);


module.exports = router;