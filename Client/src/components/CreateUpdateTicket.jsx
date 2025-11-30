import axios from "axios";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateUpdateTicket = ({ setUpdateTicket, ticket }) => {
    const { user_id } = useParams();
    const navigate = useNavigate();

    // states for all the input fields
    const [name, setName] = useState(ticket.name);
    const [companyName, setcompanyName] = useState(ticket.companyName);
    const [email, setEmail] = useState(ticket.email);
    const [issue, setIssue] = useState(ticket.issue);
    const [showIssueInput, setShowIssueInput] = useState(false);
    const [remarks, setRemarks] = useState(ticket.remarks);
    const [phone, setPhone] = useState(ticket.phoneNumber);
    const [email1, setEmail1] = useState("");
    const [landline, setLandline] = useState(ticket.landlineNumber);
    const [department, setDepartment] = useState(ticket.department);
    const [classification, setClassification] = useState("");
    const [showClassificationInput, setShowClassificationInput] = useState(false);
    const [channel, setChannel] = useState(ticket.channel);
    const [status, setStatus] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log("Update initiated");
        const currentDate = new Date();
        const updatedComplaint = {
            //user_id: user_id, //user_id is coming from the URL itself and then it is passed to the backend
            name: name,
            companyName: companyName || "",
            email: email,
            phoneNumber: phone,
            email1: email1,
            landlineNumber: landline || "",
            department: department,
            issue: issue || "",
            channel: channel || "",
            remarks: remarks || "",
            createdAt: currentDate.toISOString(),
            resolved: false,
            priority: "low",
            Problem: "None.",
            ServiceType: "",
            assignedEngineer: "",
            ticket_id: ticket.id,
        };
        // console.log(updatedComplaint);

        try {
            const response = await axios.patch(
                `/api/user/${user_id}/updateticket`,
                updatedComplaint,
                {
                    headers: {
                        "Content-Type": "application/json",
                        // Authorization: `Bearer ${cookies.token}`,
                    },
                }
            );
            const data = await response.data;
            // console.log(data);
            if (data.status === 200) {
                setStatus("success");
                toast.success("Your ticket has been successfully updated.");
                navigate(`/user/${user_id}/tickets`);
                // Handle the created ticket
            } else {
                setStatus("error");
            }
        } catch (error) {
            setStatus(error);
        }
        // setUsersComplaints([...usersComplaints, newComplaint]);
        // Reset the form after submission
        setName("");
        setcompanyName(""), setEmail("");
        setPhone("");
        setEmail1("");
        setLandline("");
        setDepartment("");
        setIssue("");
        setChannel("");
        setRemarks("");
    };

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center m-4 overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
                <div className="relative w-auto max-w-3xl mx-auto my-6">
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none min-h-[80vh] max-h-[80vh]">
                        <div className="flex items-center justify-between gap-5 p-5 border-b border-solid rounded-t border-slate-200">
                            <h3 className="text-3xl font-semibold">Update ticket</h3>
                            <button
                                onClick={() => setUpdateTicket(false)}
                                className="text-2xl text-red-500"
                            >
                                X
                            </button>
                        </div>
                        <div className="max-w-md p-6 mx-auto bg-white rounded-lg shadow-lg">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <input
                                        required
                                        type="text"
                                        className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        autoComplete="username"
                                    />
                                    <input
                                        required
                                        type="text"
                                        className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Company Name"
                                        value={companyName}
                                        onChange={(e) => setcompanyName(e.target.value)}
                                        autoComplete="companyName"
                                    />
                                    <input
                                        required
                                        type="email"
                                        className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        autoComplete="email"
                                    />
                                    <input
                                        required
                                        type="tel"
                                        className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Phone Number"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                    <input
                                        type="tel"
                                        className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Location."
                                        value={landline}
                                        onChange={(e) => setLandline(e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Department."
                                        value={department}
                                        onChange={(e) => setDepartment(e.target.value)}
                                    />
                                </div>
                                <div className="flex flex-col items-center sm:flex-row">
                                    <label className="w-full sm:w-1/3">Issue:</label>
                                    <select
                                        className="w-full px-4 py-2 border border-gray-300 rounded sm:w-2/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={issue}
                                        onChange={(e) => {
                                            setIssue(e.target.value);
                                            setShowIssueInput(e.target.value === "Others");
                                        }}
                                    >
                                        <option value="" disabled>
                                            Your Issue
                                        </option>
                                        <option value="Hardware">Hardware</option>
                                        <option value="Software">Software</option>
                                        <option value="Networking">Networking</option>
                                        <option value="Others">Others</option>
                                    </select>
                                </div>
                                {showIssueInput && (
                                    <div className="flex flex-col items-center sm:flex-row">
                                        <label className="w-full sm:w-1/3 text-emerald-600">
                                            Type your issue:
                                        </label>
                                        <input
                                            className="w-full px-4 py-2 border border-gray-300 rounded sm:w-2/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={issue}
                                            onChange={(e) => {
                                                setIssue(e.target.value);
                                            }}
                                        />
                                    </div>
                                )}

                                <div className="flex flex-col items-center sm:flex-row">
                                    <label className="w-full sm:w-1/3">Channel:</label>
                                    <select
                                        className="w-full px-4 py-2 border border-gray-300 rounded sm:w-2/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={channel}
                                        onChange={(e) => setChannel(e.target.value)}
                                    >
                                        <option value="" disabled>
                                            How did you contact?
                                        </option>
                                        <option value="Phone">Phone</option>
                                        <option value="Email">Email</option>
                                        <option value="Web">Web</option>
                                        <option value="Chat">Chat</option>
                                        <option value="Forums">Forums</option>
                                        <option value="Feedback Widget">Feedback Widget</option>
                                    </select>
                                </div>
                                <textarea
                                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows={4}
                                    placeholder="Remarks"
                                    value={remarks}
                                    onChange={(e) => setRemarks(e.target.value)}
                                ></textarea>
                                <div className="flex justify-center">
                                    <button
                                        type="submit"
                                        className="w-40 px-8 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                                    >
                                        Update
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div className="fixed inset-0 z-40 opacity-60 bg-slate-900"></div>
        </>
    );
};

export default CreateUpdateTicket;
