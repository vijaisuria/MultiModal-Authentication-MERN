const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User");
require("dotenv").config();

// Local Strategy
passport.use(
  new LocalStrategy(
    { usernameField: "usernameOrEmail" },
    async (usernameOrEmail, password, done) => {
      try {
        usernameOrEmail = usernameOrEmail.toLowerCase();
        const isEmail = usernameOrEmail.includes("@");
        let user;

        if (isEmail) {
          user = await User.findOne({ email: usernameOrEmail });
        } else {
          user = await User.findOne({ username: usernameOrEmail });
        }

        if (!user) {
          return done(null, false, { message: "User does not exist" });
        }

        if (password !== user.password) {
          return done(null, false, { message: "Invalid Password" });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://localhost:3001/auth/google/callback",
      scope: ["profile", "email"],
    },
    (accessToken, refreshToken, profile, done) => {
      User.findOne({ googleId: profile.id }).then((currentUser) => {
        if (currentUser) {
          done(null, currentUser);
        } else {
          new User({
            googleId: profile.id,
            username: profile.displayName,
            email: profile.emails[0].value,
            profilePicture: profile.photos[0].value,
          })
            .save()
            .then((newUser) => {
              done(null, newUser);
            });
        }
      });
    }
  )
);

// Facebook Strategy
passport.use(
  new FacebookStrategy(
    {
      clientID: "your-facebook-client-id",
      clientSecret: "your-facebook-client-secret",
      callbackURL: "http://localhost:3001/auth/facebook/callback",
      profileFields: ["id", "displayName", "email"],
    },
    (accessToken, refreshToken, profile, done) => {
      User.findOne({ facebookId: profile.id }).then((currentUser) => {
        if (currentUser) {
          done(null, currentUser);
        } else {
          new User({
            facebookId: profile.id,
            username: profile.displayName,
          })
            .save()
            .then((newUser) => {
              done(null, newUser);
            });
        }
      });
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});
