require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const courseRoutes = require("./routes/course.routes");
const lessonRoutes = require("./routes/lesson.routes");
const quizRoutes = require("./routes/quiz.routes");
const attemptRoutes = require("./routes/attempt.routes");
const adminRoutes = require("./routes/admin.routes");
const progressRoutes = require("./routes/progress.routes");

const app = express();
app.use(cors());
app.use(express.json());

// routes ......
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/attempts", attemptRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/progress", progressRoutes);

if (require.main === module) {
  connectDB();
  app.listen(process.env.PORT, () =>
    console.log("server started on " + process.env.PORT),
  );
}

module.exports = app;
