const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    priority: {
      type: String,
      required: true,
    },

    file: {
      type: String,
      required: false,
    },

    userDetails: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      required: true,
    },

    filterId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Middleware to update `updatedAt` before saving
ticketSchema.pre("save", function (next) {
  if (this.isModified()) {
    this.updatedAt = Date.now();
  }
  next();
});

const Ticket = mongoose.model("Ticket", ticketSchema);
module.exports = Ticket;
