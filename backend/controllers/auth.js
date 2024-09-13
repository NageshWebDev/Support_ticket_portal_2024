const jwt = require("jsonwebtoken");
const User = require("../models/user");
const DELAY = 500;
const Blacklist = require("../models/blacklist");

// Register a new user
exports.register = async (req, res, next) => {
  // Simulate delay
  await new Promise((resolve) => setTimeout(resolve, DELAY));

  const { name, email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        success: false,
        data: null,
        message: "User already exists",
      });
    }

    const newUser = await User.create({
      name,
      email,
      password,
      role: "USER",
    });

    const token = jwt.sign({ userId: newUser._id }, process.env.SECRET_KEY, {
      expiresIn: "1 hour",
    });

    res.json({
      success: true,
      data: { token, name, email, userId: newUser._id, userRole: newUser.role },
      message: "Registration successful",
    });
  } catch (error) {
    // Send any other errors as a JSON response
    res.status(500).json({
      success: false,
      data: null,
      message: error.message || "Server Error",
    });
  }
};

// Login with an existing user
exports.login = async (req, res, next) => {
  // Simulate delay
  await new Promise((resolve) => setTimeout(resolve, DELAY));

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, data: null, message: "User not found" });
    }

    const passwordMatch = await user.comparePassword(password);
    if (!passwordMatch) {
      return res
        .status(401)
        .json({ success: false, data: null, message: "Incorrect password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1 hour",
    });

    res.json({
      success: true,
      data: {
        token,
        name: user.name,
        email,
        userId: user._id,
        userRole: user.role,
      },
      message: "Login successful",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      message: error.message || "Server Error",
    });
  }
};


exports.logout = async (req, res, next) => {
  // Get the token from the request headers (assuming a Bearer token)
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(400).json({
      success: false,
      data: null,
      message: "Token not provided",
    });
  }

  try {
    // Decode the token to get the expiration time
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // Calculate the token's expiration time
    const expirationTime = new Date(decoded.exp * 1000); // Convert to milliseconds

    // Add the token to the blacklist
    await Blacklist.create({ token, expiresAt: expirationTime });

    res.json({
      success: true,
      data: null,
      message: "Logout successful, token added to blacklist",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      message: error.message || "Server Error",
    });
  }
};
