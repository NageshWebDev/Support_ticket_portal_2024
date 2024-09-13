const express = require("express");
const { authenticate } = require("../middleware/auth");
const { checkBlacklist } = require("../middleware/checkBlackList");
const multer = require("multer");
const router = express.Router();
const upload = multer();
const {
  getUserById,
  getUsersEmailAndIdList,
  getAdminEmailAndIdList,
  getSuperAdminDetails,
  getAllTicketOverview,
  getUserTickets,
  getUserTicket,
  createUserTicket,
  updateUserTicket,
  updateUserTicketStatus,
  updateUserTicketAssignee,
  deleteUserTicket,
} = require("../controllers/user");

router.get("/:userId", checkBlacklist, authenticate, getUserById);

router.get(
  "/:userId/all-ticket-overview",
  checkBlacklist,
  authenticate,
  getAllTicketOverview
);

router.get(
  "/:userId/get-users",
  checkBlacklist,
  authenticate,
  getUsersEmailAndIdList
);

router.get(
  "/:userId/get-super-admin",
  checkBlacklist,
  authenticate,
  getSuperAdminDetails
);

router.get(
  "/:userId/get-admin",
  checkBlacklist,
  authenticate,
  getAdminEmailAndIdList
);

router.get(
  "/:userId/get-tickets",
  checkBlacklist,
  authenticate,
  getUserTickets
);

router.get(
  "/:userId/get-ticket/:ticketId",
  checkBlacklist,
  authenticate,
  getUserTicket
);

router.post(
  "/:userId/create-ticket",
  checkBlacklist,
  authenticate,
  upload.none(),
  createUserTicket
);

router.put(
  "/:userId/update-ticket/:ticketId",
  checkBlacklist,
  authenticate,
  upload.none(),
  updateUserTicket
);

router.patch(
  "/:userId/update-ticket-status/:ticketId",
  checkBlacklist,
  authenticate,
  upload.none(),
  updateUserTicketStatus
);

router.patch(
  "/:userId/update-ticket-assignee/:ticketId",
  checkBlacklist,
  authenticate,
  upload.none(),
  updateUserTicketAssignee
);

router.delete(
  "/:userId/delete-ticket/:ticketId",
  checkBlacklist,
  authenticate,
  deleteUserTicket
);

module.exports = router;
