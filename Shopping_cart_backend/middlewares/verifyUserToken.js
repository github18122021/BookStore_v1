let jwt = require("jsonwebtoken");
require("dotenv").config();

function verifyUserToken(req, res, next) {
    let token = req.headers.authorization;

    if(token && token.startsWith("Bearer")) {
        token = token.split(" ")[1];


        // verification of the token, if it is valid, the user is allowed to access the route
        jwt.verify(token, process.env.JWT_SECRET_KEY, (error, decoded) => {
            if(error) {
                return res.status(401).json({error: error.message});
            }

            req.userId = decoded.id;

            next();
            
        })
    } else {
        return res.status(401).json({error: "Token missing or invalid!"});
    }
}

module.exports = verifyUserToken;