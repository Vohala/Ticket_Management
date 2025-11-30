const Ticket = require("../models/ticketModel");
const UserData = require("../models/userModel");
const CsvParser = require("json2csv").Parser;


const fetchTickets = async (req, res) => {
  try {
    const { user_id } = req.params;

    if (user_id !== req.userId) {
      return res.sendStatus(403);
    }

    // Fetch all users tickets from the database
    const tickets = await Ticket.find();
    res.json({ status: 200, tickets });
  } catch (error) {
    res.json({ status: "error", error: "Failed to fetch tickets" });
  }
};

const exportTickets = async (req, res) => {
    try {
        const { user_id } = req.params;
        const { start, end, duration } = req.query;

        if (user_id !== req.userId) {
            return res.sendStatus(403);
        }

        let startDate, endDate;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (duration === "all") {
            startDate = new Date('2023-01-01');
            endDate = new Date('2029-01-01');
        } else if (duration === "day") {
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            startDate = today;
            endDate = tomorrow;
        } else if (duration === "month") {
            const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
            const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
            startDate = startOfMonth;
            endDate = endOfMonth;
        } else if (start && end) {
            startDate = new Date(start);
            endDate = new Date(end);
            endDate.setDate(endDate.getDate() + 1);
        } else {
            return res.status(400).send('Invalid date range or duration');
        }
        endDate.setHours(23, 59, 59, 999);

        const ticketsByRange = await Ticket.find({
            createdAt: { $gte: startDate, $lte: endDate },
        });

        // Convert the createdAt field to IST format
        const ticketHeaders = ticketsByRange.map(ticket => {
            const {
                createdAt,
                companyName,
                name,
                email,
                phoneNumber,
                landlineNumber,
                department,
                issue,
                priority,
                Problem,
                AMC,
                partName,
                ServiceType,
                resolved,
                assignedEngineer,
                resolvedDateTime,
                remarks
            } = ticket;

            // Convert createdAt to IST
            const createdAtIST = new Date(createdAt).toLocaleString("en-IN", {
                timeZone: "Asia/Kolkata",
                dateStyle: "short",
                timeStyle: "short",
            });

            return {
                createdAt: createdAtIST, // Replace with IST formatted date
                companyName,
                name,
                email,
                phoneNumber,
                landlineNumber,
                department,
                issue,
                priority,
                Problem,
                AMC,
                partName,
                ServiceType,
                resolved,
                assignedEngineer,
                resolvedDateTime,
                remarks,
            };
        });

        const csvFields = [
            "createdAt",
            "Company Name",
            "Name",
            "Email",
            "Phone",
            "Location",
            "Department",
            "Issue",
            "priority",
            "Problem",
            "AMC",
            "partName",
            "ServiceType",
            "Assigned Engineer",
            "Resolved",
            "resolvedDateTime",
            "Remarks"
        ];
        const csvParser = new CsvParser({ csvFields });
        const csvData = csvParser.parse(ticketHeaders);

        const filename = duration ? `tickets_${duration}.csv` : `tickets_${startDate.toISOString()}_to_${endDate.toISOString()}.csv`;
        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
        res.status(200).end(csvData);
    } catch (err) {
        res.json({ status: 400, error: err.message });
    }
};


	
const fetchEngineers = async (req, res) => {
  try {
    const { user_id } = req.params;

    if (user_id !== req.userId) {
      return res.sendStatus(403);
    }

    // Fetch all users tickets from the database
    const engineers = await UserData.find({ role: "engineer" });
    res.json({ status: 200, engineers });
  } catch (error) {
    res.json({ status: "error", error: "Failed to fetch engineers" });
  }
};

const assignRole = async (req, res) => {
  const { user_id } = req.params;

  if (user_id !== req.userId) {
    return res.sendStatus(403);
  }
  // Find user who matches the email address and set to engineer
  const user = await UserData.findOneAndUpdate(
    { email: req.body.email },
    { role: "engineer" },
    { new: true }
  );
  if (!user) {
    return res.json({ status: 501, text: "User not found" });
  }
  return res.json({ status: 200 });
};

const setEngineer = async (req, res) => {
  const { user_id } = req.params;
  const { ticket_id } = req.params;
  if (user_id !== req.userId) {
    return res.sendStatus(403);
  }

  const ticket = await Ticket.findOneAndUpdate(
    { id: ticket_id },
    { assignedEngineer: req.body.engineerId },
    { new: true }
  );
  if (!ticket) {
    return res.json({ status: 501, text: "Error in assigning engineer" });
  }
  return res.json({ status: 200 });
};

const acceptTicket = async (req, res) => {
  const { user_id } = req.params;
  const { ticket_id } = req.params;
  if (user_id !== req.userId) {
    return res.sendStatus(403);
  }

  const ticket = await Ticket.findOneAndUpdate(
    { id: ticket_id },
    { accepted: 1 },
    { new: true }
  );

  if (!ticket) {
    return res.json({ status: 501, text: "Error in accepting the ticket." });
  }
  return res.json({ status: 200 });
};

const setPriority = async (req, res) => {
  const { user_id } = req.params;
  const { ticket_id } = req.params;
  const { priority } = req.body;
  if (user_id !== req.userId) {
    return res.sendStatus(403);
  }

  const ticket = await Ticket.findOneAndUpdate(
    { id: ticket_id },
    { priority: priority },
    { new: true }
  );

  if (!ticket) {
    return res.json({ status: 501, text: "Error in setting priority." });
  }
  return res.json({ status: 200 });
};

const setProblem = async (req, res) => {
  const { user_id } = req.params;
  const { ticket_id } = req.params;
  const { Problem } = req.body;
  if (user_id !== req.userId) {
    return res.sendStatus(403);
  }

  const ticket = await Ticket.findOneAndUpdate(
    { id: ticket_id },
    { Problem: Problem },
    { new: true }
  );

  if (!ticket) {
    return res.json({ status: 501, text: "Error in setting Problem." });
  }
  return res.json({ status: 200 });
};


const setServiceType = async (req, res) => {
  const { user_id } = req.params;
  const { ticket_id } = req.params;
  const { ServiceType } = req.body;
  if (user_id !== req.userId) {
    return res.sendStatus(403);
  }

  const ticket = await Ticket.findOneAndUpdate(
    { id: ticket_id },
    { ServiceType: ServiceType },
    { new: true }
  );

  if (!ticket) {
    return res.json({ status: 501, text: "Error in setting ServiceType." });
  }
  return res.json({ status: 200 });
};



const setAMC = async (req, res) => {
  const { user_id } = req.params;
  const { ticket_id } = req.params;
  const { AMC } = req.body;
  if (user_id !== req.userId) {
    return res.sendStatus(403);
  }

  const ticket = await Ticket.findOneAndUpdate(
    { id: ticket_id },
    { AMC: AMC},
    { new: true }
  );

  if (!ticket) {
    return res.json({ status: 501, text: "Error in setting AMC." });
  }
  return res.json({ status: 200 });
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
  //console.log(ticket.logs);
  res.json({ status: 200 });
};


const updatePartName = async (req, res) => {
  const { user_id, ticket_id } = req.params;
  const { partName } = req.body;

  try {
    // Find the ticket by ID and update the partName field
    const updatedTicket = await Ticket.findOneAndUpdate(
      { id: ticket_id }, // or any other unique identifier field
      { partName: partName }, // Update the part name field
      { new: true } // Return the updated ticket
    );

    if (!updatedTicket) {
      return res.status(404).json({ status: 404, error: "Ticket not found" });
    }

    return res.status(200).json({ status: 200, ticket: updatedTicket });
  } catch (error) {
    return res.status(500).json({ status: 500, error: "Internal server error" });
  }
};




const deleteTicket = async (req, res) => {
  const { user_id, ticket_id } = req.params;
  if (user_id !== req.userId) {
    return res.sendStatus(403);
  }

  const ticket = await Ticket.findOneAndDelete({ id: ticket_id });

  if (!ticket) {
    res.json({ status: 401 });
  }
  res.json({ status: 200 });
};



const markTicketAsSolved = async (req, res) => {
  const { ticket_id } = req.params;
  const solvedAt = new Date(); // Current date and time

  try {
    const updatedTicket = await Ticket.findOneAndUpdate(
      { _id: ticket_id }, // Assuming you're using MongoDB's default _id field
      { resolved: true, solvedAt: solvedAt },
      { new: true }
    );

    if (!updatedTicket) {
      return res.status(404).json({ status: "error", error: "Ticket not found" });
    }

    res.json({ status: 200, ticket: updatedTicket });
  } catch (error) {
    res.status(500).json({ status: "error", error: "Failed to mark ticket as solved" });
  }
};






module.exports = {
  fetchTickets,
  exportTickets,
  fetchEngineers,
  assignRole,
  setEngineer,
  acceptTicket,
  setPriority,
  setProblem,
  setServiceType,
  setAMC,
  addMessage,
  updatePartName,
  deleteTicket,
  markTicketAsSolved,
};
