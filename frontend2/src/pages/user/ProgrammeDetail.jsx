import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Header from '../../component/Header';
import { useSelector } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css'; // Ensure toast styles are imported

const backendapi = import.meta.env.VITE_BACKEND_URL;
const stripePromise = loadStripe(
  'pk_test_51Pa814I7lJRhp8GEBpmlT7u9bssCwu3MtiZALmBXBIsYkeqZboK3CT8JgOpMfwLdMXyyKrFXuUAc28crTu0DmJG300zMtqLK58'
);

const ProgrammeDetail = () => {
  const [singleProgramme, setSingleProgramme] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDescription, setShowDescription] = useState(false); // Toggle description visibility
  const [showCategories, setShowCategories] = useState(false); // Toggle categories visibility

  const { programmeId } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const token = user.token;

  const fetchProgramme = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${backendapi}/api/admin/programme/${programmeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.message === 'success') {
        setSingleProgramme(response.data.singleProgramme);
      } else {
        throw new Error('Failed to fetch programme.');
      }
    } catch (error) {
      setError(error.message || 'Error fetching programme details.');
      toast.error(
        error.response?.data?.message || 'Error fetching programme details.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgramme();
  }, [programmeId]);

  const makePayment = async () => {
    if (!singleProgramme) {
      toast.error('Programme details are not available.');
      return;
    }

    try {
      const response = await axios.post(
        `${backendapi}/api/payment/checkout/${programmeId}`,
        {
          amount: singleProgramme.price, // Ensure amount is in cents
          country: 'usa',
          client_reference_id: user.id, // Assuming user ID as client_reference_id
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const session = response.data;
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (error) {
        console.log(error);
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Error making payment:', error.response);
      toast.error(error.response?.data?.error || 'Error making payment.');
    }
  };

  const handleCheckout = () => {
    makePayment();
  };

  const handleBack = () => {
    navigate(-1);
  };

  const toggleDescription = () => {
    setShowDescription((prevState) => !prevState);
  };

  const toggleCategories = () => {
    setShowCategories((prevState) => !prevState);
  };

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow flex items-center justify-center p-6">
        <div className="w-full max-w-3xl bg-gray-800 rounded-2xl shadow-lg relative overflow-hidden mt-20 sm:mt-16">
          <Elements stripe={stripePromise}>
            <div className="bg-gray-900 p-8 rounded-2xl text-white">
              {loading ? (
                <div className="text-center">Loading...</div>
              ) : error ? (
                <div className="text-center text-red-500">{error}</div>
              ) : (
                singleProgramme && (
                  <div className="space-y-6">
                    {singleProgramme.categoryPhoto && (
                      <img
                        src={singleProgramme.categoryPhoto.url}
                        alt={singleProgramme.category}
                        className="w-full h-64 object-cover rounded-md"
                      />
                    )}

                    <div className="text-2xl font-semibold">
                      {singleProgramme.title}
                    </div>

                    {showDescription && (
                      <p className="text-base leading-relaxed">
                        {singleProgramme.desc}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-lg">
                      <span className="font-medium">Category:</span>
                      <span className="bg-white text-black px-2 py-1 rounded-lg">
                        {Array.isArray(singleProgramme.category)
                          ? singleProgramme.category.join(', ')
                          : 'N/A'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-lg">
                      <span className="font-medium">Price:</span>
                      <span className="bg-white text-black px-2 py-1 rounded-lg">
                        ${singleProgramme.price}
                      </span>
                    </div>

                    <div className="flex justify-between mt-6">
                      <button
                        onClick={handleBack}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition duration-300"
                      >
                        Back
                      </button>
                      <button
                        onClick={handleCheckout}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition duration-300"
                      >
                        Check Out
                      </button>
                    </div>

                    <button
                      onClick={toggleDescription}
                      className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition duration-300"
                    >
                      {showDescription
                        ? 'Hide Description'
                        : 'Show Description'}
                    </button>

                    {singleProgramme.categoryArray && (
                      <>
                        <button
                          onClick={toggleCategories}
                          className="w-full px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-500 transition duration-300"
                        >
                          {showCategories
                            ? 'Hide Categories'
                            : 'Show Categories'}
                        </button>

                        {showCategories && (
                          <div className="mt-4 grid grid-cols-2 gap-4">
                            {singleProgramme.categoryArray.map(
                              (category, index) => (
                                <div
                                  key={index}
                                  className="bg-gray-800 text-white px-4 py-2 rounded-lg"
                                >
                                  {category}
                                </div>
                              )
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )
              )}
            </div>
          </Elements>
        </div>
      </div>
    </div>
  );
};

export default ProgrammeDetail;
