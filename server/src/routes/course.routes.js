const express = require("express");
const router = express.Router();
const {
  createCourse,
  getAllCourses,
  getCours,
  editCours,
  deleteCours,
  assignStudent,
  getStudentCourses,
} = require("../controllers/course.controller");
const {getCoursLessons} = require("../controllers/lesson.controller");
const {protect, isAdmin} = require("../middleware/auth.middleware"); //Middleware

// zod validation
const validate = require("../middleware/validate.middleware");
const {
  courseSchema,
  courseUpdateSchema,
  assignStudentSchema,
} = require("../validators/course.validator");

router.get("/my-courses", protect, getStudentCourses);
router.get("/:id/lessons", protect, getCoursLessons);
router.post("/", protect, isAdmin, validate(courseSchema), createCourse);
router.get("/", protect, getAllCourses);
router.get("/:id", protect, getCours);
router.patch("/:id", protect, isAdmin, validate(courseUpdateSchema), editCours);
router.delete("/:id", protect, isAdmin, deleteCours);
router.patch(
  "/:id/assign",
  protect,
  isAdmin,
  validate(assignStudentSchema),
  assignStudent,
);

module.exports = router;
