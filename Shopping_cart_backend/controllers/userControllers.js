let User = require("../models/userModel");
let bcrypt = require("bcrypt");
let jwt = require("jsonwebtoken");
require("dotenv").config();

async function registerUser(req, res) {
    let {name, email, password} = req.body;

    try {
        if(!name || !email || !password) {
            return res.status(400).json({error: "please fill in all fields!"})
        }


        if(password.length < 6) {
            return res.status(400).json({error: "password must be at least 6 characters long!"});
        }


        let user = await User.findOne({email});

        if(user) {
            return res.status(400).json({error: "user already exists!"});
        }

        let hashedPassword = await bcrypt.hash(password, 10);

        await User.create({name, email, password: hashedPassword});

        return res.status(201).json({message: "user created successfully!"});

    } catch(error) {
        return res.status(500).json({error: "An error occurred!"});
    }
} 

async function loginUser(req, res) {
    let {email, password} = req.body;
    
    try {
        if(!email || !password || email === " " || password === " ") {
            return res.status(400).json({error: "please fill in all fields!"});
        }

        let user = await User.findOne({email});

        if(!user) {
            return res.status(400).json({error: "user does not exist!"});
        }

        let isPasswordCorrect = await bcrypt.compare(password, user.password);

        if(!isPasswordCorrect) {
            return res.status(400).json({error: "invalid password!"});
        }

        let token = jwt.sign({id: user._id}, process.env.JWT_SECRET_KEY, {expiresIn: "1h"});

        return res.status(200).json({message: "login successful!", token});

    } catch (error) {
        return res.status(500).json({error: "An error occurred!"});
    }
}

async function verifyUser(req, res) {
    let token = req.headers.authorization;

    if(token && token.startsWith("Bearer")) {
        token = token.split(" ")[1];

        jwt.verify(token, process.env.JWT_SECRET_KEY, (error, decoded) => {
            if(error) {
                return res.status(401).json({error: error.message});
            }

            req.userId = decoded.id;

            return res.status(200).json({message: "user verified!", userId: req.userId});

            
        })
    } else {
        return res.status(401).json({error: "Token missing or invalid!"});
    }

}

let cartItemModel = require("../models/cartItemModel");
let Books = require("../models/booksModel");


async function getUser(req, res) {
    
    let userId = req.body.userId;

    console.log(userId)

    console.log(userId);

    // await cartItemModel.create({
    //     "user": "6616ec4a9f2481a16c5b6753",
    //     "books": [
    //       {
    //         "book": {
    //           "name": "Atomic Habits",
    //           "image": "https://m.media-amazon.com/images/I/513Y5o-DYtL.jpg",
    //           "price": 19.99
    //         },
    //         "quantity": 2
    //       },
    //       {
    //         "book": {
    //           "name": "The Psychology of Money",
    //           "image": "https://m.media-amazon.com/images/I/71TRUbzcvaL._SL1500_.jpg",
    //           "price": 36.99
    //         },
    //         "quantity": 2
    //       },
    //       {
    //         "book": {
    //           "name": "The 48 Laws of Power",
    //           "image": "https://m.media-amazon.com/images/I/611X8GI7hpL._SL1500_.jpg",
    //           "price": 23.99
    //         },
    //         "quantity": 2
    //       }
    //     ]
    //   }
    //   );

    try {
        let user = await cartItemModel.find({user: userId});

        if(user.length === 0) {
            return res.status(404).json({error: "user not found!"});
        }

        console.log(user)
        return res.status(200).json(user);
    } catch(error) {
        return res.status(500).json({error: "An error occurred!"});
    }
}

async function updateUser(req, res) {
    console.log(req.body);
    console.log("Updating user...");

    const { userId, bookId, quantity } = req.body;

    if (!userId || !bookId || !quantity) {
        return res.status(400).json({ error: "Please fill in all fields!" });
    }

    try {
        let user = await cartItemModel.findOne({ user: userId });

        if (!user) {
            return res.status(404).json({ error: "User not found!" });
        }

        let book = user.books.find((book) => book.book._id === bookId);

        let fullBook = await Books.findById(bookId);

        if (!fullBook) {
            return res.status(404).json({ error: "Book not found!" });
        }

        if (!book) {
            user.books.push({ book: fullBook, quantity });
        } else {
            book.quantity += quantity;
        }

        await user.save();

        return res.status(200).json({ message: "User updated successfully!" });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: "An error occurred!" });
    }
}


module.exports = {
    registerUser,
    loginUser,
    verifyUser,
    getUser,
    updateUser
}