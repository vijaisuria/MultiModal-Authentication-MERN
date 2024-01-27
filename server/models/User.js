const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  email: String,
  username: String,
  password: String,
  googleId: String,
  facebookId: String,
  profilePicture: String,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
