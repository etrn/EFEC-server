// Importing Passport, strategies, and config
const passport = require('passport');
const User = require('../models/user');
const config = require('./main');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const TwitterStrategy	= require('passport-twitter').Strategy;

// Setting username field to email rather than username
const localOptions = {
    usernameField: 'email'
};

// Setting up local login strategy
const localLogin = new LocalStrategy(localOptions, (email, password, done) => {
    User.findOne({ email }, (err, user) => {
        if (err) return done(err);
        if (!user) return done(null, false, { error: 'Your login details could not be verified. Please try again.' });

        user.comparePassword(password, (err, isMatch) => {
            if (err) return done(err);
            if (!isMatch) return done(null, false, { error: 'Your login details could not be verified. Please try again.' });

            return done(null, user);
        });
    });
});

// Setting JWT strategy options
const jwtOptions = {
  // Telling Passport to check authorization headers for JWT
    jwtFromRequest: ExtractJwt.fromAuthHeader(),
  // Telling Passport where to find the secret
    secretOrKey: config.secret

  // TO-DO: Add issuer and audience checks
};

// Setting up JWT login strategy
const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
    User.findById(payload._id, (err, user) => {
        if (err) return done(err, false);

        if (user)
            done(null, user);
        else
      done(null, false);
    });
});
// In case of Facebook and Google, tokenA is the access token, while tokenB is the refersh token.
// In case of Twitter, tokenA is the token, whilet tokenB is the tokenSecret.
const verifySocialAccount = function (tokenA, tokenB, data, done) {
    User.findOrCreate(data, (err, user) => {
        if (err) return done(err);
        return done(err, user);
    });
};

const google = new GoogleStrategy(config.google, verifySocialAccount);
const facebook = new FacebookStrategy(config.facebook, verifySocialAccount);
const twitter = new TwitterStrategy(config.twitter, verifySocialAccount);

passport.use(jwtLogin);
passport.use(localLogin);
passport.use(google);
passport.use(facebook);
passport.use(twitter);
