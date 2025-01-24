import React, { useState, useEffect } from "react";
import axios from "axios"; 
import { FaCircleUser } from "react-icons/fa6";
import { RiHome2Fill } from "react-icons/ri";
import { FaDiscourse } from "react-icons/fa";
import { FaDownload } from "react-icons/fa6";
import { IoMdSettings } from "react-icons/io";
import { IoLogIn, IoLogOut } from "react-icons/io5";
import { FiSearch } from "react-icons/fi";
import logo from "../../public/logo.webp";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../utils/utils";
function Courses() {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); 

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/course/courses`, {
          withCredentials: true,
        });
        setCourses(response.data.courses);
        setFilteredCourses(response.data.courses); // Initialize filteredCourses
        setLoading(false);
      } catch (error) {
        console.log("error in fetchCourses ", error);
      }
    };
    fetchCourses();
  }, []);

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter courses based on the query
    const filtered = courses.filter((course) =>
      course.title.toLowerCase().includes(query) ||
      course.description.toLowerCase().includes(query)
    );
    setFilteredCourses(filtered);
  };

  const handleLogout = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/user/logout`, {
        withCredentials: true,
      });
      toast.success(response.data.message);
      localStorage.removeItem("user");
      setIsLoggedIn(false);
      navigate("/login");
    } catch (error) {
      console.log("Error in logging out ", error);
      toast.error(error.response.data.errors || "Error in logging out");
    }
  };
 
  return (
    <div className="flex">
      <aside className="w-64 bg-gradient-to-tl from-purple-600 to-blue-700 h-screen p-5 fixed rounded-r-xl shadow-lg">
        <div className="flex items-center mb-10">
          <img src={logo} alt="Profile" className="rounded-full h-12 w-12" />
        </div>
        <nav>
          <ul>
            <li className="mb-4">
              <a href="/" className="flex items-center text-white hover:text-yellow-300 transition duration-300 transform hover:scale-105">
                <RiHome2Fill className="mr-2 text-2xl" />
                Home
              </a>
            </li>
            <li className="mb-4">
              <a href="#" className="flex items-center text-white hover:text-yellow-300 transition duration-300 transform hover:scale-105">
                <FaDiscourse className="mr-2 text-2xl" />
                Courses
              </a>
            </li>
            <li className="mb-4">
              <a href="/purchases" className="flex items-center text-white hover:text-yellow-300 transition duration-300 transform hover:scale-105">
                <FaDownload className="mr-2 text-2xl" />
                Purchases
              </a>
            </li>
            <li className="mb-4">
              <a href="#" className="flex items-center text-white hover:text-yellow-300 transition duration-300 transform hover:scale-105">
                <IoMdSettings className="mr-2 text-2xl" />
                Settings
              </a>
            </li>
            <li>
              {isLoggedIn ? (
                <a href="#" className="flex items-center text-white hover:text-yellow-300 transition duration-300 transform hover:scale-105" onClick={handleLogout}>
                  <IoLogOut className="mr-2 text-2xl" />
                  Logout
                </a>
              ) : (
                <Link to="/login" className="flex items-center text-white hover:text-yellow-300 transition duration-300 transform hover:scale-105">
                  <IoLogIn className="mr-2 text-2xl" />
                  Login
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </aside>

      <main className="ml-[20%] w-[80%] bg-white p-10">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-800">Courses</h1>
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search for a course..."
                className="border border-gray-300 rounded-l-full px-4 py-2 h-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="h-10 border border-gray-300 rounded-r-full px-4 flex items-center justify-center bg-blue-500 text-white hover:bg-blue-600 transition duration-300">
                <FiSearch className="text-xl" />
              </button>
            </div>
            <FaCircleUser className="text-4xl text-blue-600" />
          </div>
        </header>

        <div className="overflow-y-auto h-[75vh]">
          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : filteredCourses.length === 0 ? (
            <p className="text-center text-gray-500">No courses found</p>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <div key={course._id} className="border border-gray-200 rounded-lg p-6 shadow-md transition duration-300 transform hover:scale-105 hover:shadow-xl">
                  <img src={course.image.url} alt={course.title} className="rounded-lg mb-4 object-cover h-40 w-full" />
                  <h2 className="font-bold text-lg mb-2 text-gray-800">{course.title}</h2>
                  <p className="text-gray-600 mb-4">
                    {course.description.length > 100 ? `${course.description.slice(0, 100)}...` : course.description}
                  </p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-bold text-xl text-blue-500">
                      ₹{course.price}{" "}
                      <span className="text-gray-400 line-through">₹349</span>
                    </span>
                    <span className="text-green-600">20% off</span>
                  </div>
                  <Link to={`/buy/${course._id}`} className="bg-orange-500 w-full text-white px-4 py-2 rounded-lg text-center hover:bg-orange-600 transition duration-300">
                    Buy Now
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Courses;
