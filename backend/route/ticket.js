const express = require("express");
const { ObjectId } = require("mongodb");
const router = express.Router();
const multer = require("multer");
const upload = multer();
const fs = require("fs").promises;
const path = require("path");
const getTicketCollection = require("../config/db");
const filePath = path.join(__dirname, "../Static/ticketDetails.json");
const DELAY = 500;
const Ticket = require("../models/ticket");
const ticketController = require("../controllers/ticket");
const { authenticate } = require("../middleware/auth");

/*
upload.none() tells multer to only parse the non-file fields from the incoming multipart/form-data request.
The parsed data will be available in req.body.
*/

router.get("/all", authenticate, ticketController.getTicket);

router.get(
  "/:ticketId",
  authenticate,
  upload.none(),
  ticketController.getTicketById
);

/*
router.post(
  "/create-ticket",
  authenticate,
  upload.none(),
  ticketController.createNewTicket
);

router.patch(
  "/update-ticket/:ticketId",
  authenticate,
  upload.none(),
  async (req, res) => {
    res.end();
  }
);

router.patch(
  "/update-ticket-status/:ticketId",
  authenticate,
  upload.none(),
  async (req, res) => {
    // Simulate delay
    await new Promise((resolve) => setTimeout(resolve, DELAY));

    const { ticketId } = req.params;
    const body = req.body;
    const { filterId } = body;
     const filterIdMap = {
        OPEN: "Open",
        RESOLVED: "Resolved",
        INPROCESS: "Inprocess",
      };

    try {
      const ticketDetails = await fs.readFile(filePath, "utf8");
      const ticketDetailsJSON = JSON.parse(ticketDetails);

      const ticketIndex = ticketDetailsJSON.findIndex(
        (ticket) => ticket.ticketId == ticketId
      );

      if (ticketIndex < 0) throw Error(`Invalid ticket id : ${ticketId}`);

      const filterIdMap = {
        OPEN: "Open",
        RESOLVED: "Resolved",
        INPROCESS: "Inprocess",
      };

      ticketDetailsJSON[ticketIndex] = {
        ...ticketDetailsJSON[ticketIndex],
        filterId,
        status: filterIdMap[filterId],
      };

      await fs.writeFile(
        filePath,
        JSON.stringify(ticketDetailsJSON, null, 2),
        "utf8"
      );

      res.status(200).json({
        success: true,
        data: null,
        message: `Ticket status successfully updated`,
      });
    } catch (error) {
      console.error(err);
      res.status(404).json({
        success: false,
        data: null,
        message: `${err.message}`,
      });
    }
  }
);

router.delete("/delete-ticket/:ticketId", authenticate, async (req, res) => {
  // Simulate delay
  await new Promise((resolve) => setTimeout(resolve, DELAY));

  const { ticketId } = req.params;

  try {
    const ticketDetails = await fs.readFile(filePath, "utf8");
    const ticketDetailsJSON = JSON.parse(ticketDetails);

    const targetTicket = ticketDetailsJSON.find(
      (ticket) => ticket.ticketId == ticketId
    );

    if (!targetTicket) throw Error(`Invalid ticket id : ${ticketId}`);

    const tempTicketDetailsJSON = ticketDetailsJSON.filter(
      (ticket) => ticket.ticketId != ticketId
    );

    await fs.writeFile(
      filePath,
      JSON.stringify(tempTicketDetailsJSON, null, 2),
      "utf8"
    );

    res.status(200).json({
      success: true,
      data: null,
      message: `Ticket successfully deleted`,
    });
  } catch (err) {
    console.error(err);
    res.status(404).json({
      success: false,
      data: null,
      message: `${err.message}`,
    });
  }
});
*/
module.exports = router;
