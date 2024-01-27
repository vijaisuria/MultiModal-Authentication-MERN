const express = require("express");
const passport = require("passport");
const router = express.Router();

// Local Authentication
router.post("/login", passport.authenticate("local"), (req, res) => {
  res.json({ user: req.user });
});

// Google Authentication
router.get("/google", passport.authenticate("google", ["profile", "email"]));

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login/failed",
    successRedirect: process.env.CLIENT_URL,
  })
);

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
