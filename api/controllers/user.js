// controllers/user.js

const Ticket = require("../models/ticketModel");
const { v4: uuidv4 } = require("uuid");

// Fetch all tickets for a user
const fetchTickets = async (req, res) => {
  try {
    const { user_id } = req.params;

    // Verify user authorization
    if (user_id !== req.userId) {
      return res.sendStatus(403); // Forbidden
    }

    // Fetch tickets from the database
    const tickets = await Ticket.find({ byUser: user_id });
    res.json({ status: 200, tickets });
  } catch (error) {
    console.error("Error fetching tickets:", error);
    res.status(500).json({ status: "error", error: "Failed to fetch tickets" });
  }
};

const createTicket = async (req, res) => {
    try {
        console.log("Request received:", req.body); // Log incoming request

        const { user_id } = req.params;
        const newId = uuidv4();

        if (user_id !== req.userId) {
            return res.sendStatus(403); // Forbidden if user ID doesn't match
        }

        const {
            name,
            companyName,
            email,
            email1,
            phoneNumber,
            landlineNumber,
            department,
            issue,
            classification,
            channel,
            remarks,
            resolved,
            priority,
            Problem,
            assignedEngineer,
        } = req.body;

        console.log("Data to be saved:", { name, email, phoneNumber, department }); // Log to confirm all fields are coming correctly

        // Create a new ticket document
        const ticket = new Ticket({
            id: newId,
            byUser: user_id,
            name,
            companyName,
            email,
            email1,
            phoneNumber,
            landlineNumber,
            department,
            issue,
            classification,
            channel,
            remarks,
            resolved,
            priority,
            Problem,
            assignedEngineer,
        });
        // Save the ticket to the database
        await ticket.save();
        console.log("Ticket saved successfully"); // Log after successful save

        res.json({ status: 200 });
    } catch (error) {
        console.error("Error creating ticket:", error); // Log the error
        res.status(500).json({ status: "error", error: "Failed to create ticket" });
    }
};

// Update an existing ticket (partial update)
const updateTicket = async (req, res) => {
  try {
    const { user_id, ticket_id } = req.params;

    // Verify user authorization
    if (user_id !== req.userId) {
      return res.sendStatus(403); // Forbidden
    }

    const {
      name,
      companyName,
      email,
      phoneNumber,
      landlineNumber,
      department,
      issue,
      classification, // Ensure this field exists in your schema if used
      channel,
      remarks,
      resolved,
      priority,
      Problem,
      AMC,
      accepted,
      ServiceType,
      assignedEngineer,
      partName,
    } = req.body;

    // Update the ticket in the database
    const existingTicket = await Ticket.findOneAndUpdate(
      { id: ticket_id },
      {
        name,
        companyName,
        email,
        phoneNumber,
        landlineNumber,
        department,
        issue,
        classification, // Ensure this field exists in your schema if used
        channel,
        remarks,
        resolved,
        priority,
        Problem,
        AMC,
        accepted,
        ServiceType,
        assignedEngineer,
        partName,
      },
      { new: true }
    );

    if (!existingTicket) {
      return res.status(404).json({ status: "error", error: "Ticket not found" });
    }

    res.json({ status: 200, ticket: existingTicket });
  } catch (error) {
    console.error("Error updating ticket:", error);
    res.status(500).json({ status: "error", error: "Failed to update ticket" });
  }
};

// Fetch a single ticket
const fetchSingleTicket = async (req, res) => {
  try {
    const { user_id, ticket_id } = req.params;

    // Verify user authorization
    if (user_id !== req.userId) {
      return res.sendStatus(403); // Forbidden
    }

    // Fetch the ticket from the database
    const ticket = await Ticket.findOne({ id: ticket_id });

    if (!ticket) {
      return res.status(404).json({ status: "error", error: "Ticket not found" });
    }

    res.json({ status: 200, ticket });
  } catch (err) {
    console.error("Error fetching single ticket:", err);
    res.status(500).json({ status: "error", error: "Failed to fetch the ticket" });
  }
};

// Update ticket's resolved status and solvedAt timestamp
const updateTicketStatus = async (req, res) => {
  try {
    const { user_id, ticket_id } = req.params;

    // Verify user authorization
    if (user_id !== req.userId) {
      return res.sendStatus(403); // Forbidden
    }

    const { resolved } = req.body;

    // Validate the 'resolved' field
    if (typeof resolved !== 'boolean') {
      return res.status(400).json({ status: "error", error: "'resolved' must be a boolean." });
    }

    // Prepare the update object
    let update = { resolved };

    if (resolved) {
      update.solvedAt = new Date();
    } else {
      update.solvedAt = null;
    }

    // Update the ticket in the database
    const updatedTicket = await Ticket.findOneAndUpdate(
      { id: ticket_id },
      update,
      { new: true }
    );

    if (!updatedTicket) {
      return res.status(404).json({ status: "error", error: "Ticket not found" });
    }

    res.json({ status: 200, ticket: updatedTicket });
  } catch (err) {
    console.error("Error updating ticket status:", err);
    res.status(500).json({ status: "error", error: "Failed to update ticket status" });
  }
};

// Add a message to ticket logs
const addMessage = async (req, res) => {
  try {
    const { user_id, ticket_id } = req.params;
    const { userRole, textMessage } = req.body;

    // Verify user authorization
    if (user_id !== req.userId) {
      return res.sendStatus(403); // Forbidden
    }

    // Validate input
    if (!userRole || !textMessage) {
      return res.status(400).json({ status: "error", error: "Missing userRole or textMessage." });
    }

    // Update the ticket's logs
    const updatedTicket = await Ticket.findOneAndUpdate(
      { id: ticket_id },
      {
        $push: {
          logs: {
            timestamp: new Date(),
            userRole: userRole,
            message: textMessage,
          },
        },
      },
      { new: true }
    );

    if (!updatedTicket) {
      return res.status(404).json({ status: "error", error: "Ticket not found" });
    }

    res.json({ status: 200, ticket: updatedTicket });
  } catch (err) {
    console.error("Error adding message to ticket:", err);
    res.status(500).json({ status: "error", error: "Failed to add message to ticket" });
  }
};

const updateResolvedAt = async (req, res) => {
    try {
        const { user_id, ticket_id } = req.params;
        const { newResolvedAt } = req.body;

        if (user_id !== req.userId) {
            return res.sendStatus(403); // Forbidden
        }

        const updatedTicket = await Ticket.findOneAndUpdate(
            { id: ticket_id },
            { solvedAt: new Date(newResolvedAt) },
            { new: true }
        );

        if (!updatedTicket) {
            return res.status(404).json({ status: "error", error: "Ticket not found" });
        }

        res.json({ status: 200, ticket: updatedTicket });
    } catch (error) {
        console.error("Error updating resolved at:", error);
        res.status(500).json({ status: "error", error: "Failed to update resolved at" });
    }
};

const updateCreatedAt = async (req, res) => {
    try {
        const { user_id, ticket_id } = req.params;
        const { newCreatedAt } = req.body;

        if (user_id !== req.userId) {
            return res.sendStatus(403); // Forbidden
        }

        const updatedTicket = await Ticket.findOneAndUpdate(
            { id: ticket_id },
            { createdAt: new Date(newCreatedAt) },
            { new: true }
        );

        if (!updatedTicket) {
            return res.status(404).json({ status: "error", error: "Ticket not found" });
        }

        res.json({ status: 200, ticket: updatedTicket });
    } catch (error) {
        console.error("Error updating created at:", error);
        res.status(500).json({ status: "error", error: "Failed to update created at" });
    }
};



module.exports = {
  fetchTickets,
  createTicket,
  updateTicket,
  fetchSingleTicket,
  updateTicketStatus,
  addMessage,
  updateResolvedAt,
  updateCreatedAt,
};
