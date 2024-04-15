let express = require("express");
let router = express.Router();

let bookController = require("../controllers/bookControllers");

router.get("/books", bookController.getBooks);


module.exports = router;