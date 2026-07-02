const mongoose = require("mongoose");

const LessonSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true, 
        },
        htmlContent: {     // content of the lesson
            type: String,
            required: true,
        },
        courseId: {     // every lessons belongs to a course here
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true,
        },
        // it saves the date when the lesson is available to studentss
        availableFrom: {
            type: Date,
            default: null,
        },
        order: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Lesson", LessonSchema);