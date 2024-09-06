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
    assigneeDetails: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      default: null,
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
  { timestamps: true } // Mongoose will automatically handle createdAt and updatedAt
);

const Ticket = mongoose.model("Ticket", ticketSchema);
module.exports = Ticket;
