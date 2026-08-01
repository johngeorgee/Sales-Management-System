const jwt = require("jsonwebtoken");
const { promisify } = require("util");

function checkToken(req, res, next) {
    const token = req.headers.token;

    if (!token) {
        return res.status(401).send({
            message: "Token not found. Please login first"
        });
    }

    promisify(jwt.verify)(token, process.env.JWT_SECRET)
        .then((decoded) => {
            req.user = decoded;
            next();
        })
        .catch((err) => {
            return res.status(401).send({
                message: "Invalid or expired token"
            });
        });
}

module.exports = { checkToken };