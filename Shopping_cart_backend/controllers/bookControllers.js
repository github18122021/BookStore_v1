let Books = require("../models/booksModel");


async function getBooks(req, res) {
    try {
        let book = await Books.find();

        if(book.length === 0) {
            return res.status(404).json({error: "No books available!"});
        }

        return res.status(200).json(book);
    } catch(error) {
        return res.status(500).json({error: "An error occurred!"});
    }
}

module.exports = {
    getBooks,
}