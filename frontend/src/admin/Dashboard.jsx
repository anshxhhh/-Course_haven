import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../public/admin2.png";
import toast from "react-hot-toast";
import axios from "axios";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { BACKEND_URL } from "../utils/utils";
function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/admin/logout`, {
        withCredentials: true,
      });
      toast.success(response.data.message);
      localStorage.removeItem("admin");
    } catch (error) {
      console.log("Error in logging out ", error);
      toast.error(error.response?.data?.errors || "Error in logging out");
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-r from-blue-50 to-indigo-100">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "w-64" : "w-16"
        } bg-white shadow-lg p-5 flex flex-col justify-between transition-all duration-300`}
      >
        <div>
          {/* Logo & Toggle */}
          <div className="flex items-center justify-between mb-8">
            <img
              src={logo}
              alt="Profile"
              className={`rounded-full ${
                isSidebarOpen ? "h-24 w-24" : "h-12 w-12"
              } shadow-md border-2 border-gray-200 transform hover:scale-110 transition-transform duration-300`}
            />
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-gray-600 text-2xl focus:outline-none hover:text-gray-800"
            >
              {isSidebarOpen ? <HiX /> : <HiMenuAlt3 />}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col space-y-4">
            <Link to="/admin/our-courses">
              <button className="w-full bg-green-600 hover:bg-green-500 text-white py-3 rounded-lg shadow-md transform hover:translate-y-1 transition-transform duration-300">
                {isSidebarOpen ? "Our Courses" : "📚"}
              </button>
            </Link>
            <Link to="/admin/create-course">
              <button className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg shadow-md transform hover:translate-y-1 transition-transform duration-300">
                {isSidebarOpen ? "Create Course" : "➕"}
              </button>
            </Link>
            <Link to="/">
              <button className="w-full bg-red-600 hover:bg-red-500 text-white py-3 rounded-lg shadow-md transform hover:translate-y-1 transition-transform duration-300">
                {isSidebarOpen ? "Home" : "🏠"}
              </button>
            </Link>
            <Link to="/admin/login">
              <button
                onClick={handleLogout}
                className="w-full bg-yellow-500 hover:bg-yellow-400 text-white py-3 rounded-lg shadow-md transform hover:translate-y-1 transition-transform duration-300"
              >
                {isSidebarOpen ? "Logout" : "🚪"}
              </button>
            </Link>
          </nav>
        </div>

        {/* Footer */}
        <div
          className={`text-center text-gray-400 text-sm ${
            isSidebarOpen ? "animate-fadeIn" : "hidden"
          }`}
        >
          &copy; {new Date().getFullYear()} Admin Dashboard
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow flex flex-col items-center justify-center p-6">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-4 text-center">
          Welcome to the Admin Dashboard!
        </h1>
        <p className="text-lg text-gray-600 text-center">
          Manage your courses, create new content, and explore.
        </p>
        <div className="mt-8">
          <Link to="/admin/create-course">
            <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-500 transition-all duration-300">
              Create Your First Course
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
