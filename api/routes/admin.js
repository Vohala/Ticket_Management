const express = require("express");
const {
  fetchTickets,
  assignRole,
  fetchEngineers,
  setEngineer,
  acceptTicket,
  setPriority,
  setProblem,
  setServiceType,
  setAMC,
  addMessage,
  deleteTicket,
  updatePartName,
  exportTickets,
  markTicketAsSolved,
  
} = require("../controllers/admin.js");
const authenticateToken = require("../middleware/authorization");

const router = express.Router();

router.get("/:user_id/tickets", authenticateToken, fetchTickets);
router.get("/:user_id/export_tickets", authenticateToken, exportTickets);
router.get("/:user_id/engineers", authenticateToken, fetchEngineers);
router.put("/:user_id/create_engineer", authenticateToken, assignRole);
router.put(
  "/:user_id/ticket/:ticket_id/set_engineer",
  authenticateToken,
  setEngineer
);
router.put(
  "/:user_id/ticket/:ticket_id/accept_ticket",
  authenticateToken,
  acceptTicket
);
router.put(
  "/:user_id/ticket/:ticket_id/set_priority",
  authenticateToken,
  setPriority
);
router.put(
  "/:user_id/ticket/:ticket_id/set_Problem",
  authenticateToken,
  setProblem
);
router.put(
  "/:user_id/ticket/:ticket_id/set_ServiceType",
  authenticateToken,
  setServiceType
);

router.put(
  "/:user_id/ticket/:ticket_id/set_AMC",
  authenticateToken,
  setAMC
);


router.put(
  "/:user_id/ticket/:ticket_id/add_message",
  authenticateToken,
  addMessage
);

router.put(
  "/:user_id/ticket/:ticket_id/update_partName", // Define the route path
  authenticateToken,
  updatePartName // Connect to the controller function
);

router.delete(
  "/:user_id/ticket/:ticket_id/delete_ticket",
  authenticateToken,
  deleteTicket
);


router.put("/:user_id/ticket/:ticket_id/solvedAt", 
authenticateToken,
markTicketAsSolved);



module.exports = router;
