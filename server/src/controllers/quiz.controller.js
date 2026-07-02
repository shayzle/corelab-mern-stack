const Quiz = require("../models/Quiz");


const importQuiz = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({message: "No file uploaded here"});
        }

        const fileContent = req.file.buffer.toString("utf-8");
        const fileType = req.file.originalname.split(".").pop().toLowerCase();

        let quizData;

        if (fileType === "json") {
            quizData = JSON.parse(fileContent);
        } else if (fileType === "csv") {
            quizData = parseCSV(fileContent, req.body);
        } else {
            return res.status(400).json({message: "Only JSON or CSV files are accepted !"});
        }

        const quiz = await Quiz.create({
            title: quizData.title || req.body.title,
            courseId: quizData.courseId || req.body.courseId,
            lessonId: quizData.lessonId || req.body.lessonId || null,
            questions: quizData.questions,
            passingScore: quizData.passingScore || req.body.passingScore,
        });

        res.status(201).json({ message: "Quiz imported", quiz });
    } catch (error) {
        res.status(500).json({message: "Server error", error: error.message});
    }
};


const parseCSV = (content, body) => {
    const lines = content.trim().split("\n");
    const questions = [];

    for (let i = 1; i < lines.length; i++) {
        const [question, options, correctAnswers] = lines[i].split(",");
        questions.push({
            question: question.trim(),
            options: options.split("|").map((o) => o.trim()),
            correctAnswers: correctAnswers.split("|").map((a) => a.trim()),
        });
    }

    return {
        title: body.title,
        courseId: body.courseId,
        lessonId: body.lessonId || null,
        passingScore: body.passingScore,
        questions,
    };
};


const getQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);

        if (!quiz) {
            return res.status(404).json({message: "Quiz ain't found!"});
        }

        res.status(200).json({ message: "Quiz returned", quiz });
    } catch (error) {
        res.status(500).json({message: "Server error", error: error.message});
    }
};


const createQuiz = async (req, res) => {
    try {
        const {title, courseId, lessonId, passingScore, questions} = req.body;

        const quiz = await Quiz.create({
            title,
            courseId,
            lessonId: lessonId || null,
            questions,
            passingScore: Number(passingScore),
        });

        res.status(201).json({message: "Quiz created", quiz});
    } catch (error) {
        res.status(500).json({message: "Server error", error: error.message});
    }
};


const getQuizByLesson = async (req, res) => {
    try {
        const quizzes = await Quiz.find({lessonId: req.params.lessonId});
        res.status(200).json({quizzes});
    } catch (error) {
        res.status(500).json({message: "Server error", error: error.message});
    }
};


const deleteQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);

        if (!quiz) {
            return res.status(404).json({message: "Quiz not found!"});
        }

        await Quiz.findByIdAndDelete(req.params.id);

        res.status(200).json({message: "Quiz deleted successfully"});
    } catch (error) {
        res.status(500).json({message: "Server error", error: error.message});
    }
};


const updateQuiz = async (req, res) => {
    try {
        const {title, passingScore, questions} = req.body;

        const updatedQuiz = await Quiz.findByIdAndUpdate(
            req.params.id,
            {
                title,
                passingScore: Number(passingScore),
                questions,
            },
            {new: true},
        );

        if (!updatedQuiz) {
            return res.status(404).json({message: "Quiz not found!"});
        }

        res.status(200).json({message: "Quiz updated successfully", quiz: updatedQuiz});
    } catch (error) {
        res.status(500).json({message: "Server error", error: error.message});
    }
};


module.exports = { importQuiz, getQuiz, createQuiz, getQuizByLesson, deleteQuiz, updateQuiz };