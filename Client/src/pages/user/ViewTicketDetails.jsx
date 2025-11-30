import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Autocomplete from "../../components/Autocomplete";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TextModal from "../../components/TextModal";
import CreateUpdateTicket from "../../components/CreateUpdateTicket";

const ViewTicketDetails = () => {
    const { user_id, ticket_id } = useParams();
    const navigate = useNavigate();

    // State Variables
    const [ticket, setTicket] = useState({});
    const [status, setStatus] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [engineerId, setEngineerId] = useState("");
    const [engineerName, setEngineerName] = useState("");
    const [engineerInfo, setEngineerInfo] = useState([]);
    const [nameForAE, setNameForAE] = useState("");
    const [selectedPriority, setSelectedPriority] = useState("set priority");
    const [selectedProblem, setSelectedProblem] = useState("set Problem");
    const [selectedServiceType, setSelectedServiceType] = useState("set ServiceType");
    const [selectedAMC, setSelectedAMC] = useState("set AMC");
    const [showLogs, setShowLogs] = useState(false);
    const [textMessage, setTextMessage] = useState("");
    const [updateTicket, setUpdateTicket] = useState(false);
    const [partName, setPartName] = useState("");

    // New State Variables for Editing Dates
    const [showEditDateModal, setShowEditDateModal] = useState(false);
    const [showEditCreatedAtModal, setShowEditCreatedAtModal] = useState(false);
    const [newResolvedAt, setNewResolvedAt] = useState("");
    const [newCreatedAt, setNewCreatedAt] = useState("");

    // Determine User Role
    const userRole = localStorage.getItem("role");
    const getRole = () => {
        if (userRole === "9087-t1-vaek-123-riop") {
            return "admin";
        } else if (userRole === "2069-t2-prlo-456-fiok") {
            return "engineer";
        } else if (userRole === "4032-t3-raek-789-chop") {
            return "user";
        }
        return "user"; // Default role
    };

    // Handlers
    const handlePartNameChange = (e) => {
        setPartName(e.target.value);
    };

    const handleSubmitPartName = async () => {
        try {
            const res = await axios.put(
                `/api/admin/${user_id}/ticket/${ticket_id}/update_partName`,
                { partName },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            const data = await res.data;
            if (data.status === 200) {
                toast.success(`The part name has been set to ${partName}. Refresh page to see changes.`);
                setPartName("");
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleInputChange = (value) => {
        setEngineerId(value[1]);
        setEngineerName(value[0]);
    };

    // Fetch Ticket Details
    useEffect(() => {
        let isMounted = true;

        const fetchTicketDetails = async () => {
            try {
                const res = await axios.get(
                    `/api/user/${user_id}/tickets/${ticket_id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );
                const ticketData = res.data.ticket;
                if (isMounted) {
                    setTicket(ticketData);
                    setStatus(ticketData.resolved);
                    setNameForAE(ticketData.assignedEngineerName || "");
                }
            } catch (error) {
                console.error("Error fetching ticket details:", error);
                toast.error("Failed to fetch ticket details.");
            }
        };

        fetchTicketDetails();

        return () => {
            isMounted = false;
        };
    }, [user_id, ticket_id]);

    // Fetch Engineers (Only for Admin)
    useEffect(() => {
        const fetchEngineers = async () => {
            try {
                const res = await axios.get(
                    `/api/admin/${user_id}/engineers`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );
                const data = res.data;
                if (data.status === 200) {
                    const engineerList = data.engineers;
                    const engineerInfoScope = engineerList.map((engineer) => [
                        engineer.name,
                        engineer.userId,
                    ]);
                    setEngineerInfo(engineerInfoScope);
                    const assignedEngineerToSet = engineerInfoScope.find(
                        (engineer) => engineer[1] === ticket.assignedEngineer
                    );

                    const assignedEngineerName = assignedEngineerToSet
                        ? assignedEngineerToSet[0]
                        : null;
                    setNameForAE(assignedEngineerName);
                }
            } catch (err) {
                console.error(err);
                toast.error("Failed to fetch engineers.");
            }
        };

        if (getRole() === "admin") {
            fetchEngineers();
        }
    }, [user_id, ticket.assignedEngineer, ticket]);

    // Handle Status Update
    const markAsSolved = async () => {
        try {
            const newStatus = !status; // Toggle status
            const res = await axios.patch(
                `/api/user/${user_id}/tickets/${ticket_id}/status`,
                { resolved: newStatus },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            const data = res.data;
            if (data.status === 200) {
                toast.success(
                    `Ticket marked as ${newStatus ? "Resolved" : "Unresolved"} successfully.`
                );
                setTicket(data.ticket);
                setStatus(data.ticket.resolved);
            } else {
                toast.error("Failed to update ticket status.");
            }
        } catch (error) {
            console.error("Error updating ticket status:", error);
            toast.error("Error updating ticket status.");
        }
    };

    const handleAssignEngineer = async () => {
        setShowModal(true);
        try {
            const res = await axios.get(
                `/api/admin/${user_id}/engineers`,
                {},
                {
                    headers: {
                        "Content-Type": "application/json",
                        // Authorization: `Bearer ${cookies.token}`,
                    },
                }
            );
            const data = await res.data;
            if (data.status === 200) {
                const engineerList = data.engineers;
                const engineerInfoScope = engineerList.map((engineer) => [
                    engineer.name,
                    engineer.userId,
                ]);
                setEngineerInfo(engineerInfoScope);
                // console.log(JSON.parse(localStorage.getItem("engineers")));
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleResolvedAtChange = (e) => {
        setNewResolvedAt(e.target.value);
    };

    const submitNewResolvedAt = async () => {
        try {
            const res = await axios.patch(
                `/api/user/${user_id}/tickets/${ticket_id}/resolvedAt`,
                { newResolvedAt },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            const data = await res.data;
            if (data.status === 200) {
                toast.success("Resolved date has been updated.");
                setTicket((prev) => ({ ...prev, solvedAt: newResolvedAt }));
                setShowEditDateModal(false);
            }
        } catch (error) {
            console.error("Error updating resolved date:", error);
            toast.error("Failed to update resolved date.");
        }
    };

    const handleCreatedAtChange = (e) => {
        setNewCreatedAt(e.target.value);
    };

    const submitNewCreatedAt = async () => {
        try {
            const res = await axios.patch(
                `/api/user/${user_id}/tickets/${ticket_id}/createdAt`,
                { newCreatedAt },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            const data = await res.data;
            if (data.status === 200) {
                toast.success("Created date has been updated.");
                setTicket((prev) => ({ ...prev, createdAt: newCreatedAt }));
                setShowEditCreatedAtModal(false);
            }
        } catch (error) {
            console.error("Error updating created date:", error);
            toast.error("Failed to update created date.");
        }
    };

    const setEngineer = async () => {
        setShowModal(false);
        try {
            const res = await axios.put(
                `/api/admin/${user_id}/ticket/${ticket_id}/set_engineer`,
                {
                    engineerId,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        // Authorization: `Bearer ${cookies.token}`,
                    },
                }
            );
            const data = await res.data;
            if (data.status === 200) {
                toast.success(
                    `The ticket has been assigned to ${engineerName}. Refresh page to see changes.`
                );
            }
        } catch (err) {
            console.log(err);
        }
    };

    const acceptTicket = async () => {
        try {
            const res = await axios.put(
                `/api/admin/${user_id}/ticket/${ticket_id}/accept_ticket`
            );
            const data = await res.data;
            if (data.status === 200) {
                toast.success(`The ticket has been accepted. Refresh page to see changes.`);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const priorityFunc = async (e) => {
        setSelectedPriority(e.target.value);
        try {
            const res = await axios.put(
                `/api/admin/${user_id}/ticket/${ticket_id}/set_priority`,
                { priority: e.target.value },
                {
                    headers: { "Content-Type": "application/json" },
                }
            );
            const data = await res.data;
            if (data.status === 200) {
                toast.success(`The priority has been set to ${e.target.value}. Refresh page to see changes.`);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const ProblemFunc = async (e) => {
        setSelectedProblem(e.target.value);
        try {
            const res = await axios.put(
                `/api/admin/${user_id}/ticket/${ticket_id}/set_Problem`,
                { Problem: e.target.value },
                { headers: { "Content-Type": "application/json" } }
            );
            const data = await res.data;
            if (data.status === 200) {
                toast.success(`The Problem has been set to ${e.target.value}. Refresh page to see changes.`);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const ServiceTypeFunc = async (e) => {
        setSelectedServiceType(e.target.value);
        try {
            const res = await axios.put(
                `/api/admin/${user_id}/ticket/${ticket_id}/set_ServiceType`,
                { ServiceType: e.target.value },
                { headers: { "Content-Type": "application/json" } }
            );
            const data = await res.data;
            if (data.status === 200) {
                toast.success(`The ServiceType has been set to ${e.target.value}. Refresh page to see changes.`);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const AMCFunc = async (e) => {
        setSelectedAMC(e.target.value);
        try {
            const res = await axios.put(
                `/api/admin/${user_id}/ticket/${ticket_id}/set_AMC`,
                { AMC: e.target.value },
                { headers: { "Content-Type": "application/json" } }
            );
            const data = await res.data;
            if (data.status === 200) {
                toast.success(`The AMC has been set to ${e.target.value}. Refresh page to see changes.`);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const sendTextMessage = async () => {
        setShowLogs(false);
        if (textMessage !== "") {
            try {
                const res = await axios.put(
                    `/api/${getRole()}/${user_id}/ticket/${ticket_id}/add_message`,
                    { userRole, textMessage },
                    { headers: { "Content-Type": "application/json" } }
                );
                const data = await res.data;
                if (data.status === 200) {
                    toast.success("Your comment has been added. Refresh to see changes.");
                }
            } catch (err) {
                toast.error(err);
            }
        }
    };

    const deleteFunc = async () => {
        try {
            const res = await axios.delete(
                `/api/admin/${user_id}/ticket/${ticket_id}/delete_ticket`
            );
            const data = await res.data;
            if (data.status === 200) {
                navigate(`/user/${user_id}/tickets`);
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <>
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-green-200">
                <div className="w-full max-w-md mx-4 my-8 border-2 border-blue-500 border-dotted rounded-lg shadow-lg bg-slate-100">
                    <div className="p-6">
                        <h2 className="mb-6 text-2xl font-bold text-center text-blue-800">Ticket Details</h2>
                        <div className="space-y-4">
                            {/* Company Name */}
                            <div className="flex items-center">
                                <span className="font-bold text-blue-800">Company Name: </span>
                                <span className="ml-2 text-gray-700">{ticket.companyName}</span>
                            </div>
                            {/* Created / Reported By */}
                            <div className="flex items-center">
                                <span className="font-bold text-blue-800">Created / Reported By: </span>
                                <span className="ml-2 text-gray-700">{ticket.name}</span>
                            </div>

                            <div className="flex items-center">
                                <span className="font-bold text-blue-800">Created At: </span>
                                <span className="ml-2 text-gray-700">{new Date(ticket.createdAt).toLocaleString("en-IN", {
                                    timeZone: "Asia/Kolkata",
                                    dateStyle: "short",
                                    timeStyle: "short",
                                })}</span>
                                {getRole() === "admin" && (
                                    <button
                                        className="ml-4 px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
                                        onClick={() => setShowEditCreatedAtModal(true)}
                                    >
                                        Edit
                                    </button>
                                )}
                            </div>
                            {/* Phone */}
                            <div className="flex items-center">
                                <span className="font-bold text-blue-800">Phone: </span>
                                <span className="ml-2 text-gray-700">{ticket.phoneNumber}</span>
                            </div>
                            {/* Location */}
                            <div className="flex items-center">
                                <span className="font-bold text-blue-800">Location: </span>
                                <span className="ml-2 text-gray-700">{ticket.landlineNumber}</span>
                            </div>
                            {/* Department */}
                            <div className="flex items-center">
                                <span className="font-bold text-blue-800">Department: </span>
                                <span className="ml-2 text-gray-700">{ticket.department}</span>
                            </div>
                            {/* Issue */}
                            <div className="flex items-center">
                                <span className="font-bold text-blue-800">Issue: </span>
                                <span className="ml-2 text-gray-700">{ticket.issue}</span>
                            </div>
                            {/* Resolved At */}
                            <div className="flex items-center">
                                <span className="font-bold text-blue-800">Resolved At: </span>
                                <span className="ml-2 text-gray-700">
                                    {ticket.solvedAt ? new Date(ticket.solvedAt).toLocaleString() : "Not Resolved Yet"}
                                </span>
                                {/* Edit Date Button (Admin Only) */}
                                {getRole() === "admin" && (
                                    <button
                                        className="ml-4 px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
                                        onClick={() => setShowEditDateModal(true)}
                                    >
                                        Edit
                                    </button>
                                )}
                            </div>
                            {/* Ticket Status */}
                            <div className="flex items-center">
                                <span className="font-bold text-blue-800">Ticket Status: </span>
                                <span className={`ml-2 text-gray-700 ${status ? "text-green-600" : "text-red-600"}`}>
                                    {status ? "Resolved" : "Unresolved"}
                                </span>
                            </div>
                            {/* Priority */}
                            <div className="flex items-center">
                                <span className="font-bold text-blue-800">Priority: </span>
                                <span className="ml-2 text-gray-700">{ticket.priority}</span>
                            </div>
                            {/* Call Status */}
                            <div className="flex items-center">
                                <span className="font-bold text-blue-800">Call Status: </span>
                                <span className="ml-2 text-gray-700">{ticket.Problem}</span>
                            </div>
                            {/* Service Type */}
                            <div className="flex items-center">
                                <span className="font-bold text-blue-800">Service Type: </span>
                                <span className="ml-2 text-gray-700">{ticket.ServiceType}</span>
                            </div>
                            {/* AMC */}
                            <div className="flex items-center">
                                <span className="font-bold text-blue-800">AMC: </span>
                                <span className="ml-2 text-gray-700">{ticket.AMC}</span>
                            </div>
                            {/* Part Name */}
                            <div className="flex items-center">
                                <span className="font-bold text-blue-800">Part Name: </span>
                                <span className="ml-2 text-gray-700">{ticket.partName}</span>
                            </div>
                            {/* Accepted */}
                            <div className="flex items-center">
                                <span className="font-bold text-blue-800">Accepted?: </span>
                                <span className="ml-2 text-gray-700">{ticket.accepted === 1 ? "Yes" : "No"}</span>
                            </div>
                            {/* Assigned To (Not for Engineers) */}
                            {getRole() !== "engineer" && (
                                <div className="flex items-center">
                                    <span className="font-bold text-blue-800">Assigned To: </span>
                                    <span className="ml-2 text-gray-700">
                                        {ticket.assignedEngineer ? nameForAE : "Not Assigned"}
                                    </span>
                                </div>
                            )}
                            {/* User Remarks */}
                            <div className="flex items-center">
                                <span className="font-bold text-blue-800">User Remarks: </span>
                                <span className="ml-2 text-gray-700">{ticket.remarks}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-2 py-4 border-t border-gray-300">
                <button
                    className="px-6 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                    onClick={markAsSolved}
                >
                    {status ? "Mark Unresolved" : "Mark Resolved"}
                </button>

                {getRole() === "admin" && (
                    <button
                        onClick={handleAssignEngineer}
                        className="px-6 py-2 text-white bg-teal-500 rounded hover:bg-teal-600"
                    >
                        Assign Engineer
                    </button>
                )}
            </div>

            {/* Additional Actions for Admin */}
            {getRole() === "admin" && (
                <div className="flex justify-center gap-3 pb-4">
                    {ticket.accepted === 0 && (
                        <button
                            onClick={acceptTicket}
                            className="px-6 py-2 text-white bg-gray-500 rounded hover:bg-gray-600"
                        >
                            Accept Ticket
                        </button>
                    )}
                    {/* Priority Selector */}
                    <select
                        className="col-span-12 px-4 py-2 mb-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 md:col-span-2"
                        value={selectedPriority}
                        onChange={priorityFunc}
                    >
                        <option value="set priority" disabled>
                            Set Priority
                        </option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                    {/* Problem Selector */}
                    <select
                        className="col-span-12 px-4 py-2 mb-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 md:col-span-2"
                        value={selectedProblem}
                        onChange={ProblemFunc}
                    >
                        <option value="Call status.">Call Status.</option>
                        <option value="Closed.">Closed.</option>
                        <option value="Assigned.">Assigned.</option>
                        <option value="Open.">Open.</option>
                        <option value="Customer pending.">Customer pending.</option>
                        <option value="Part Pending.">Part Pending.</option>
                        <option value="Repair Pending.">Repair Pending.</option>
                        <option value="Dispatch Pending.">Dispatch Pending.</option>
                        <option value="Vendor Pending.">Vendor Pending.</option>
                        <option value="Under Testing.">Under Testing.</option>
                        <option value="Under Observation.">Under Observation.</option>
                    </select>
                </div>
            )}

            {getRole() === "admin" && (
                <div className="flex justify-center gap-2 mb-4">
                    {/* Service Type Selector */}
                    <select
                        className="col-span-12 px-4 py-2 mb-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 md:col-span-2"
                        value={selectedServiceType}
                        onChange={ServiceTypeFunc}
                    >
                        <option value="ServiceType.">ServiceType.</option>
                        <option value="Visit.">Visit.</option>
                        <option value="Online.">Online.</option>
                    </select>

                    {/* AMC Selector */}
                    <select
                        className="col-span-12 px-4 py-2 mb-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 md:col-span-2"
                        value={selectedAMC}
                        onChange={AMCFunc}
                    >
                        <option value="AMC">AMC</option>
                        <option value="In AMC.">In AMC</option>
                        <option value="Not in AMC.">Not in AMC</option>
                    </select>
                </div>
            )}

            {/* Part Name Submission (Admin Only) */}
            {getRole() === "admin" && (
                <div className="flex justify-center gap-2 mb-4">
                    <input
                        required
                        type="text"
                        className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Part Name."
                        value={partName}
                        onChange={handlePartNameChange}
                        autoComplete="off"
                    />

                    <button
                        type="button"
                        className="w-40 px-8 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                        onClick={handleSubmitPartName}
                    >
                        Submit
                    </button>
                </div>
            )}

            {/* Additional Actions (Delete & Update Ticket, Show Logs) */}
            {getRole() === "admin" && (
                <div className="flex-col mb-4">
                    <div className="flex justify-center gap-2">
                        <button
                            onClick={deleteFunc}
                            className="px-6 py-2 text-white bg-red-500 rounded hover:bg-red-600"
                        >
                            Delete Ticket
                        </button>
                        <button
                            className="px-6 py-2 text-white bg-indigo-700 rounded hover:bg-indigo-800"
                            onClick={() => setUpdateTicket(true)}
                        >
                            Update Ticket
                        </button>
                    </div>
                    <div className="flex justify-center mt-4">
                        <button
                            onClick={() => setShowLogs(true)}
                            className="px-6 py-2 text-white bg-teal-500 rounded hover:bg-emerald-600"
                        >
                            Show Logs
                        </button>
                    </div>
                </div>
            )}

            {/* Assign Engineer Modal */}
            {showModal && (
                <>
                    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
                        <div className="relative w-auto max-w-3xl mx-auto my-6">
                            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none min-h-[50vh] max-h-[50vh]">
                                <div className="flex items-start justify-between p-5 border-b border-solid rounded-t border-slate-200">
                                    <h3 className="text-3xl font-semibold">Assign Engineer</h3>
                                </div>
                                <div className="relative flex-auto p-4 overflow-y-auto">
                                    <Autocomplete
                                        suggestions={engineerInfo}
                                        setEngineerId={handleInputChange}
                                    />
                                </div>
                                <div className="flex items-center justify-end p-6 border-t border-solid rounded-b border-slate-200">
                                    <button
                                        className="px-6 py-2 mb-1 mr-1 text-sm font-bold text-red-500 uppercase transition-all duration-150 ease-linear outline-none background-transparent focus:outline-none"
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                    >
                                        Close
                                    </button>
                                    <button
                                        className="px-6 py-3 mb-1 mr-1 text-sm font-bold text-white uppercase transition-all duration-150 ease-linear rounded shadow outline-none bg-emerald-500 active:bg-emerald-600 hover:shadow-lg focus:outline-none"
                                        type="button"
                                        onClick={setEngineer}
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
                </>
            )}

            {showLogs && (
                <TextModal
                    ticket={ticket}
                    onClose={() => setShowLogs(false)}
                    onAddMessage={sendTextMessage}
                    textMessage={textMessage}
                    setTextMessage={setTextMessage}
                />
            )}
            {updateTicket && (
                <CreateUpdateTicket setUpdateTicket={setUpdateTicket} ticket={ticket} />
            )}

            {/* Edit Resolved At Modal (Admin Only) */}
            {getRole() === "admin" && showEditDateModal && (
                <>
                    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
                        <div className="relative w-auto max-w-md mx-auto my-6">
                            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-2xl font-semibold">Edit Resolved At</h3>
                                    <button
                                        className="text-red-500 hover:text-red-700"
                                        onClick={() => setShowEditDateModal(false)}
                                    >
                                        &times;
                                    </button>
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="resolvedAt" className="block mb-2 font-bold text-gray-700">
                                        Select New Resolved Date and Time:
                                    </label>
                                    <input
                                        type="datetime-local"
                                        id="resolvedAt"
                                        name="resolvedAt"
                                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={newResolvedAt}
                                        onChange={handleResolvedAtChange}
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        className="px-4 py-2 mr-2 text-white bg-gray-500 rounded hover:bg-gray-600"
                                        onClick={() => setShowEditDateModal(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
                                        onClick={submitNewResolvedAt}
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
                </>
            )}

            {/* Edit Created At Modal (Admin Only) */}
            {getRole() === "admin" && showEditCreatedAtModal && (
                <>
                    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
                        <div className="relative w-auto max-w-md mx-auto my-6">
                            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-2xl font-semibold">Edit Created At</h3>
                                    <button
                                        className="text-red-500 hover:text-red-700"
                                        onClick={() => setShowEditCreatedAtModal(false)}
                                    >
                                        &times;
                                    </button>
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="createdAt" className="block mb-2 font-bold text-gray-700">
                                        Select New Created Date and Time:
                                    </label>
                                    <input
                                        type="datetime-local"
                                        id="createdAt"
                                        name="createdAt"
                                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={newCreatedAt}
                                        onChange={handleCreatedAtChange}
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        className="px-4 py-2 mr-2 text-white bg-gray-500 rounded hover:bg-gray-600"
                                        onClick={() => setShowEditCreatedAtModal(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
                                        onClick={submitNewCreatedAt}
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
                </>
            )}
        </>
    );
};

export default ViewTicketDetails;
