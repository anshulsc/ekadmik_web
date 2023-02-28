const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        min: 6,
        max: 14,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["admin", "user"],
    },
    details: [{ type: mongoose.Schema.Types.ObjectId, ref: "Details" }],
});

UserSchema.pre('save', async function(next) {
    try {
        if (!this.isModified('password')) {
            return next();
        }
        const passwordHash = await bcrypt.hash(this.password, 10);
        this.password = passwordHash;
        next();
    } catch(err) {
        return next(err);
    }
});

UserSchema.methods.comparePassword = async function(password) {
    try {
        const isMatch = await bcrypt.compare(password, this.password);
        return isMatch ? this : false;
    } catch(err) {
        throw new Error(err);
    }
};
module.exports = mongoose.model("User", UserSchema);
