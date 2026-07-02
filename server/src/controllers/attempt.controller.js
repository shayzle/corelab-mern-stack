const Attempt = require("../models/Attempt");
const Quiz = require("../models/Quiz");
const User = require("../models/User");

const getAttemptsByCourse = async (req, res) => {
    try {
        const quizzes = await Quiz.find({ courseId: req.params.courseId });
        const quizIds = quizzes.map(q => q._id);

        const attempts = await Attempt.find({
            studentId: req.user.id,
            quizId: { $in: quizIds }
        }).populate("quizId", "title passingScore questions");

        res.status(200).json({ attempts });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


const getStudentResults = async (req, res) => {

    try {
        const student = await User.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ message: "Student ain't found!" });
        }


        const attempts = await Attempt.find({ studentId: req.params.id })
            .populate("quizId", "title passingScore courseId")
            .sort({ createdAt: -1 });


        const results = attempts.map((attempt) =>
        ({
            attemptId: attempt._id,
            quizTitle: attempt.quizId?.title || "Unknown Quiz",
            score: attempt.score,
            passingScore: attempt.quizId?.passingScore,
            passed: attempt.passed,
            date: attempt.createdAt,
        }));
        res.status(200).json({
            message: "Results returned",
            student: {
                id: student._id,
                firstname: student.firstname,
                lastname: student.lastname,
                email: student.email,
            },
            results,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const createAttempt = async (req, res) => {
    try {
        const { quizId, score, passed, answers } = req.body;

        const attempt = await Attempt.create({
            studentId: req.user.id,
            quizId,
            score,
            passed,
            answers
        });

        res.status(201).json({ message: "Attempt saved", attempt });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const getStudentAttemptsByCourse = async (req, res) => {
    try {
        const { studentId, courseId } = req.params;

        const quizzes = await Quiz.find({ courseId });
        const quizIds = quizzes.map(q => q._id);

        const attempts = await Attempt.find({
            studentId,
            quizId: { $in: quizIds }
        }).populate("quizId", "title passingScore");

        res.status(200).json({ attempts });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { getStudentResults, createAttempt, getAttemptsByCourse, getStudentAttemptsByCourse };