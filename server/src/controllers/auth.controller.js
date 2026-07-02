const User = require("../models/User");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
    try {
        const { firstname, lastname, email, password, role } = req.body;

        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(409).json({ message: "Email already exist" });
        }

        const user = await User.create({ firstname, lastname, email, password, role });

        res.status(201).json({
            message: "User created",
            user: {
                id: user._id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                role: user.role
            },
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email" });
        }

        if (user.status === "pending") {
            return res.status(403).json({
                message: "Your account is pending by admin approval"
            });
        }

        if (user.status === "rejected") {
            return res.status(403).json({
                message: "Your account has been rejected by the admin"
            });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }

        if (user.status !== "approved") {
            return res.status(403).json({
                message: "Your account is pending approval from an administrator"
            });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.status(200).json({
            message: "Connexion successful",
            token,
            user: {
                id: user._id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                role: user.role,
                isFirstLogin: user.isFirstLogin
            }
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { register, login };