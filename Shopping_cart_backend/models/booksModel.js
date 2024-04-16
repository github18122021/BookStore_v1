const mongoose = require("mongoose");

const booksSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please fill in the book name!"],
    },
    image: {
        type: String,
        required: [true, "Please fill in the book image!"],
    },
    price: {
        type: Number,
        required: [true, "Please fill in the book price!"],
    }
})

const booksModel = mongoose.model("Book", booksSchema);

module.exports = booksModel;