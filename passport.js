require('dotenv').config({path: './config.env'});
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const  JWTStrategy = require('passport-jwt').Strategy;
const User = require('./models/User');

const cookieExtractor = req => {
    let token = null;
    if(req && req.cookies){
        token = req.cookies['access_token'];
    }
    return token;
}

passport.use(new JWTStrategy({
    jwtFromRequest: cookieExtractor,
    secretOrKey: process.env.JWT_SECRET,
}, async (payload, done) => {
    try {
        const user = await User.findById(payload.sub);
        if (!user) {
            return done(null, false);
        }
        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));


passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',

}, async (username, password, done) => {
try{
    const user = await User.findOne({username});
    if(!user){
        return done(null, false, {message: 'User not found'});
    }
    const isMatch = await user.comparePassword(password);
    if(!isMatch){
        return done(null, false, {message: 'Incorrect password'});
    }
    return done(null, user, {message: 'Logged in successfully'});
}
catch (err){
    return done(err);
}
}
))



