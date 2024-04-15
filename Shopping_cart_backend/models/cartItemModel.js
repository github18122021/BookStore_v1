const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    books: [
        {
            book: {
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
            },
            quantity: {
                type: Number,
                required: true,
            }
        }
    ]
})

const cartItemModel = mongoose.model("CartItem", cartItemSchema, "cartItems");

module.exports = cartItemModel;


