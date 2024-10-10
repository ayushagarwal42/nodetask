//apis\config\passportsetup.js
const passport = require("passport");

const LocalStrategy = require('passport-local').Strategy; //local strategy

const passportJWT = require("passport-jwt");//jwt strategy
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const userschema = require("../models/userschema");
const bcrypt = require('bcrypt');


// Note, that we assume that the client will send the JWT token in Authorization Header as a Bearer Token.
const opts = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'laughing', // Use the same secret key you used for signing tokens
};

passport.use(new JWTStrategy(opts, async (jwt_payload, done) => {
    try {
        const user = await userschema.findById(jwt_payload._id);
        if (user) {
            return done(null, user);
        }
        return done(null, false);
    } catch (error) {
        return done(error, false);
    }
}));

// Configure the local strategy
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
},
    async (email, password, done) => {
        try {
            console.log('Trying to authenticate:', email);
            // Replace this with your actual user authentication logic
            const user = await userschema.findOne({ email });
            if (!user) {
                console.log('User not found');
                return done(null, false, { message: 'Incorrect email.' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            console.log('Password match:', isMatch);
            // const isMatch = await user.comparePassword(password); // Implement this in your User model
            if (!isMatch) {
                console.log('Incorrect password');
                return done(null, false, { message: 'Incorrect password.' });
            }

            return done(null, user, { message: 'Logged In Successfully' }); // Return the authenticated user
        } catch (err) {
            console.error('Error during authentication:', err);
            return done(err);
        }
    }
));

module.exports = passport;
