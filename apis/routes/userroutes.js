//apis\routes\userroutes.js
const express = require('express');
const router = express.Router();
const { verifyToken, verifyAdminToken } = require("../middlewares/middleware");
const usercontroller = require("../controller/usercontroller");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const jwtAuthMiddleware = require("../middlewares/authMiddleware");


router.post("/signup", usercontroller.signup);
// router.get('/login',usercontroller.login);//simple login route

// router.post('/login', passport.authenticate('local', { session: false }), (req, res) => {
//     // If authentication is successful, this function will execute

//     const token = jwt.sign({ _id: req.user._id, email: req.user.email }, "laughing", { expiresIn: '1h' });

//     return res.status(200).json({ code: 200, message: 'Login successful', token });
// });

// we’ll implement the login action. Here, we call the passport authentication function with local strategy, handle the errors and log in the user.
router.post('/login', (req, res, next) => {
    console.log('Login attempt:', req.body);
    passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err || !user) {
            console.log('Authentication error:', info);
            return res.status(400).json({ message: info ? info.message : 'Invalid credentials' });
            // return res.status(400).json({ message: 'Invalid credentials' });
        }
        req.login(user, { session: false }, (err) => {
            if (err) {
                return res.status(500).json({ message: 'Could not log in user' });
            }
            // Generate JWT token
            const token = jwt.sign(
                { _id: user._id, email: user.email, role: user.role },
                "laughing", // Replace with your secret key
                { expiresIn: '1h' }
            );
            return res.status(200).json({ code: 200, message: 'Login successful', token });
        });
    })(req, res, next);
});

// Protected route - user must be authenticated
//isko toda
// router.get("/profile", (req, res, next) => {
//     passport.authenticate('jwt', { session: false }, (err, user, info) => {
//         if (err) {
//             return res.status(500).json({ message: "Error in authentication" });
//         }
//         if (!user) {
//             return res.status(401).json({ message: "Unauthorized" });
//         }
//         req.user = user;
//         return res.status(200).json({ message: "Profile data", user: req.user });
//     })(req, res, next);
// });

router.get("/profile", jwtAuthMiddleware, usercontroller.getUserProfile);


router.post("/approveUser", verifyAdminToken, usercontroller.approveUser);
router.get("/getPendingUsers", verifyAdminToken, usercontroller.getPendingUsers);
router.get("/getUserList", verifyAdminToken, usercontroller.getUserList);




module.exports = router;