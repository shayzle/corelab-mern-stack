const mongoose = require("mongoose");

// it creates a sub-schema here


const QuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
    },
    options: [                // a b c d here
        {
            type: String,
            required: true,
        },
    ],
    correctAnswers: [
        {
            type: String,
            required: true,
        },
    ],
});


const QuizSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        courseId: {     // every lessons belongs to a course here
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true,
        },
        lessonId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Lesson",
            default: null,
        },
        questions: [QuestionSchema],     // connecting with questionschema objects here
        passingScore: {
            type: Number,
            required: true,
            min: 0,
            max: 100,
        },
    },
    {timestamps: true} 
);

module.exports = mongoose.model("Quiz", QuizSchema);