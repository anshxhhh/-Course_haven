import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaDiscourse, FaDownload } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { IoLogIn, IoLogOut } from "react-icons/io5";
import { RiHome2Fill } from "react-icons/ri";
import { HiMenu, HiX } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../utils/utils";

function Purchases() {
  const [purchases, setPurchase] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;

  useEffect(() => {
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
      navigate("/login");
    }
  }, [token, navigate]);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/user/purchases`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        setPurchase(response.data.courseData);
      } catch (error) {
        setErrorMessage("Failed to fetch purchase data.");
      }
    };
    fetchPurchases();
  }, [token]);

  const handleLogout = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/user/logout`, {
        withCredentials: true,
      });
      toast.success(response.data.message);
      localStorage.removeItem("user");
      navigate("/login");
      setIsLoggedIn(false);
    } catch (error) {
      toast.error(error.response?.data?.errors || "Error in logging out");
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const filteredPurchases = purchases.filter((purchase) =>
    purchase.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalSpent = purchases.reduce((sum, purchase) => sum + purchase.price, 0);
  const uniqueCourses = purchases.length;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 bg-white shadow-lg transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 w-64 z-50`}
      >
        <div className="p-5">
          <h1 className="text-2xl font-bold text-blue-600 mb-6">Dashboard</h1>
          <nav>
            <ul className="space-y-4">
              <li>
                <Link to="/" className="flex items-center text-gray-700 hover:text-blue-600">
                  <RiHome2Fill className="mr-3" /> Home
                </Link>
              </li>
              <li>
                <Link to="/courses" className="flex items-center text-gray-700 hover:text-blue-600">
                  <FaDiscourse className="mr-3" /> Courses
                </Link>
              </li>
              <li>
                <a href="#" className="flex items-center text-blue-500">
                  <FaDownload className="mr-3" /> Purchases
                </a>
              </li>
              <li>
                <Link to="/settings" className="flex items-center text-gray-700 hover:text-blue-600">
                  <IoMdSettings className="mr-3" /> Settings
                </Link>
              </li>
              <li>
                {isLoggedIn ? (
                  <button
                    onClick={handleLogout}
                    className="flex items-center text-gray-700 hover:text-red-600"
                  >
                    <IoLogOut className="mr-3" /> Logout
                  </button>
                ) : (
                  <Link to="/login" className="flex items-center text-gray-700 hover:text-blue-600">
                    <IoLogIn className="mr-3" /> Login
                  </Link>
                )}
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Sidebar Toggle Button */}
      <button
        className="fixed top-4 left-4 md:hidden bg-blue-600 text-white p-2 rounded-lg z-50"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? <HiX className="text-2xl" /> : <HiMenu className="text-2xl" />}
      </button>

      {/* Main Content */}
      <div className={`flex-1 p-8 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-0"} md:ml-64`}>
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">My Purchases</h2>

        {/* Statistics Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-lg font-bold text-gray-700">Total Spent</h3>
            <p className="text-green-600 text-2xl font-semibold">₹{totalSpent.toFixed(2)}</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-lg font-bold text-gray-700">Unique Courses</h3>
            <p className="text-blue-600 text-2xl font-semibold">{uniqueCourses}</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-lg font-bold text-gray-700">Top Pick</h3>
            <p className="text-gray-600 text-lg">
              {purchases[0]?.title || "No purchases yet"}
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search purchases..."
            className="w-full p-4 rounded-lg shadow-md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Error Message */}
        {errorMessage && <div className="text-red-500 text-center mb-6">{errorMessage}</div>}

        {/* Purchases Grid */}
        {filteredPurchases.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredPurchases.map((purchase, index) => (
              <div
                key={index}
                className="bg-white shadow-lg rounded-lg p-5 hover:shadow-xl transition-shadow"
              >
                <img
                  src={purchase.image?.url || "https://via.placeholder.com/200"}
                  alt={purchase.title}
                  className="rounded-lg w-full h-40 object-cover mb-4"
                />
                <h3 className="text-lg font-bold text-gray-700">{purchase.title}</h3>
                <p className="text-gray-500 text-sm">
                  {purchase.description.length > 80
                    ? `${purchase.description.slice(0, 80)}...`
                    : purchase.description}
                </p>
                <div className="mt-4 text-green-700 font-semibold text-sm">
                  ₹{purchase.price} only
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">No purchases found.</p>
        )}
      </div>
    </div>
  );
}

export default Purchases;
