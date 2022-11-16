const jwt = require("jsonwebtoken");

var jwtSecret = "qwertyuiop";

//Verify the token
const tokenVerify = function (req, res, next) {
	const token = req.headers.authorization.split(' ')[1];
	if (!token) {
		return res.status(401).json({ msg: "No token, authorization denied" });
	}
	try {
		const decoded = jwt.verify(token, jwtSecret);
		req.user = decoded.user;
		next();
	} catch (err) {
		res.status(401).json({ msg: "Token is not valid" });
	}
};


module.exports = {
    tokenVerify
}