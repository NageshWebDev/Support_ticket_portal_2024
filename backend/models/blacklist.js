const mongoose = require("mongoose");

const blacklistSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true, // The expiration date of the token (same as the JWT token)
  },
});

blacklistSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // Auto-delete expired tokens

const Blacklist = mongoose.model("Blacklist", blacklistSchema);

module.exports = Blacklist;
