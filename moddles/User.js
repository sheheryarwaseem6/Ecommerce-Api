const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const validator = require("validator")

let userSchema = new Schema({
    name: {
        type: "string",
        // required: false,
        maxLength: 30,
        minLength: 3,
    },
    email: {
        type: "string",
        // required: false,
        unique: true,
        match: [/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,"Please enter a valid email address"],
        // validate: [validator.isEmail,"Please enter a valid email address"],
    },
    password: {
        type: "string",
        required: true,
        // match: /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/,
    },
    profilePicture: {
        type: String,
        default: null,
    },
    role: {
        type: String,
        default: "user",
    },
    verification_code: {
        type: Number,
        default: null,
    },
    verified: {
        type: Number,
        default: 0
    },
    user_authentication: {
        type: String,
        default: null,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
}, {
    timestamps: true
});

// Export the model
const User = mongoose.model("User", userSchema);
module.exports = User;