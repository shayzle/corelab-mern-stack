const Lesson = require("../models/Lesson");
const Notification = require("../models/Notification");


const createLesson = async (req, res) => {
    try {
        const { title, htmlContent, courseId, availableFrom, order } = req.body;

        const lesson = await Lesson.create({
            title,
            htmlContent,
            courseId,
            availableFrom,
            order,
        });

        res.status(201).json({
            message: "Lesson created",
            lesson,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


const getLesson = async (req, res) => {
    try {
        const lesson = await Lesson.findById(req.params.id);

        if (!lesson) {
            return res.status(404).json({ message: "Lesson ain't found" });
        }

        if (lesson.availableFrom && new Date() < new Date(lesson.availableFrom)) {
            return res.status(403).json({
                message: "Not available yet !",
                availableFrom: lesson.availableFrom,
            });
        }

        if (lesson.availableFrom && req.user) {
            const alreadyNotified = await Notification.findOne({
                userId: req.user.id,
                lessonId: lesson._id,
            });
            if (!alreadyNotified) {
                await Notification.create({
                    userId: req.user.id,
                    lessonId: lesson._id,
                    message: `New lesson available: ${lesson.title}`,
                    read: false,
                });
            }
        }

        res.status(200).json({
            message: "Lesson returned",
            lesson,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


const getCoursLessons = async (req, res) => {
    try {
        const lessons = await Lesson.find({
            courseId: req.params.courseId
        }).sort({ order: 1 });

        return res.status(200).json({ lessons });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};


const updateLesson = async (req, res) => {
    try {
        const { title, htmlContent, availableFrom, order } = req.body;

        const lesson = await Lesson.findByIdAndUpdate(
            req.params.id,
            { title, htmlContent, availableFrom, order },
            { new: true }
        );

        if (!lesson) {
            return res.status(404).json({ message: "Lesson not found" });
        }

        res.status(200).json({ message: "Lesson updated", lesson });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


const deleteLesson = async (req, res) => {
    try {
        const lesson = await Lesson.findByIdAndDelete(req.params.id);

        if (!lesson) {
            return res.status(404).json({ message: "Lesson not found" });
        }

        res.status(200).json({ message: "Lesson deleted" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


module.exports = { createLesson, getLesson, getCoursLessons, updateLesson, deleteLesson };