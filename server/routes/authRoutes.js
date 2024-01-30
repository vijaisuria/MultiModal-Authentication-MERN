const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/User");

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/auth/login/failed",
  }),
  (req, res) => {
    // At this point, req.user is populated with the authenticated user's information
    res.status(200).json({
      user: req.user,
      msg: "Logged In Successfully",
    });
  }
);

router.post("/register", async (req, res) => {
  let { username, email, password } = req.body;
  username = username.toLowerCase();
  email = email.toLowerCase();

  try {
    const user1 = await User.findOne({ email });
    if (user1) throw Error("User Email already exists");
    const user2 = await User.findOne({ username });
    if (user2) throw Error("Username already exists");
    const newUser = new User({
      username,
      email,
      password,
    });
    await newUser.save();
    res.status(200).json({ msg: "User Registered Successfully" });
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

// Google Authentication
router.get("/google", passport.authenticate("google", ["profile", "email"]));

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/auth/login/failed",
    successRedirect: process.env.CLIENT_URL,
  })
);

router.get("/login/verify", (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json({
      error: false,
      message: "Successfully Logged In",
      user: req.user,
    });
  } else {
    res.status(403).json({ error: true, message: "Not Authorized" });
  }
});

router.get("/login/success", (req, res) => {
  if (req.user) {
    res.status(200).json({
      error: false,
      message: "Successfully Loged In",
      user: req.user,
    });
  } else {
    res.status(403).json({ error: true, message: "Not Authorized" });
  }
});

router.get("/login/failed", (req, res) => {
  res.status(401).json({
    error: true,
    message: "user failed to authenticate.",
    user: null,
  });
});

// Facebook Authentication
router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/");
  }
);

// Logout
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res
        .status(500)
        .json({ error: true, message: "Error during logout" });
    }
    res.redirect(process.env.CLIENT_URL);
  });
});

module.exports = router;
