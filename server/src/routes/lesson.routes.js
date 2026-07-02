const express = require("express");
const router = express.Router();
const {
  createLesson,
  getLesson,
  getCoursLessons,
  updateLesson,
  deleteLesson,
} = require("../controllers/lesson.controller");
const {protect, isAdmin} = require("../middleware/auth.middleware"); //Middleware

// zod validation
const validate = require("../middleware/validate.middleware");
const {
  lessonSchema,
  lessonUpdateSchema,
} = require("../validators/lesson.validator");

router.post("/", protect, isAdmin, validate(lessonSchema), createLesson);
router.get("/course/:courseId", protect, getCoursLessons);
router.get("/:id", protect, getLesson);
router.patch(
  "/:id",
  protect,
  isAdmin,
  validate(lessonUpdateSchema),
  updateLesson,
);
router.delete("/:id", protect, isAdmin, deleteLesson);

module.exports = router;
