const User = require("../models/User");
const bcrypt = require("bcrypt");
const { userSchema, updateUserSchema } = require("../validators/user.validator");


// Import user from json/csv file
const importUsers = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const fileContent = req.file.buffer.toString("utf-8");
        const fileType = req.file.originalname.split(".").pop().toLowerCase();

        let userData;

        if (fileType === "json") {
            userData = JSON.parse(fileContent);
        } else if (fileType === "csv") {
            userData = fileContent
                .split("\n")
                .slice(1)
                .filter(line => line.trim())
                .map(line => {
                    const [firstname, lastname, email, password, role] = line.split(",");
                    return { firstname, lastname, email, password, role };
                });
        } else {
            return res.status(400).json({ message: "Only JSON or CSV files are accepted" });
        }

        for (const u of userData) {
            const result = userSchema.safeParse(u);
            if (!result.success) {
                return res.status(400).json({
                    message: "Validation failed for one or more users",
                    errors: result.error.issues.map((i) => i.message),
                });
            }
        }

        const usersToInsert = await Promise.all(userData.map(async u => ({
            firstname: u.firstname,
            lastname: u.lastname,
            email: u.email,
            password: await bcrypt.hash(u.password || "Changeme123!", 10),
            role: u.role || "student",
            isFirstLogin: true
        })));

        const users = await User.insertMany(usersToInsert);

        res.status(201).json({ message: "Users imported", count: users.length });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get all users
const getUsers = async (req, res) => {
    try {
        const users = await User.find();

        if (users === 0) {
            return res.status(404).json({ message: "No users found" });
        }

        res.status(200).json({ message: "Users:", users })
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message })
    }
}

// Get user by id
const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        res.status(200).json({ message: "User retourned", user });

    } catch (error) {
        return res.status(500).json({ message: "Server error ", error: error.message });
    }
}

// Delete user by id
const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        res.status(200).json({ message: "User deleted ", user });

    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message })
    }
}

// Update user profile
const updateUser = async (req, res) => {
    try {

        // from zod to validate incoming data 
        const result = updateUserSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                message: "Validation failed",
                errors: result.error.issues.map((i) => i.message),
            });
        }

        const { firstname, lastname, email } = result.data;

        const user = await User.findByIdAndUpdate(req.params.id,
            { firstname, lastname, email },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        res.status(200).json({ message: "User updated", user });

    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}

// Update user password
const updatePassword = async (req, res) => {
    try {
        const { password } = req.body;

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isSame = await bcrypt.compare(password, user.password);
        if (isSame) {
            return res.status(400).json({ message: "Le mot de passe doit être différent" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.findByIdAndUpdate(
            req.params.id,
            { password: hashedPassword, isFirstLogin: false },
            { new: true }
        );

        res.status(200).json({ message: "Password updated" });

    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

// firstLogin false for admin registration
const firstLoginFalse = async (req, res) => {
    try {
        const admin = await User.findByIdAndUpdate(req.params.id,
            { isFirstLogin: false },
            { new: true }
        );

        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        return res.status(200).json({ message: "First Login updated to false" })

    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message })
    }
}


// approved student dashboard to student list dashboard
const getApprovedStudents = async (req, res) => {
    try {
        const students = await User.find({
            status: "approved",
            role: "student"
        }).select("-password");
        res.status(200).json({ message: "Approved students", users: students });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}


module.exports = { importUsers, getUsers, getUser, deleteUser, updateUser, updatePassword, getApprovedStudents, firstLoginFalse };