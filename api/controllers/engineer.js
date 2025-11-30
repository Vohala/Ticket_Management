const Ticket = require("../models/ticketModel");

const fetchEngineerTickets = async (req, res) => {
  try {
    const { user_id } = req.params;

    if (user_id !== req.userId) {
      return res.sendStatus(403);
    }

    // complete this function to return all the tickets that have an assigned engineer as the logged in engineer. Will assigning, save the user_id of the assigned engineer in the ticket.
    const tickets = await Ticket.find({ assignedEngineer: user_id });
    res.json({ status: 200, tickets });
  } catch (err) {
    res.json({ err });
  }
};

const addMessage = async (req, res) => {
  const { user_id } = req.params;
  const { ticket_id } = req.params;
  const { userRole, textMessage } = req.body;

  if (user_id !== req.userId) {
    return res.sendStatus(403);
  }

  const updatedTicket = await Ticket.findOneAndUpdate(
    { id: ticket_id },
    {
      $push: {
        logs: {
          timestamp: Date.now(),
          userRole: userRole,
          message: textMessage,
        },
      },
    },
    { new: true } // This option returns the updated ticket after the update
  );
  // console.log(ticket.logs);
  res.json({ status: 200 });
};

module.exports = { fetchEngineerTickets, addMessage };
