const express = require("express");
const router = express.Router();
const { getStudentResults, createAttempt, getAttemptsByCourse, getStudentAttemptsByCourse } = require("../controllers/attempt.controller");
const { protect, isAdmin } = require("../middleware/auth.middleware");

router.post("/", protect, createAttempt);
router.get("/course/:courseId", protect, getAttemptsByCourse);
router.get("/student/:studentId/course/:courseId", protect, isAdmin, getStudentAttemptsByCourse);
router.get("/:id/results", protect, getStudentResults);

module.exports = router;