const jwt = require('jsonwebtoken');
const userschema = require("../models/userschema");


// Middleware to verify JWT token
exports.verifyToken = (req, res, next) => {
    const token = req.header('Authorization'); // Get the token from the header
    if (!token) {
        return res.status(401).json({ code: 401, message: 'Access denied. No token provided.' });
    }
    const bearerToken = token.split(' ')[1];
    if (!bearerToken) {
        return res.status(401).json({ code: 401, message: 'Invalid token format.' });
    }

    try {
        // Verify the token using the secret key
        const decoded = jwt.verify(bearerToken, 'laughing'); // Use the same secret key that was used to sign the token
        req.user = decoded; // Store the decoded user details in req.user for further use
        next(); // Call next middleware or function
    } catch (error) {
        return res.status(400).json({ code: 400, message: 'Invalid token.' });
    }
};

exports.verifyAdminToken = async (req, res, next) => {
    const token = req.header('Authorization'); // Get the token from the header
    if (!token) {
        return res.status(401).json({ code: 401, message: 'Access denied. No token provided.' });
    }
    const bearerToken = token.split(' ')[1];
    if (!bearerToken) {
        return res.status(401).json({ code: 401, message: 'Invalid token format.' });
    }

    try {
        const decoded=jwt.verify(bearerToken, 'laughing');
        console.log(decoded);
        if ( decoded.role !== "admin") {
            return res.status(403).json({ message: "You are not authorized to perform this action." });
        }
        req.user=decoded;
        next();
    } catch (err) {
        return res.status(400).json({ code: 400, message: 'Invalid token.' });
    }
}
