import React, { useState } from "react";
import logo from "../../public/logo.webp";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../utils/utils";
function AdminSignup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
       `${BACKEND_URL}/admin/signup`,
        {
          firstName,
          lastName,
          email,
          password,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast.success(response.data.message || "Signup successful!");
      navigate("/admin/login");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.errors || "Signup failed! Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-black to-blue-950 text-white flex flex-col items-center justify-center">
      {/* Header */}
      <header className="absolute top-0 left-0 w-full flex justify-between items-center p-5">
        <div className="flex items-center space-x-3">
          <img src={logo} alt="Logo" className="w-12 h-12 rounded-full" />
          <Link to="/" className="text-2xl font-bold text-orange-500">
            CourseHaven
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <Link
            to="/admin/login"
            className="text-sm md:text-md px-4 py-2 border border-gray-500 rounded-md hover:bg-gray-700"
          >
            Login
          </Link>
          <Link
            to="/courses"
            className="text-sm md:text-md px-4 py-2 bg-orange-500 rounded-md hover:bg-orange-600"
          >
            Join now
          </Link>
        </div>
      </header>

      {/* Signup Form */}
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-[90%] max-w-md text-center">
        <h2 className="text-2xl font-bold mb-6">
          Welcome to{" "}
          <span className="text-orange-500 font-extrabold">CourseHaven</span>
        </h2>
        <p className="text-gray-400 mb-6">Just signup to mess with dashboard!</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* First Name */}
          <div className="text-left">
            <label htmlFor="firstname" className="block text-gray-400 mb-2">
              First Name
            </label>
            <input
              type="text"
              id="firstname"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Type your first name"
              required
            />
          </div>

          {/* Last Name */}
          <div className="text-left">
            <label htmlFor="lastname" className="block text-gray-400 mb-2">
              Last Name
            </label>
            <input
              type="text"
              id="lastname"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Type your last name"
              required
            />
          </div>

          {/* Email */}
          <div className="text-left">
            <label htmlFor="email" className="block text-gray-400 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="admin@example.com"
              required
            />
          </div>

          {/* Password */}
          <div className="text-left">
            <label htmlFor="password" className="block text-gray-400 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="********"
                required
              />
              <span
                className="absolute right-3 top-2/4 transform -translate-y-2/4 text-gray-400 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="text-red-500 text-sm">{errorMessage}</div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition duration-300"
          >
            Signup
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminSignup;
