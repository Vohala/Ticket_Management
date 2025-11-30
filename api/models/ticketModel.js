// models/ticketModel.js

const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // Ensures uniqueness
  byUser: { type: Number, required: true },
  name: { type: String, required: true },
  companyName: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  landlineNumber: String,
  department: { type: String },
  issue: String,
  classification: { type: String, default: "" }, // Added if used in controller
  channel: String,
  remarks: String,
  createdAt: { type: Date, default: Date.now },
  solvedAt: { type: Date },
  resolved: { type: Boolean, default: false },
  priority: { type: String, default: "low" },
  Problem: { type: String, default: "" },
  ServiceType: { type: String, default: "" },
  AMC: { type: String, default: "" },
  assignedEngineer: String,
  accepted: { type: Number, default: 0 },
  logs: [
    {
      timestamp: {
        type: Date,
        default: Date.now, // Function reference without parentheses
      },
      userRole: { type: String, required: true },
      message: String,
    },
  ],
  partName: String,
});

const Ticket = mongoose.model("Ticket", ticketSchema);

module.exports = Ticket;
