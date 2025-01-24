import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { BACKEND_URL } from "../utils/utils";
function UpdateCourse() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const { data } = await axios.get(
          `${BACKEND_URL}/course/${id}`,
          {
            withCredentials: true,
          }
        );
        setTitle(data.course.title);
        setDescription(data.course.description);
        setPrice(data.course.price);
        setImage(data.course.image.url);
        setImagePreview(data.course.image.url);
        setLoading(false);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch course data");
        setLoading(false);
      }
    };
    fetchCourseData();
  }, [id]);

  const changePhotoHandler = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImagePreview(reader.result);
      setImage(file);
    };
  };

  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    if (image) formData.append("image", image);

    const admin = JSON.parse(localStorage.getItem("admin"));
    const token = admin?.token;

    if (!token) {
      navigate("/admin/login");
      return;
    }

    try {
      const response = await axios.put(
        `${BACKEND_URL}/course/update/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      toast.success(response.data.message || "Course updated successfully");
      navigate("/admin/our-courses");
      setTitle("");
      setPrice("");
      setImage("");
      setDescription("");
      setImagePreview("");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.errors || "Failed to update course");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 py-10 flex items-center justify-center">
      <div className="max-w-lg w-full bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-2xl font-semibold text-center mb-6 text-gray-800">
          Update Course
        </h3>
        <form onSubmit={handleUpdateCourse} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              placeholder="Enter your course title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              placeholder="Enter your course description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none h-20"
            />
          </div>

          {/* Price */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Price
            </label>
            <input
              type="number"
              placeholder="Enter your course price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Course Image */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Course Image
            </label>
            <div className="flex items-center justify-center">
              <img
                src={imagePreview || "/imgPL.webp"}
                alt="Course"
                className="w-48 h-32 object-cover rounded-md shadow-md"
              />
            </div>
            <input
              type="file"
              onChange={changePhotoHandler}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-all duration-300 focus:ring-4 focus:ring-blue-300"
          >
            Update Course
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdateCourse;
