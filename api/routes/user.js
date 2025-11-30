// routes/user.js

const express = require("express");
const {
  fetchTickets,
  createTicket,
  updateTicket,
  fetchSingleTicket,
  updateTicketStatus,
    updateResolvedAt,
    updateCreatedAt,
    addMessage,
} = require("../controllers/user.js");
const authenticateToken = require("../middleware/authorization");

const router = express.Router();

// Fetch all tickets for a user
router.get("/:user_id/tickets", authenticateToken, fetchTickets);

// Create a new ticket
router.post("/:user_id/createticket", authenticateToken, createTicket);

router.patch("/:user_id/updateticket", authenticateToken, updateTicket);
router.get("/:user_id/tickets/:ticket_id", authenticateToken, fetchSingleTicket);

router.patch("/:user_id/tickets/:ticket_id/resolvedAt", authenticateToken, updateResolvedAt);

router.patch("/:user_id/tickets/:ticket_id/createdAt", authenticateToken, updateCreatedAt);


router.patch("/:user_id/tickets/:ticket_id/status", authenticateToken, updateTicketStatus);

// Add a message to ticket logs
router.post("/:user_id/tickets/:ticket_id/logs", authenticateToken, addMessage);

module.exports = router;
