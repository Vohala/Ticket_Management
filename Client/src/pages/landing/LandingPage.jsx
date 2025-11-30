import React from "react";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div>
      <Navbar />

      <header className="bg-gradient-to-r from-blue-500 to-green-300 text-white py-10 md:py-20">
        <div className="container mx-auto text-center p-2 bg-black bg-opacity-10 backdrop-blur-xl rounded-lg drop-shadow-xl md:w-2/3 ">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Welcome to Ticketify
          </h1>
          <p className="text-base md:text-lg mb-8">
            The best ticket logging platform for all your IT needs.
          </p>
          <button
            onClick={() => navigate("/register")}
            className="px-6 py-3 bg-white text-blue-500 font-bold rounded-full hover:bg-blue-100"
          >
            Get Started
          </button>
        </div>
      </header>

      <section className="py-8 md:py-16 bg-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <img
                src="https://images.pexels.com/photos/7195527/pexels-photo-7195527.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt="Feature 1"
                className="rounded-lg shadow-md"
              />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center md:text-left">
                Easy Ticket Logging
              </h2>
              <p className="text-base md:text-lg mb-6 text-center md:text-left">
                Log your IT issues with just a few clicks and let our expert
                engineers take care of them.
              </p>
              <div className="text-center md:text-left">
                <button
                  onClick={() => navigate("/about")}
                  className="px-4 py-2 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600"
                >
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 md:py-16 bg-gray-100">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <img
                src="https://images.pexels.com/photos/7709242/pexels-photo-7709242.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt="Feature 2"
                className="rounded-lg shadow-md"
              />
            </div>
            <div className="md:order-first">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center md:text-right">
                24/7 Support
              </h2>
              <p className="text-base md:text-lg mb-6 text-center md:text-right">
                Our team of skilled engineers is available around the clock to
                assist you with any technical issues you may encounter.
              </p>
              <div className="text-center md:text-right">
                <button
                  onClick={() => navigate("/contact")}
                  className="px-4 py-2 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600"
                >
                  Contact Us
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Add more sections as needed */}
    </div>
  );
};

export default LandingPage;
