// middlewares/authMiddleware.js
const passport = require("passport");

const jwtAuthMiddleware = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) {
            return res.status(500).json({ message: "Error in authentication" });
        }
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        req.user = user; // Set the authenticated user in request
        next(); // Proceed to the next middleware or controller
    })(req, res, next);
};

module.exports = jwtAuthMiddleware;
