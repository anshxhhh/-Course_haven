import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BACKEND_URL } from "../utils/utils";
function Buy() {
  const { courseId } = useParams();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [course, setCourse] = useState({});
  const [clientSecret, setClientSecret] = useState("");
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token; //using optional chaining to avoid crashing in case token is not there!!!

  const stripe = useStripe();
  const elements = useElements();
  const [cardError, setCardError] = useState("");

  if (!token) {
    navigate("/login");
  }
  useEffect(() => {
    const fetchBuyCourseData = async () => {
      try {
        const response = await axios.post(
          `${BACKEND_URL}/course/buy/${courseId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        console.log(response.data);
        setCourse(response.data.course);
        setClientSecret(response.data.clientSecret);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        if (error?.response?.status === 400) {
          setError("You have already purchased this course");
          navigate("/purchases");
        } else {
          setError(error?.response?.data?.error);
        }
      }
    };
    fetchBuyCourseData();
  }, [courseId]);

  const handlePurchase = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      setCardError("Stripe or Elements not loaded");
      return;
    }

    setLoading(true);
    const card = elements.getElement(CardElement);

    if (card == null) {
      setCardError("Card element not found");
      setLoading(false);
      return;
    }

    // Use your card Element with other Stripe.js APIs
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {
      setCardError(error.message);
      setLoading(false);
      setCardError(error.message);
    } else {
      console.log("[PaymentMethod Created]", paymentMethod);
    }

    if (!clientSecret) {
      setCardError("No client secret found");
      setLoading(false);
      return;
    }

    const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: card,
        billing_details: {
          name: user?.user?.firstName,
          email: user?.user?.email,
        },
      },
    });

    if (confirmError) {
      setCardError(confirmError.message);
      setLoading(false);
    } else if (paymentIntent.status === "succeeded") {
      console.log("Payment succeeded: ", paymentIntent);
      setCardError("Your payment ID: " + paymentIntent.id);

      const paymentInfo = {
        email: user?.user?.email,
        userId: user.user._id,
        courseId: courseId,
        paymentId: paymentIntent.id,
        amount: paymentIntent.amount,
        status: paymentIntent.status,
      };

      console.log("Payment info: ", paymentInfo);

      await axios
        .post(`${BACKEND_URL}/order`, paymentInfo, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        })
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
          toast.error("Error in making payment");
        });

      toast.success("Payment Successful");
      navigate("/purchases");
    }

    setLoading(false);
  };

  return (
    <>
      {error ? (
        <div className="flex justify-center items-center h-screen bg-gray-100">
          <div className="bg-red-100 text-red-700 px-6 py-4 rounded-lg shadow-md">
            <p className="text-lg font-semibold">{error}</p>
            <Link
              className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition duration-200 mt-3 flex items-center justify-center"
              to={"/purchases"}
            >
              Go to Purchases
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row space-y-6 sm:space-y-0 sm:space-x-6">
              {/* Course Details */}
              <div className="w-full sm:w-1/2 bg-white rounded-lg shadow-md p-6">
                <h1 className="text-xl font-semibold text-gray-700 underline mb-4">Order Details</h1>
                <div className="flex items-center text-center space-x-2 mb-4">
                  <h2 className="text-gray-600 text-sm">Total Price</h2>
                  <p className="text-red-500 font-bold">₹{course.price}</p>
                </div>
                <div className="flex items-center text-center space-x-2">
                  <h1 className="text-gray-600 text-sm">Course Name</h1>
                  <p className="text-red-500 font-bold">{course.title}</p>
                </div>
              </div>

              {/* Payment Box */}
              <div className="w-full sm:w-1/2 bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">Process Your Payment</h2>
                <form onSubmit={handlePurchase}>
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm mb-2"
                      htmlFor="card-number"
                    >
                      Credit/Debit Card
                    </label>
                    <CardElement
                      options={{
                        style: {
                          base: {
                            fontSize: "16px",
                            color: "#424770",
                            "::placeholder": {
                              color: "#aab7c4",
                            },
                          },
                          invalid: {
                            color: "#9e2146",
                          },
                        },
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!stripe || loading} // Disable button when loading
                    className="w-full bg-indigo-500 text-white py-2 rounded-md hover:bg-indigo-600 transition duration-200"
                  >
                    {loading ? "Processing..." : "Pay"}
                  </button>
                </form>

                {cardError && (
                  <p className="text-red-500 font-semibold text-xs mt-4">
                    {cardError}
                  </p>
                )}

                {/* Additional Payment Option */}
                <button className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition duration-200 mt-3 flex items-center justify-center">
                  <span className="mr-2">🅿️</span> Other Payment Methods
                </button>
              </div>
            </div>
          </div>
          
          {/* Additional Content / CTA Section */}
          <div className="bg-gradient-to-r from-teal-500 via-blue-500 to-purple-600 py-8 text-white text-center mt-12 rounded-xl">
            <h2 className="text-2xl font-semibold">Still not sure?</h2>
            <p className="mt-4">Explore more courses to enhance your learning experience.</p>
            <Link to="/courses" className="mt-6 inline-block bg-yellow-500 text-gray-800 py-2 px-6 rounded-md hover:bg-yellow-600 transition duration-200">
              Browse Courses
            </Link>
          </div>
        </div>
      )}

      {/* Footer Section */}
      <footer className="bg-blue-900 text-white py-6 mt-12 rounded-xl">

        <div className="container mx-auto px-4 text-center ">
          <p>&copy; 2025 YourCompany. All Rights Reserved.</p>
          <div className="mt-4">
            <a href="/privacy" className="text-gray-400 hover:text-white mx-2">Privacy Policy</a>
            <a href="/terms" className="text-gray-400 hover:text-white mx-2">Terms & Conditions</a>
            <a href="/contact" className="text-gray-400 hover:text-white mx-2">Contact Us</a>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Buy;
