const User = require("../models/User")
const { sendApprovalEmail } = require("../../services/email.service");
const getPendingUsers = async (req, res) => {
    try {
        const users = await User.find({
            status: "pending"
        }).select("-password");

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


const approveUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            {
                status: "approved"
            },
            {
                new: true
            }
        );
            if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        await sendApprovalEmail(
        user.email,
        `${user.firstname} ${user.lastname}`
        );
        res.status(200).json({
            message: "User approved",
            user
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


const rejectUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            {
                status: "rejected"
            },
            {
                new: true
            }
        );

        res.status(200).json({
            message: "User rejected",
            user
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    getPendingUsers,
    approveUser,
    rejectUser
};
