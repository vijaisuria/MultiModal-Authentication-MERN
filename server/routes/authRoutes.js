const express = require("express");
const passport = require("passport");
const router = express.Router();

// Local Authentication
router.post("/login", passport.authenticate("local"), (req, res) => {
  console.log("Login through passport", req.message);
  res.json({ user: req.user });
});

// Google Authentication
router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/");
  }
);

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
  req.logout();
  res.redirect("/");
});

module.exports = router;
