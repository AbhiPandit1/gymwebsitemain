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
  const [showDescription, setShowDescription] = useState(false); // State to toggle description visibility
  const [showCategories, setShowCategories] = useState(false); // State to toggle category visibility

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
          amount: singleProgramme.price * 100, // Ensure amount is in cents
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
    setShowDescription((prevState) => !prevState); // Toggle the description visibility
  };

  const toggleCategories = () => {
    setShowCategories((prevState) => !prevState); // Toggle the categories visibility
  };

  return (
    <div className="bg-primary min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-4xl bg-orange-500 rounded-2xl shadow-lg relative overflow-hidden mt-[30vh] sm:mt-[20%]">
          <Elements stripe={stripePromise}>
            <div className="bg-primary p-6 rounded-2xl text-white">
              {loading && <div className="text-center">Loading...</div>}
              {error && <div className="text-center text-red-500">{error}</div>}
              {!loading && !error && singleProgramme && (
                <div className="space-y-4">
                  {showDescription && (
                    <p className="text-lg mb-4">{singleProgramme.desc}</p>
                  )}
                  {singleProgramme.categoryPhoto && (
                    <img
                      src={singleProgramme.categoryPhoto.url}
                      alt={singleProgramme.category}
                      className="w-full h-auto max-h-60 object-cover rounded-md mb-4"
                    />
                  )}
                  <div className="text-lg font-semibold mb-4">
                    Category:{' '}
                    <span className="inline-block bg-white text-black px-2 py-1 rounded-md">
                      {Array.isArray(singleProgramme.category)
                        ? singleProgramme.category.join(', ')
                        : 'N/A'}
                    </span>
                  </div>
                  <div className="text-lg font-semibold mb-4">
                    Price: ${singleProgramme.price}
                  </div>
                  <div className="flex justify-between mb-4">
                    <button
                      onClick={handleBack}
                      className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-secondary-dark transition"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleCheckout}
                      className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                    >
                      Check Out
                    </button>
                  </div>
                  <button
                    onClick={toggleDescription}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                  >
                    {showDescription ? 'Hide Description' : 'Show Description'}
                  </button>
                  {singleProgramme.categoryArray && (
                    <>
                      <button
                        onClick={toggleCategories}
                        className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition"
                      >
                        {showCategories ? 'Hide Categories' : 'Show Categories'}
                      </button>
                      {showCategories && (
                        <div className="mt-4 space-y-2">
                          {singleProgramme.categoryArray.map(
                            (category, index) => (
                              <div
                                key={index}
                                className="flex items-center space-x-4"
                              >
                                <div className="bg-white text-black px-4 py-2 rounded-md">
                                  {category}
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </Elements>
        </div>
      </div>
    </div>
  );
};

export default ProgrammeDetail;
