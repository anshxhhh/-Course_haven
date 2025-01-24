import React, { useEffect, useState } from "react";
import logo from "../../public/logo.webp";
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import axios from "axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../utils/utils";

function Home() {
  const [courses, setCourses] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
      } catch (error) {
        console.log("error in fetchCourses ", error);
      }
    };
    fetchCourses();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/user/logout`, {
        withCredentials: true,
      });
      toast.success(response.data.message);
      localStorage.removeItem("user");
      setIsLoggedIn(false);
    } catch (error) {
      console.log("Error in logging out ", error);
      toast.error(error.response.data.errors || "Error in logging out");
    }
  };

  var settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    initialSlide: 0,
    autoplay: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="bg-gradient-to-r from-black to-blue-950 ">
      <div className="h-[1400px] md:h-[1300px] text-white container mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between p-6 ">
        <div className="flex items-center space-x-4">
  <div className="flex items-center space-x-2">
    <img
      src={logo}
      alt="logo"
      className="w-7 h-7 md:w-10 md:h-10 rounded-full"
    />
    <h1 className="md:text-2xl text-orange-500 font-bold">CourseHaven</h1>
  </div>
  <Link
  to="/admin/signup"
  className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white text-xs md:text-lg py-2 px-4 rounded-full shadow-md hover:from-yellow-500 hover:to-orange-500 hover:shadow-lg hover:scale-105 transform transition duration-300"
>
  Admin Signup
</Link>

</div>

          <div className="space-x-4">
            {isLoggedIn ? (
              <button
  onClick={handleLogout}
  className="bg-gradient-to-r from-red-500 to-red-700 text-white text-xs md:text-lg md:py-2 md:px-4 p-3 rounded-lg shadow-lg hover:from-red-700 hover:to-red-900 hover:shadow-xl transition duration-300 transform hover:scale-105"
>
  Logout
</button>

            ) : (
              <>
                <Link
                  to={"/login"}
                  className="bg-transparent text-white text-xs md:text-lg md:py-2 md:px-4 p-2 border border-white rounded"
                >
                  Login
                </Link>
                <Link
                  to={"/signup"}
                  className="bg-transparent text-white text-xs md:text-lg md:py-2 md:px-4 p-2 border border-white rounded"
                >
                  Signup
                </Link>
              </>
            )}
          </div>
        </header>

        {/* Hero Section */}
        <section className="text-center py-20">
          <h1 className="text-5xl font-bold text-orange-500 animate__animated animate__fadeIn">
            Discover New Skills with CourseHaven
          </h1>
          <p className="text-gray-500 mt-4 animate__animated animate__fadeIn animate__delay-1s">
            Learn from industry experts with our wide variety of courses.
          </p>
          <div className="space-x-4 mt-8 animate__animated animate__fadeIn animate__delay-2s">
            <Link
              to={"/courses"}
              className="bg-green-500 text-white p-2 md:py-3 md:px-6 rounded font-semibold hover:bg-white duration-300 hover:text-black"
            >
              Explore Courses
            </Link>
            <Link
              to={""}
              className="bg-white text-black  p-2 md:py-3 md:px-6 rounded font-semibold hover:bg-green-500 duration-300 hover:text-white"
            >
              Watch Course Videos
            </Link>
          </div>
        </section>

        {/* Course Categories */}
        <section className="py-16 bg-gray-800">
          <h2 className="text-3xl text-center font-semibold text-orange-500">Popular Course Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 mt-8">
            <div className="bg-blue-500 text-white text-center py-10 rounded-lg shadow-lg">
              <h3 className="font-semibold text-xl">Web Development</h3>
              <Link to="/courses/web-development" className="mt-4 text-white hover:text-gray-300">Explore</Link>
            </div>
            <div className="bg-green-500 text-white text-center py-10 rounded-lg shadow-lg">
              <h3 className="font-semibold text-xl">Data Science</h3>
              <Link to="/courses/data-science" className="mt-4 text-white hover:text-gray-300">Explore</Link>
            </div>
            <div className="bg-red-500 text-white text-center py-10 rounded-lg shadow-lg">
              <h3 className="font-semibold text-xl">Digital Marketing</h3>
              <Link to="/courses/digital-marketing" className="mt-4 text-white hover:text-gray-300">Explore</Link>
            </div>
            <div className="bg-yellow-500 text-white text-center py-10 rounded-lg shadow-lg">
              <h3 className="font-semibold text-xl">Graphic Design</h3>
              <Link to="/courses/graphic-design" className="mt-4 text-white hover:text-gray-300">Explore</Link>
            </div>
          </div>
        </section>

        {/* Featured Courses Slider */}
        <section className="p-10">
  <Slider {...settings}>
    {courses.map((course) => (
      <div key={course._id} className="p-4">
        <div className="relative w-full h-80 md:w-72 mx-auto transition-transform duration-500 transform hover:scale-105 hover:shadow-xl">
          <div className="bg-gradient-to-r from-indigo-600 via-blue-700 to-purple-800 rounded-lg overflow-hidden shadow-lg h-full flex flex-col">
            <img
              className="h-40 w-full object-cover transition-all duration-300 transform hover:scale-110"
              src={course.image.url}
              alt={course.title}
            />
            <div className="p-4 text-center flex-1 flex flex-col justify-between">
              <h2 className="text-xl font-semibold text-white truncate">{course.title}</h2>
              <p className="text-md text-gray-300 mt-2 truncate">{course.description}</p>
              <Link
                to={`/buy/${course._id}`}
                className="mt-6 inline-block bg-orange-500 text-white py-2 px-4 rounded-full hover:bg-blue-500 duration-300 transform hover:scale-105"
              >
                Enroll Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    ))}
  </Slider>
</section>


        {/* Partner Logos Section */}
        <section className="py-16 bg-gray-900 text-center">
          <h2 className="text-3xl text-orange-500 font-semibold">Our Partners</h2>
          <div className="flex justify-center mt-8 space-x-6">
            <img src="https://via.placeholder.com/150" alt="partner 1" className="h-16" />
            <img src="https://via.placeholder.com/150" alt="partner 2" className="h-16" />
            <img src="https://via.placeholder.com/150" alt="partner 3" className="h-16" />
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="bg-orange-500 py-12 text-center text-white">
          <h2 className="text-3xl font-semibold">Ready to Start Learning?</h2>
          <p className="mt-4 text-lg">Join thousands of learners and advance your career today!</p>
          <Link
            to="/signup"
            className="mt-6 bg-black text-white py-3 px-6 rounded-full text-xl hover:bg-white hover:text-black transition duration-300"
          >
            Get Started
          </Link>
        </section>

        {/* Footer */}
        <footer className=" px-4 my-12 bg-gray-900 text-white py-8">
  <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
    {/* Logo and Social Links */}
    <div className="flex flex-col items-center md:items-start">
      <div className="flex items-center space-x-2 mb-4">
        <img src={logo} alt="logo" className="w-12 h-12 rounded-full" />
        <h1 className="text-3xl font-bold text-orange-500">CourseHaven</h1>
      </div>
      <div className="mt-4">
        <p className="text-lg font-semibold text-gray-300 mb-2">Follow Us</p>
        <div className="flex space-x-6">
          <a href="#" className="hover:text-blue-400 text-xl transition duration-300">
            <FaFacebook />
          </a>
          <a href="#" className="hover:text-pink-600 text-xl transition duration-300">
            <FaInstagram />
          </a>
          <a href="#" className="hover:text-blue-600 text-xl transition duration-300">
            <FaTwitter />
          </a>
        </div>
      </div>
    </div>

    {/* Connect Section */}
    <div className="flex flex-col items-center md:items-start">
      <h3 className="text-xl font-semibold text-gray-300 mb-4">Connect</h3>
      <ul className="space-y-2 text-lg text-gray-400">
        <li className="hover:text-white cursor-pointer">YouTube - Learn Coding</li>
        <li className="hover:text-white cursor-pointer">Telegram - Learn Coding</li>
        <li className="hover:text-white cursor-pointer">GitHub - Learn Coding</li>
      </ul>
    </div>

    {/* Legal Section */}
    <div className="flex flex-col items-center md:items-start">
      <h3 className="text-xl font-semibold text-gray-300 mb-4">Legal</h3>
      <ul className="space-y-2 text-lg text-gray-400">
        <li className="hover:text-white cursor-pointer">Terms & Conditions</li>
        <li className="hover:text-white cursor-pointer">Privacy Policy</li>
        <li className="hover:text-white cursor-pointer">Refund & Cancellation</li>
      </ul>
    </div>
  </div>

  {/* Bottom Section */}
  <div className="mt-12 text-center text-gray-500 text-sm">
    <p>&copy; 2025 CourseHaven. All rights reserved.</p>
  </div>
</footer>

      </div>
    </div>
  );
}

export default Home;
