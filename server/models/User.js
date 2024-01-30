const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  username: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    min: 4,
  },
  password: String,
  googleId: String,
  facebookId: String,
  profilePicture: String,
});

userSchema.pre("save", function (next) {
  this.username = this.username.toLowerCase();
  this.email = this.email.toLowerCase();
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
