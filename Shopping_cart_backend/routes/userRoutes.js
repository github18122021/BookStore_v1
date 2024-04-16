let express = require("express");
let router = express.Router();

let userControllers = require("../controllers/userControllers");
let verifyUserToken = require("../middlewares/verifyUserToken");

router.post("/register", userControllers.registerUser);
router.post("/login", userControllers.loginUser);
router.get("/verify", userControllers.verifyUser);
router.post("/user", userControllers.getUser);
router.post("/addCart", userControllers.updateUser);

module.exports = router;