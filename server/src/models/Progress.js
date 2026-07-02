const mongoose = require("mongoose");

const ProgressSchema = new mongoose.Schema(
    {
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true
        },

        lastLessonIndex: {
            type: Number,
            default: 0
        },

        completedLessons: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Lesson"
            }
        ],

        totalLessons: {
            type: Number,
            required: true
        },

        completed : {
            type: Boolean,
            default: false
        },
    },

    {
        timestamps: true
    }
);

module.exports = mongoose.model("Progress", ProgressSchema);