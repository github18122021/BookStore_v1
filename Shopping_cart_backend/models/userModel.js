let mongoose = require("mongoose");

let userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please fill in your name!"],
    },
    email: {
        type: String,
        required: [true, "Please fill in your email!"]
    },
    password: {
        type: String,
        required: [true, "Please fill in your password!"]
    },
    date: {
        type: Date,
        default: Date.now
    }
})

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;

