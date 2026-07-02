const Course = require("../models/Course");
const User = require("../models/User");

//  Create cours
const createCourse = async (req, res) => {
    try {
        const { title, description, category, imageUrl } = req.body;

        const course = await Course.create({
            title,
            description,
            category,
            imageUrl,
        });

        res.status(201).json({
            message: "Course created",
            course,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get all cours
const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find();

        res.status(200).json({
            message: "Courses returned",
            courses,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get cours by id
const getCours = async (req, res) => {
    try {
        const cours = await Course.findById(req.params.id)

        if (!cours) {
            return res.status(404).json({ message: "Cours not found" });
        }

        res.status(200).json({ message: "Cours retourned", cours });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    };
}

// Edit cours
const editCours = async (req, res) => {
    try {
        const { title, description, category, imageUrl } = req.body;

        const cours = await Course.findByIdAndUpdate(req.params.id,
            { title, description, category, imageUrl },
            { new: true }
        );

        if (!cours) {
            return res.status(404).json({ message: "Cours not found" })
        }

        res.status(200).json({ message: "Cours updated" , course: cours})
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}

// Delete cours
const deleteCours = async (req, res) => {
    try {
        const cours = await Course.findByIdAndDelete(req.params.id);

        if (!cours) {
            return res.status(404).json({ message: "Cours does not exist" });
        }

        res.status(200).json({ message: "Cours delated" })
    } catch (error) {
        return res.status(500).json({ messsage: "Server error", error: error.message });
    }
}

// Assign students
const assignStudent = async (req, res) => {

    try {
        const { studentIds } = req.body;

        const course = await Course.findByIdAndUpdate
            (req.params.id,
                { $addToSet: { cohorts: { $each: studentIds } } },
                { new: true }
            )

        if (!course) {
            return res.status(404).json({ message: "Cours not found" })
        }

        await User.updateMany(
            { _id: { $in: studentIds } },
            { $addToSet: { cours: req.params.id } }
        );

        res.status(200).json({ message: "User assigned" })

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

// Get user courses
const getStudentCourses = async (req, res) => {

    try {
        const courses = await Course.find({
            cohorts: req.user.id
        });

        res.status(200).json({ courses });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
}

module.exports = { createCourse, getAllCourses, getCours, editCours, deleteCours, assignStudent, getStudentCourses };