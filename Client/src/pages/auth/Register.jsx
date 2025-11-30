import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const [obj, setObj] = useState({
    name: "",
	phone: "",
    email: "",
    password: "",  
    role: "user",
  });

  const registerUser = async (event) => {
    event.preventDefault();
    const userId = generateUserId();
    try {
      const response = await axios.post(
        "/api/auth/register",
        { ...obj, userId },
        {
          headers: {
	
          },
        }
      );

      const data = response.data;
      if (data.error) {
        toast.error(data.error);
      } else if (data.status === 200) {
        toast.success("Your account has been created! Please login.");
      }

      setObj({
        name: "",
		phone: "",
        email: "",
        password: "",
		role: "user",
      });
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };
	
  const generateUserId = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");

    // Generate the unique code using your preferred algorithm (e.g., UUID, shortid, etc.)
    const uniqueCode = Math.floor(Math.random() * 10000);

    const userId = `${year}${month}${day}${uniqueCode}`;

    return userId;
  };

  const handleChange = (e) => {
    setObj((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
                      Sign Up
                    </h3>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <div>
                  <label htmlFor="name" className="sr-only">
                    Name
                  </label>
                  <input
                    type="name"
                    value={obj.name}
                    name="name"
                    className="block w-full px-5 py-3 text-base text-neutral-600 placeholder-gray-300 transition duration-500 ease-in-out transform border border-transparent rounded-lg bg-gray-50 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300"
                    placeholder="Enter your name."
                    onChange={handleChange}
                    autoComplete="username"
                  />
                </div>
				<div>
                  <label htmlFor="phone" className="sr-only">
                    Phone
                  </label>
                  <input
                    type="phone"
                    value={obj.phone}
                    name="phone"
                    className="block w-full px-5 py-3 text-base text-neutral-600 placeholder-gray-300 transition duration-500 ease-in-out transform border border-transparent rounded-lg bg-gray-50 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300"
                    placeholder="Enter your phone number."
                    onChange={handleChange}
                    autoComplete="phone"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="sr-only">
                    Email
                  </label>
                  <input
                    type="email"
                    value={obj.email}
                    name="email"
                    className="block w-full px-5 py-3 text-base text-neutral-600 placeholder-gray-300 transition duration-500 ease-in-out transform border border-transparent rounded-lg bg-gray-50 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300"
                    placeholder="Enter your email."
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
                    placeholder="Enter your password."
                    onChange={handleChange}
                    autoComplete="current-password"
                  />
                </div>
				<div className="flex flex-col mt-4 lg:space-y-2">
                  <button
                    type="button"
                    className="flex items-center justify-center w-full px-10 py-4 text-base font-medium text-center text-white transition duration-500 ease-in-out transform bg-lime-600 rounded-xl hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={registerUser}
                  >
                    Sign Up
                  </button>
                  <br />
                  <span
                    href="#"
                    type="button"
                    className="inline-flex justify-center py-4 text-base font-medium text-gray-500 focus:outline-none hover:text-neutral-600 focus:text-blue-600 sm:text-sm"
                  >
                    Already signed up?
                    <Link
                      to="/login"
                      style={{
                        color: "blue",
                        marginLeft: "0.3em",
                        marginRight: "0.25em",
                      }}
                    >
                      Login
                    </Link>
                    here
                  </span>
                </div>
              </div>
            </div>
            <div className="order-first hidden md:block w-full">
              <img
                className="object-cover h-full bg-cover rounded-l-lg"
                src="https://images.pexels.com/photos/3184431/pexels-photo-3184431.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt="Hands"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
