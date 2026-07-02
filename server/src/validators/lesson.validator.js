const {z} = require("zod");

const lessonSchema = z.object({
  title: z.string().min(1, "Title is required!"),
  htmlContent: z.string().min(1, "The content is required"),
  courseId: z.string().regex(/^[0-9a-fA-F]{24}$/, "ID Course is required !"),
  availableFrom: z.string().optional(),
  order: z.number().optional(),
});

const lessonUpdateSchema = lessonSchema.partial();

module.exports = {lessonSchema, lessonUpdateSchema};
