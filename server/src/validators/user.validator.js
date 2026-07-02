const { z } = require("zod");


// import
const userSchema = z.object({
  firstname: z.string().min(3, "Firstname is required"),
  lastname: z.string().min(3, "Lastname is required"),
  email: z.string().email("Invalid email"),
  password: z.string().optional(),
  role: z.enum(["admin", "student", "teacher"]).optional(),
});


// edit form
const updateUserSchema = z.object({
  firstname: z.string().min(3, "Firstname is required"),
  lastname: z.string().min(3, "Lastname is required"),
  email: z.string().email("Invalid email"),
});

module.exports = { userSchema, updateUserSchema };