import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserRoleContext } from "../../contexts/userRoleContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const { setUserRole } = useContext(UserRoleContext);
  const [obj, setObj] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setObj((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const res = await axios.post("/api/auth/login", obj, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.data;
      if (data.status === 200) {
        // document.cookie = `token=${data.user.token}; path=/`; // Set the token as a cookie
        const userId = data.id;
        localStorage.setItem("uid", userId);
        setUserRole(data.role);
        localStorage.setItem("li", true);
        if (data.role === "admin") {
          localStorage.setItem("role", "9087-t1-vaek-123-riop");
        } else if (data.role === "engineer") {
          localStorage.setItem("role", "2069-t2-prlo-456-fiok");
        } else {
          localStorage.setItem("role", "4032-t3-raek-789-chop");
        }
        navigate(`/user/${userId}/tickets`);
      } else if (data.status === 404) {
        toast.error("Please check your email");
      } else if (data.status === 401) {
        toast.error("Please check you password.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-blue-500">
      <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 md:px-12 lg:px-24 lg:py-24">
        <div className="justify-center mx-auto text-left align-bottom transition-all transform bg-white rounded-lg sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="grid flex-wrap items-center justify-center grid-cols-1 mx-auto shadow-xl lg:grid-cols-2 rounded-xl">
            <div className="w-full px-6 py-3">
              <div>
                <div className="mt-3 text-left sm:mt-5">
                  <div className="inline-flex items-center w-full">
                    <h3 className="text-lg font-bold text-neutral-600 l eading-6 lg:text-5xl">
                      Login
                    </h3>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <div>
                  <label htmlFor="email" className="sr-only">
                    Email
                  </label>
                  <input
                    type="email"
                    value={obj.email}
                    name="email"
                    className="block w-full px-5 py-3 text-base text-neutral-600 placeholder-gray-300 transition duration-500 ease-in-out transform border border-transparent rounded-lg bg-gray-50 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300"
                    placeholder="Enter your email"
                    onChange={handleChange}
                    autoComplete="username"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="sr-only">
                    Password
                  </label>
                  <input
                    type="password"
                    value={obj.password}
                    name="password"
                    className="block w-full px-5 py-3 text-base text-neutral-600 placeholder-gray-300 transition duration-500 ease-in-out transform border border-transparent rounded-lg bg-gray-50 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300"
                    placeholder="Enter your password"
                    onChange={handleChange}
                    autoComplete="current-password"
                  />
                </div>
                <div className="flex flex-col mt-4 lg:space-y-2">
                  <button
                    type="button"
                    className="flex items-center justify-center w-full px-10 py-4 text-base font-medium text-center text-white transition duration-500 ease-in-out transform bg-lime-600 rounded-xl hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={handleSubmit}
                  >
                    Login
                  </button>
                  <br />
                  <span
                    href="#"
                    type="button"
                    className="inline-flex justify-center py-4 text-base font-medium text-gray-500 focus:outline-none hover:text-neutral-600 focus:text-blue-600 sm:text-sm"
                  >
                    Not signed up?
                    <Link
                      to="/register"
                      style={{
                        color: "blue",
                        marginLeft: "0.3em",
                        marginRight: "0.25em",
                      }}
                    >
                      Signup
                    </Link>
                    here.
                  </span>
                </div>
              </div>
            </div>
            <div className="order-first lg:block hidden w-full">
              <img
                className="object-cover h-full bg-cover rounded-l-lg"
                src="https://images.pexels.com/photos/3959482/pexels-photo-3959482.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt="Hands"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
