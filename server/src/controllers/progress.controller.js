const Progress = require('../models/Progress');

// Get progress
const getProgress = async (req, res) => {
    try {
        const progress = await Progress.findOne({
            studentId: req.user.id,
            courseId: req.params.courseId
        });

        res.status(200).json({ progress });

    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message })
    }
};

// Save progress
const saveProgress = async (req, res) => {
    try {
        const { lastLessonIndex, lessonId, totalLessons } = req.body;

        const progress = await Progress.findOneAndUpdate(
            { studentId: req.user.id, courseId: req.params.courseId },
            {
                $max: { lastLessonIndex },
                totalLessons,
                $addToSet: { completedLessons: lessonId }
            },
            { new: true, upsert: true }
        );

        const isCompleted = progress.completedLessons.length >= progress.totalLessons;

        if (isCompleted !== progress.completed) {
            progress.completed = isCompleted;
            await progress.save();
        }

        res.status(200).json({ progress });

    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

const getStudentProgress = async (req, res) => {
    try {
        const progresses = await Progress.find({
            studentId: req.params.studentId
        }).populate("courseId", "title category");

        res.status(200).json({ progresses });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { getProgress, saveProgress, getStudentProgress }

