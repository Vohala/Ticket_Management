const express = require("express");
const {
  fetchEngineerTickets,
  addMessage,
} = require("../controllers/engineer.js");
const authenticateToken = require("../middleware/authorization");

const router = express.Router();

router.get("/:user_id/tickets", authenticateToken, fetchEngineerTickets);
router.put(
  "/:user_id/ticket/:ticket_id/add_message",
  authenticateToken,
  addMessage
);

module.exports = router;
