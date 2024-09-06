const User = require("../models/user");
const Ticket = require("../models/ticket");
const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const DELAY = 500;

async function getUserRole(userId) {
  /*
    The findById method in Mongoose returns a document object,
    not an object with properties directly accessible for destructuring.
  */
  const user = await User.findById(userId, { _id: 0, role: 1 });
  return user.role;
}

exports.getUserById = async (req, res, next) => {
  // Simulate delay
  await new Promise((resolve) => setTimeout(resolve, DELAY));

  const { userId } = req.params;

  try {
    // Get the collection object and get the record
    const ticketDetails = await User.find({ userId });

    res.status(200).json({
      success: true,
      data: ticketDetails,
      message: `Fetched user details successfully`,
    });
  } catch (err) {
    console.error(err);
    res.status(404).json({
      success: false,
      data: null,
      message: `Failed to fetch user details : ${err.message}`,
    });
  }
};

exports.getUsersEmailAndIdList = async (req, res, next) => {
  // Simulate delay
  await new Promise((resolve) => setTimeout(resolve, DELAY));

  const { userId } = req.params;

  try {
    const userRole = await getUserRole(userId);

    if (userRole !== "admin")
      res.status(404).json({
        success: false,
        data: null,
        message: `Your role does not allow to update ticket status`,
      });

    // Get the collection object and get the record
    const usersEmailAndIdList = await User.find(
      { role: "user" },
      { _id: 1, email: 1 }
    );

    res.status(200).json({
      success: true,
      data: usersEmailAndIdList,
      message: `Fetched user details successfully`,
    });
  } catch (err) {
    console.error(err);
    res.status(404).json({
      success: false,
      data: null,
      message: `Failed to fetch user details : ${err.message}`,
    });
  }
};

exports.getAdminEmailAndIdList = async (req, res, next) => {
  // Simulate delay
  await new Promise((resolve) => setTimeout(resolve, DELAY));

  const { userId } = req.params;

  try {
    const userRole = await getUserRole(userId);

    if (userRole !== "super-admin")
      res.status(404).json({
        success: false,
        data: null,
        message: `Your role does not allow to update ticket status`,
      });

    // Get the collection object and get the record
    const adminEmailAndIdList = await User.find(
      { role: "admin" },
      { _id: 1, email: 1, name: 1 }
    );

    res.status(200).json({
      success: true,
      data: adminEmailAndIdList,
      message: `Fetched admin details successfully`,
    });
  } catch (err) {
    console.error(err);
    res.status(404).json({
      success: false,
      data: null,
      message: `Failed to fetch admin details : ${err.message}`,
    });
  }
};

exports.getUserTickets = async (req, res, next) => {
  // Simulate delay
  await new Promise((resolve) => setTimeout(resolve, DELAY));
  const { userId } = req.params;
  try {
    const userRole = await getUserRole(userId);
    const query = ["admin", "super-admin"].includes(userRole)
      ? null
      : { userId };
    const ticketDetails = await Ticket.find(query);

    res.status(200).json({
      success: true,
      data: ticketDetails || [],
      message: `Fetched tickets details successfully`,
    });
  } catch (err) {
    console.error(err);
    res.status(404).json({
      success: false,
      data: null,
      message: `Failed to get ticket  details: ${err.message}`,
    });
  }
};

exports.getUserTicket = async (req, res, next) => {
  // Simulate delay
  await new Promise((resolve) => setTimeout(resolve, DELAY));

  const { ticketId } = req.params;

  try {
    const query = { _id: ticketId };
    const ticketDetails = await Ticket.findOne(query)
      .populate("userDetails", "name email -_id")
      .populate("assigneeDetails", "name");

    res.status(200).json({
      success: true,
      data: ticketDetails,
      message: `Fetched ticket details successfully`,
    });
  } catch (err) {
    console.error(err);
    res.status(404).json({
      success: false,
      data: null,
      message: `Failed to fetch ticket details: ${err.message}`,
    });
  }
};

exports.createUserTicket = async (req, res, next) => {
  // Simulate delay
  await new Promise((resolve) => setTimeout(resolve, DELAY));

  let { userId } = req.params;
  const userRole = await getUserRole(userId);
  const body = req.body;
  const { title, description, category, priority, file } = body;

  if (["admin", "super-admin"].includes(userRole)) userId = body.userId;

  try {
    const ticketRecord = {
      title,
      description,
      category,
      priority,
      file,
      userDetails: userId,
      status: "Open",
      filterId: "OPEN",
      assigneeId: null,
    };

    await Ticket.create(ticketRecord);

    res.status(200).json({
      success: true,
      data: ticketRecord,
      message: `Ticket successfully created`,
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      data: null,
      message: `Ticket not created: ${err.message}`,
    });
  }
};

exports.updateUserTicket = async (req, res, next) => {
  // Simulate delay
  await new Promise((resolve) => setTimeout(resolve, DELAY));

  const { ticketId } = req.params;
  const { title, description, category, priority, file } = req.body;

  try {
    const updateQuery = { title, description, category, priority, file };
    await Ticket.findByIdAndUpdate(ticketId, updateQuery);

    res.status(200).json({
      success: true,
      data: null,
      message: `Ticket successfully updated`,
    });
  } catch (error) {
    console.error(error);
    res.status(404).json({
      success: false,
      data: null,
      message: `${err.message}`,
    });
  }
};

exports.updateUserTicketStatus = async (req, res, next) => {
  // Simulate delay
  await new Promise((resolve) => setTimeout(resolve, DELAY));

  const { userId, ticketId } = req.params;
  const { filterId } = req.body;
  const filterIdMap = {
    OPEN: "Open",
    RESOLVED: "Resolved",
    INPROCESS: "Inprocess",
  };

  try {
    const userRole = await getUserRole(userId);

    if (userRole !== "admin")
      res.status(404).json({
        success: false,
        data: null,
        message: `Your role does not allow to update ticket status`,
      });

    const updateQuery = { status: filterIdMap[filterId], filterId };
    await Ticket.findByIdAndUpdate(ticketId, updateQuery);

    res.status(200).json({
      success: true,
      data: null,
      message: `Ticket status is updated successfully`,
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      data: null,
      message: `Failed to update ticket status: ${err.message}`,
    });
  }
};

exports.updateUserTicketAssignee = async (req, res, next) => {
  // Simulate delay
  await new Promise((resolve) => setTimeout(resolve, DELAY));

  const { userId, ticketId } = req.params;
  const { assigneeId } = req.body;
  console.log(
    "🚀 ~ exports.updateUserTicketAssignee= ~ assigneeId:",
    assigneeId
  );

  try {
    const userRole = await getUserRole(userId);

    if (userRole !== "super-admin")
      res.status(404).json({
        success: false,
        data: null,
        message: `Your role does not allow to update ticket status`,
      });

    const updateQuery = { assigneeDetails: assigneeId };
    await Ticket.findByIdAndUpdate(ticketId, updateQuery);
    console.log(
      "🚀 ~ exports.updateUserTicketAssignee= ~ updateQuery:",
      updateQuery
    );

    res.status(200).json({
      success: true,
      data: null,
      message: `Ticket assignee is updated successfully`,
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      data: null,
      message: `Failed to update ticket assignee: ${err.message}`,
    });
  }
};

exports.deleteUserTicket = async (req, res, next) => {
  // Simulate delay
  await new Promise((resolve) => setTimeout(resolve, DELAY));

  const { userId, ticketId } = req.params;

  try {
    const userRole = await getUserRole(userId);

    if (userRole !== "admin")
      res.status(404).json({
        success: false,
        data: null,
        message: `Your role does not allow to delete ticket `,
      });

    await Ticket.findByIdAndDelete(ticketId);

    res.status(200).json({
      success: true,
      data: null,
      message: `Ticket status is deleted successfully`,
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      data: null,
      message: `Failed to delete ticket : ${err.message}`,
    });
  }
};
