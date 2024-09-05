const jwt = require("jsonwebtoken");
const User = require("../models/user");

async function authenticate(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ success: false, data: null, message: "Authentication required" });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findById(decodedToken.userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, data: null, message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    res
      .status(401)
      .json({ success: false, data: null, message: "Invalid token" });
  }
}

module.exports = { authenticate };
