const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
    {
        firstname: { type: String, required: true, trim: true },
        lastname: { type: String, required: true, trim: true },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Email invalide']
        },
        password: { type: String, required: true },
        role: {
            type: String,
            enum: ["admin", "student", "educational"],
            default: "student"
        },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending"
        },
        isFirstLogin: { type: Boolean, default: true },
        cours: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Course"
            }
        ]
    },
    { timestamps: true }
);

userSchema.pre('save', async function () {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);