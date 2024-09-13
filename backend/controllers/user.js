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
    const userDetails = await User.findById(userId, {
      _id: 0,
      name: 1,
      email: 1,
    });

    res.status(200).json({
      success: true,
      data: userDetails,
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

exports.getAllTicketOverview = async (req, res, next) => {
  // Simulate delay
  await new Promise((resolve) => setTimeout(resolve, DELAY));

  const { userId } = req.params;

  try {
    const userRole = await getUserRole(userId);

    if (!["SUPER_ADMIN"].includes(userRole)) {
      return res.status(403).json({
        success: false,
        data: null,
        message: "Your role does not allow you to view tickets",
      });
    }

    // Aggregation pipeline to get ticket overview
    const overview = await Ticket.aggregate([
      {
        $facet: {
          // 1. Count of assigned tickets (assigneeDetails exists)
          assignedTickets: [
            { $match: { assigneeDetails: { $ne: null } } }, // assigneeDetails is not null
            { $count: "assignedTickets" },
          ],
          // 2. Count of not assigned tickets (assigneeDetails is null)
          notAssignedTickets: [
            { $match: { assigneeDetails: null } }, // assigneeDetails is null
            { $count: "notAssignedTickets" },
          ],
          // 3. Breakdown of tickets by status
          statusBreakdown: [
            {
              $group: {
                _id: "$status", // Group by the 'status' field
                count: { $sum: 1 }, // Count the number of tickets per status
              },
            },
          ],
        },
      },
      {
        $project: {
          assignedTickets: {
            $arrayElemAt: ["$assignedTickets.assignedTickets", 0],
          }, // Get the assigned tickets count
          notAssignedTickets: {
            $arrayElemAt: ["$notAssignedTickets.notAssignedTickets", 0],
          }, // Get the not assigned tickets count
          statusBreakdown: 1,
        },
      },
    ]);

    // Handle the results from the aggregation
    const ticketData = {
      assignedTickets: overview[0].assignedTickets || 0, // Default to 0 if no assigned tickets
      notAssignedTickets: overview[0].notAssignedTickets || 0, // Default to 0 if no not assigned tickets
      open: 0,
      resolved: 0,
      inprocess: 0,
    };

    // Loop through status breakdown and map status to the response object
    overview[0].statusBreakdown.forEach((status) => {
      if (status._id === "Open") ticketData.open = status.count;
      if (status._id === "Resolved") ticketData.resolved = status.count;
      if (status._id === "Inprocess") ticketData.inprocess = status.count;
    });

    // Send the overview response
    res.status(200).json({
      success: true,
      data: ticketData,
      message: "Fetched ticket overview successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      data: null,
      message: `Failed to fetch tickets overview: ${error.message}`,
    });
  }
};

exports.getUsersEmailAndIdList = async (req, res, next) => {
  // Simulate delay
  await new Promise((resolve) => setTimeout(resolve, DELAY));

  const { userId } = req.params;

  try {
    const userRole = await getUserRole(userId);

    if (!["ADMIN", "SUPER_ADMIN"].includes(userRole))
      res.status(404).json({
        success: false,
        data: null,
        message: `Your role does not allow to update ticket status`,
      });

    // Get the collection object and get the record
    const usersEmailAndIdList = await User.find(
      { role: "USER" },
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

    if (!["SUPER_ADMIN", "ADMIN"].includes(userRole))
      res.status(404).json({
        success: false,
        data: null,
        message: `Your role does not allow to fetch admin details`,
      });

    // Get the collection object and get the record
    const assignedAdminDetails = await Ticket.aggregate([
      {
        // Match only assigned tickets
        $match: {
          assigneeDetails: { $ne: null },
        },
      },
      {
        // Group by admin (assigneeDetails), and count tickets per status
        $group: {
          _id: "$assigneeDetails",
          open: { $sum: { $cond: [{ $eq: ["$status", "Open"] }, 1, 0] } },
          resolve: {
            $sum: { $cond: [{ $eq: ["$status", "Resolved"] }, 1, 0] },
          },
          inProcess: {
            $sum: { $cond: [{ $eq: ["$status", "Inprocess"] }, 1, 0] },
          },
        },
      },
      {
        // Lookup admin details from the admin collection using _id
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "adminDetails",
        },
      },
      {
        // Unwind the adminDetails array to get the admin information
        $unwind: "$adminDetails",
      },
      {
        // Project the result in the desired format
        $project: {
          _id: 1,
          email: "$adminDetails.email",
          name: "$adminDetails.name",
          open: 1,
          resolve: 1,
          inProcess: 1,
        },
      },
    ]);

    const allAdmins = await User.find(
      { role: "ADMIN" },
      { _id: 1, name: 1, email: 1 }
    );

    const unassignedAdminDetails = allAdmins.filter((admin) => {
      return !assignedAdminDetails.some((assignedAdmin) =>
        admin._id.equals(assignedAdmin._id)
      );
    });

    const allAdminDetails = [
      ...assignedAdminDetails,
      ...unassignedAdminDetails.map((admin) => ({
        _id: admin._id,
        email: admin.email,
        name: admin.name,
        open: 0,
        resolve: 0,
        inProcess: 0,
      })),
    ];

    res.status(200).json({
      success: true,
      data: allAdminDetails,
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

exports.getSuperAdminDetails = async (req, res, next) => {
  // Simulate delay
  await new Promise((resolve) => setTimeout(resolve, DELAY));

  const { userId } = req.params;

  try {
    const userRole = await getUserRole(userId);

    if (!["SUPER_ADMIN"].includes(userRole))
      res.status(404).json({
        success: false,
        data: null,
        message: `Your role does not allow to fetch super admin details`,
      });

    // Get the collection object and get the record
    const superAdminDetails = await User.findOne(
      { role: "SUPER_ADMIN" },
      { email: 1, name: 1 }
    );

    res.status(200).json({
      success: true,
      data: superAdminDetails,
      message: `Fetched super admin details successfully`,
    });
  } catch (err) {
    console.error(err);
    res.status(404).json({
      success: false,
      data: null,
      message: `Failed to fetch super admin details : ${err.message}`,
    });
  }
};

exports.getUserTickets = async (req, res, next) => {
  // Simulate delay
  await new Promise((resolve) => setTimeout(resolve, DELAY));
  const { userId } = req.params;
  try {
    const userRole = await getUserRole(userId);
    const query = ["SUPER_ADMIN"].includes(userRole)
      ? null
      : ["ADMIN"].includes(userRole)
      ? { assigneeDetails: userId }
      : { userDetails: userId };

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
  } finally {
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

  if (["ADMIN", "SUPER_ADMIN"].includes(userRole)) userId = body.userId;

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

    if (!["ADMIN", "SUPER_ADMIN"].includes(userRole))
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

  try {
    const userRole = await getUserRole(userId);

    if (!["SUPER_ADMIN"].includes(userRole))
      res.status(404).json({
        success: false,
        data: null,
        message: `Your role does not allow to update ticket status`,
      });

    const updateQuery = { assigneeDetails: assigneeId };

    await Ticket.findByIdAndUpdate(ticketId, updateQuery);

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

    if (!["SUPER_ADMIN"].includes(userRole))
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
