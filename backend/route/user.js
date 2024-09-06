const express = require("express");
const { authenticate } = require("../middleware/auth");
const router = express.Router();
const multer = require("multer");
const upload = multer();
const {
  getUserById,
  getUsersEmailAndIdList,
  getAdminEmailAndIdList,
  getUserTickets,
  getUserTicket,
  createUserTicket,
  updateUserTicket,
  updateUserTicketStatus,
  updateUserTicketAssignee,
  deleteUserTicket,
} = require("../controllers/user");

router.get("/:userId", authenticate, getUserById);

router.get("/:userId/get-users", authenticate, getUsersEmailAndIdList);

router.get("/:userId/get-admin", authenticate, getAdminEmailAndIdList);

router.get("/:userId/get-tickets", authenticate, getUserTickets);

router.get("/:userId/get-ticket/:ticketId", authenticate, getUserTicket);

router.post(
  "/:userId/create-ticket",
  authenticate,
  upload.none(),
  createUserTicket
);

router.put(
  "/:userId/update-ticket/:ticketId",
  authenticate,
  upload.none(),
  updateUserTicket
);

router.patch(
  "/:userId/update-ticket-status/:ticketId",
  authenticate,
  upload.none(),
  updateUserTicketStatus
);

router.patch(
  "/:userId/update-ticket-assignee/:ticketId",
  authenticate,
  upload.none(),
  updateUserTicketAssignee
);

router.delete(
  "/:userId/delete-ticket/:ticketId",
  authenticate,
  deleteUserTicket
);

module.exports = router;
