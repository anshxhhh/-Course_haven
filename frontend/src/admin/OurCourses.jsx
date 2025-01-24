import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../utils/utils";
function OurCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const admin = JSON.parse(localStorage.getItem("admin"));
  const token = admin?.token;

  if (!token) {
    toast.error("Please login to admin");
    navigate("/admin/login");
  }

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/course/courses`, {
          withCredentials: true,
        });
        setCourses(response.data.courses);
        setLoading(false);
      } catch (error) {
        console.error("Error in fetchCourses", error);
      }
    };
    fetchCourses();
  }, []);

  // Delete course
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `${BACKEND_URL}/course/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      toast.success(response.data.message);
      const updatedCourses = courses.filter((course) => course._id !== id);
      setCourses(updatedCourses);
    } catch (error) {
      console.error("Error in deleting course", error);
      toast.error(error.response?.data?.errors || "Error in deleting course");
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500 animate-pulse">Loading...</p>;
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-100 p-8 space-y-8 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8 animate-fadeIn">
        Our Courses
      </h1>
      <div className="text-center">
        <Link
          className="bg-orange-400 py-2 px-4 rounded-lg text-white font-semibold shadow-lg hover:bg-orange-500 hover:scale-105 transition-all duration-300"
          to="/admin/dashboard"
        >
          Go to Dashboard
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fadeIn">
        {courses.map((course) => (
          <div
            key={course._id}
            className="bg-white shadow-lg rounded-lg p-3 hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            {/* Course Image */}
            <img
              src={course?.image?.url}
              alt={course.title}
              className="h-28 w-full object-cover rounded-t-lg"
            />
            {/* Course Title */}
            <h2 className="text-lg font-semibold mt-3 text-gray-800">
              {course.title}
            </h2>
            {/* Course Description */}
            <p className="text-gray-600 mt-2 text-xs">
              {course.description.length > 100
                ? `${course.description.slice(0, 100)}...`
                : course.description}
            </p>
            {/* Course Price */}
            <div className="flex justify-between items-center mt-3 text-gray-800 font-bold text-sm">
              <div>
                ₹{course.price}{" "}
                <span className="line-through text-gray-500 text-xs">₹300</span>
              </div>
              <div className="text-green-600 text-xs">10% off</div>
            </div>

            <div className="flex justify-between mt-3">
              <Link
                to={`/admin/update-course/${course._id}`}
                className="bg-blue-500 text-white py-1 px-3 text-sm rounded-lg shadow-md hover:bg-blue-600 hover:scale-105 transition-all duration-300"
              >
                Update
              </Link>
              <button
                onClick={() => handleDelete(course._id)}
                className="bg-red-500 text-white py-1 px-3 text-sm rounded-lg shadow-md hover:bg-red-600 hover:scale-105 transition-all duration-300"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OurCourses;
