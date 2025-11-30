import axios from "axios";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";



const Navbar = () => {
  const { user_id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const userRole = localStorage.getItem("role");

  const getTicketExport = async (startDate, endDate, duration) => {
    try {
        const params = duration === 'month' ? { duration } : { start: startDate, end: endDate };
        
        const res = await axios.get(`/api/admin/${user_id}/export_tickets`, {
            params: params,
            responseType: 'blob',
            headers: {
                "Content-Type": "application/json",
                // Authorization: `Bearer ${cookies.token}`, // Uncomment if using token authentication
            },
        });

        // Extract filename from the 'content-disposition' header or set a default
        const contentDisposition = res.headers['content-disposition'] || '';
        let filename = "export.csv";
        if (contentDisposition.includes('filename')) {
            filename = contentDisposition.split('=')[1].trim();
        }

        // Create a Blob from the response data and download the file
        const csvData = new Blob([res.data], { type: 'text/csv' });
        const downloadUrl = URL.createObjectURL(csvData);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = filename;
        link.click();

        // Cleanup
        URL.revokeObjectURL(downloadUrl);
    } catch (error) {
        console.error('Error exporting tickets:', error);
        // Handle error (e.g., show an error message)
    }
};

  return (
    <header className="text-gray-600 shadow-lg body-font rounded-xl bg-slate-50">
      <div className="container flex flex-col flex-wrap items-center justify-between p-5 mx-auto md:flex-row">
        <Link to="/">
          <div className="flex items-center mb-4 font-medium text-gray-900 title-font md:mb-0">
            <img
              src="https://i.ibb.co/bW5ycwG/Screenshot-2023-06-27-115737.png"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="w-20 h-20 rounded-full"
              viewBox="0 0 0 0"
            />
<div className="flex flex-col ml-2 font-semibold">
              <span className="text-xl">A Global</span>
              <span className="text-xl">Infocomm</span>
			  <span className="text-xl">Ticketify</span>
            </div>
			</div>
        </Link>
        {location.pathname === "/" ? (
          <>
            <div>
              {localStorage.getItem("li") ? (
                // If user is logged in
                <>
                  <nav className="flex gap-5">
                    <button
                      onClick={() => {
                        navigate(
                          `/user/${localStorage.getItem("uid")}/tickets`
                        );
                      }}
                      className="inline-flex items-end px-3 py-1 mt-4 text-base bg-blue-200 border-0 rounded focus:outline-none hover:bg-slate-100 md:mt-0"
                    >
                      Show Tickets
                      <svg
                        className="flex-shrink-0 w-4 h-4 ml-1 svg-icon"
                        viewBox="0 0 20 20"
                      >
                        <path d="M0 4.5A1.5 1.5 0 0 1 1.5 3h13A1.5 1.5 0 0 1 16 4.5V6a.5.5 0 0 1-.5.5 1.5 1.5 0 0 0 0 3 .5.5 0 0 1 .5.5v1.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 11.5V10a.5.5 0 0 1 .5-.5 1.5 1.5 0 1 0 0-3A.5.5 0 0 1 0 6V4.5ZM1.5 4a.5.5 0 0 0-.5.5v1.05a2.5 2.5 0 0 1 0 4.9v1.05a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-1.05a2.5 2.5 0 0 1 0-4.9V4.5a.5.5 0 0 0-.5-.5h-13Z" />{" "}
                      </svg>
                    </button>
                    <button
                      onClick={() => {
                        fetch("/api/auth/logout");
                        localStorage.removeItem("role");
                        localStorage.removeItem("li");
                        localStorage.removeItem("uid");
                        navigate("/login");
                      }}
                      className="inline-flex items-center px-3 py-1 mt-4 text-base bg-red-100 border-0 rounded focus:outline-none hover:bg-slate-100 md:mt-0"
                    >
                      Logout
                      <svg
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="w-4 h-4 ml-1"
                        viewBox="0 0 24 24"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7"></path>
                      </svg>
                    </button>
                  </nav>
                </>
              ) : (
                // If user is logged out
                <>
                  <nav className="flex gap-5">
                    <button
                      onClick={() => {
                        navigate(`/login`);
                      }}
                      className="inline-flex items-center px-3 py-1 mt-4 text-base bg-green-300 border-0 rounded focus:outline-none hover:bg-slate-100 md:mt-0"
                    >
                      Login
                      <svg
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="flex-shrink-0 w-4 h-4 ml-1 svg-icon"
                        viewBox="0 0 24 24"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7"></path>
                      </svg>
                    </button>
                    <button
                      onClick={() => {
                        navigate(`/register`);
                      }}
                      className="inline-flex items-center px-3 py-1 mt-4 text-base border-0 rounded bg-cyan-100 focus:outline-none hover:bg-slate-100 md:mt-0"
                    >
                      Sign Up
                      <svg
                        className="flex-shrink-0 w-4 h-4 ml-1 svg-icon"
                        viewBox="0 0 20 20"
                      >
                        <path d="M15.573,11.624c0.568-0.478,0.947-1.219,0.947-2.019c0-1.37-1.108-2.569-2.371-2.569s-2.371,1.2-2.371,2.569c0,0.8,0.379,1.542,0.946,2.019c-0.253,0.089-0.496,0.2-0.728,0.332c-0.743-0.898-1.745-1.573-2.891-1.911c0.877-0.61,1.486-1.666,1.486-2.812c0-1.79-1.479-3.359-3.162-3.359S4.269,5.443,4.269,7.233c0,1.146,0.608,2.202,1.486,2.812c-2.454,0.725-4.252,2.998-4.252,5.685c0,0.218,0.178,0.396,0.395,0.396h16.203c0.218,0,0.396-0.178,0.396-0.396C18.497,13.831,17.273,12.216,15.573,11.624 M12.568,9.605c0-0.822,0.689-1.779,1.581-1.779s1.58,0.957,1.58,1.779s-0.688,1.779-1.58,1.779S12.568,10.427,12.568,9.605 M5.06,7.233c0-1.213,1.014-2.569,2.371-2.569c1.358,0,2.371,1.355,2.371,2.569S8.789,9.802,7.431,9.802C6.073,9.802,5.06,8.447,5.06,7.233 M2.309,15.335c0.202-2.649,2.423-4.742,5.122-4.742s4.921,2.093,5.122,4.742H2.309z M13.346,15.335c-0.067-0.997-0.382-1.928-0.882-2.732c0.502-0.271,1.075-0.429,1.686-0.429c1.828,0,3.338,1.385,3.535,3.161H13.346z"></path>
                      </svg>
                    </button>
                  </nav>
                </>
              )}
            </div>
          </>
        ) : (
          <>
            <nav className="flex flex-wrap items-center justify-center text-base md:ml-auto">
              {userRole != "2069-t2-prlo-456-fiok" && (
                <Link to={`/user/${user_id}/create_ticket`}>
                  <span className="mr-5 text-blue-500 hover:text-gray-900 ">
                    Create Ticket
                  </span>
                </Link>
              )}
              <Link to={`/user/${user_id}/tickets`}>
                <span className="mr-5 text-green-500 hover:text-gray-900">
                  View Tickets
                </span>
              </Link>
              {localStorage.getItem("role") === "9087-t1-vaek-123-riop" && (
                <>
                  <Link to={`/user/${user_id}/create_engineer`}>
                    <span className="mr-5 text-green-500 hover:text-gray-900">
                      Create Engineer
                    </span>
                  </Link>
                  
				  
				  <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
  <div style={{ display: 'flex', gap: '10px', marginBottom: '2px' }}>
  
  <input 
    type="date" 
    id="startDate" 
    style={{ 
      width: '150px',
      padding: '8px',
      border: '2px solid #ddd',
      borderRadius: '40px',
      boxShadow: '0px 0px 8px rgba(0, 0, 0, 0.1)'
    }} 
  />
  <input 
    type="date" 
    id="endDate" 
    style={{ 
      padding: '8px',
      border: '2px solid #ddd',
      borderRadius: '40px',
      boxShadow: '0px 0px 8px rgba(0, 0, 0, 0.1)'
    }} 
  />
</div>

  <button
    onClick={() => {
      const startDate = document.getElementById('startDate').value;
      const endDate = document.getElementById('endDate').value;
      getTicketExport(startDate, endDate);
    }}
    style={{ 
      backgroundColor: '#4CAF50', 
      color: 'white',
      padding: '10px 15px',
      border: 'none',
      borderRadius: '40px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: 'bold'
    }}
  > <span className="mr-1500  hover:text-gray-900">
    Export
	</span>
  </button>
</div>
				  
                </>
              )}
            </nav>
			 
            <button
              onClick={() => {
                fetch("/api/auth/logout");
                localStorage.removeItem("role");
                localStorage.removeItem("li");
                localStorage.removeItem("uid");
                navigate("/login");
              }}
              className="inline-flex items-center px-3 py-1 mt-4 text-base bg-red-100 border-0 rounded focus:outline-none hover:bg-slate-100 md:mt-0"
            >
              Logout
              <svg
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="w-4 h-4 ml-1"
                viewBox="0 0 24 24"
              >
                <path d="M5 12h14M12 5l7 7-7 7"></path>
              </svg>
            </button>
			
			
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
