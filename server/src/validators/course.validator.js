const {z} = require("zod");

const courseSchema = z.object({
  title: z.string().min(1, "Title is required !"),
  description: z.string().min(1, "Description is required !"),
  category: z
    .enum(["Tech", "Culture", "First Aid", "Other"], {
      message: "Catégorie invalide",
    })
    .optional(),
  imageUrl: z.string().optional(),
});

const courseUpdateSchema = courseSchema.partial();

const assignStudentSchema = z.object({
  studentIds: z
    .array(z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid student id !"))
    .min(1, "At least one student id is required"),
});

module.exports = {courseSchema, courseUpdateSchema, assignStudentSchema};
