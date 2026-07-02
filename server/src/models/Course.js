const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            enum: ["Tech", "Culture", "First Aid", "Other"],
            default: "Other",
        },
        imageUrl: {
            type: String,
            default: "",
        },
        // array of user ids (the students assigned to this course)
        cohorts: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Course", CourseSchema);