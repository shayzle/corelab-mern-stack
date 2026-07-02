const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middleware/auth.middleware');
const { getProgress, saveProgress, getStudentProgress } = require("../controllers/progress.controller");

router.get("/:courseId", protect, getProgress);
router.post("/:courseId", protect, saveProgress);
router.get("/student/:studentId", protect, isAdmin, getStudentProgress);


module.exports = router;