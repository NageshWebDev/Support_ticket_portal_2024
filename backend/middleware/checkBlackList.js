const Blacklist = require("../models/blacklist");

async function checkBlacklist (req, res, next) {
  // Get the token from the request headers
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      data: null,
      message: "Unauthorized, token missing",
    });
  }

  try {
    // Check if the token is blacklisted
    const blacklistedToken = await Blacklist.findOne({ token });

    if (blacklistedToken) {
      return res.status(401).json({
        success: false,
        data: null,
        message: "Unauthorized, token has been blacklisted",
      });
    }

    // If not blacklisted, proceed to the next middleware or route handler
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      message: error.message || "Server Error",
    });
  }
};

module.exports = {checkBlacklist};
