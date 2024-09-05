const DELAY = 500;
const Ticket = require("../models/ticket");
const { ObjectId } = require("mongodb");

exports.getTicket = async (req, res) => {
  // Simulate delay
  await new Promise((resolve) => setTimeout(resolve, DELAY));

  try {
    // Get the collection object and get the record
    const ticketDetails = await Ticket.find();

    res.status(200).json({
      success: true,
      data: ticketDetails,
      message: `Fetched tickets details successfully`,
    });
  } catch (err) {
    console.error(err);
    res.status(404).json({
      success: false,
      data: null,
      message: `Failed to read or parse data: ${err.message}`,
    });
  }
};

exports.getTicketById = async (req, res) => {
  // Simulate delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const { ticketId } = req.params;
  try {
    const targetTicket = await Ticket.findById({
      _id: new ObjectId(ticketId),
    });

    if (!targetTicket) throw Error(`Invalid ticket id : ${ticketId}`);

    res.status(200).json({
      success: true,
      data: targetTicket,
      message: `Fetched ticket details successfully`,
    });
  } catch (err) {
    console.error(err);
    res.status(404).json({
      success: false,
      data: null,
      message: err.message,
    });
  }
};
