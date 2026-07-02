const mongoose = require("mongoose");

const AttemptSchema = new mongoose.Schema(
    {

        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        quizId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Quiz",
            required: true,
        },

        score: {
            type: Number,
            required: true,
            min: 0,
            max: 100,
        },

        passed: {
            type: Boolean,
            required: true,
        },

        answers: [
            {
                questionId: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                },
                selected: [String]
            }
        ]

    },

    { timestamps: true }

);

module.exports = mongoose.model("Attempt", AttemptSchema);