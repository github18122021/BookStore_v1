let express = require("express");
let app = express();
let mongoose = require("mongoose");
let cors = require("cors");

require("dotenv").config();


let port = process.env.PORT || 3000;

// Middlewares
let verifyUserToken = require("./middlewares/verifyUserToken");

app.use(express.json());
app.use(cors());

app.listen(port, () => {
    console.log("Server Running on port " + port);
})

// database connection
mongoose.connect(process.env.DB_URL)
    .then(() => {
        console.log("Database connected successfully");
    })
    .catch((error) => {
        console.log("An error occurred: " + error);
    })



let userRoutes = require("./routes/userRoutes");
let bookRoutes = require("./routes/bookRoutes");


app.use("/", userRoutes);
app.use("/", bookRoutes);



