const {z} = require("zod");

const questionSchema = z.object({
  question: z.string().min(1, "question text is required !"),
  options: z.array(z.string().min(1)).min(2, "at least 2 options are required"),
  correctAnswers: z
    .array(z.string().min(1))
    .min(1, "at least one correct answer is required !"),
});

const quizSchema = z.object({
  title: z.string().min(1, "Title is required !"),
  courseId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Course ID is required !"),
  lessonId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Lesson ID is required !")
    .nullable()
    .optional(),
  passingScore: z.coerce
    .number()
    .min(0, "passing score must be at least 0")
    .max(100, "passing score cannot exceed 100"),
  questions: z
    .array(questionSchema)
    .min(1, "at least one question is required"),
});

const quizUpdateSchema = quizSchema.partial();

module.exports = {quizSchema, quizUpdateSchema};
