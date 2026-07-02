const express = require("express");
const router = express.Router();
const multer = require("multer");
const { importQuiz, getQuiz, createQuiz, getQuizByLesson, deleteQuiz, updateQuiz } = require("../controllers/quiz.controller");
const { protect, isAdmin } = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");
const { quizSchema } = require("../validators/quiz.validator");

const upload = multer({ storage: multer.memoryStorage() });

router.post("/import", protect, isAdmin, upload.single("file"), importQuiz);
router.post("/", protect, isAdmin, validate(quizSchema), createQuiz);
router.get("/lesson/:lessonId", protect, getQuizByLesson);
router.get("/:id", protect, getQuiz);
router.delete("/:id", protect, isAdmin, deleteQuiz);
router.put("/:id", protect, isAdmin, updateQuiz);

module.exports = router;