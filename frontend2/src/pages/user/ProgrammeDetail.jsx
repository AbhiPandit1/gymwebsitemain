import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Header from '../../component/Header';
import { useSelector } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';
import { FaImage } from 'react-icons/fa'; // Importing an icon for placeholder
import { RxCross2 } from 'react-icons/rx';

const backendapi = import.meta.env.VITE_BACKEND_URL;
const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY_LIVE
);

const ProgrammeDetail = ({ showHeader, programmeId, closeModal }) => {
  const [singleProgramme, setSingleProgramme] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false); // New state for checkout processing

  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const token = user?.token;

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
        console.log(response.data);
      } else {
        throw new Error('Failed to fetch programme.');
      }
    } catch (error) {
      setError(
        error.response?.data?.message || 'Error fetching programme details.'
      );
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

  console.log(singleProgramme);

  const makePayment = async () => {
    if (!singleProgramme) {
      toast.error('Programme details are not available.');
      return;
    }

    setIsProcessing(true); // Start loading
    try {
      const response = await axios.post(
        `${backendapi}/api/payment/checkout/${programmeId}`,
        {
          amount: singleProgramme.price, // Convert price to cents
          country: 'USA',
          client_reference_id: user?.id, // Assuming user ID as client_reference_id
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
        throw new Error(error.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error making payment.');
    } finally {
      setIsProcessing(false); // End loading
    }
  };

  const handleCheckout = () => {
    if (user){
      makePayment();
    }
    else {
      alert('You need to be logged in first to checkout.');
      navigate('/login')
    }
  };

  

  const handleBack = () => {
    navigate(-1);
  };

  // Calculate discounted price
  const discount = 0.1; // 10% increase
  const discountedPrice = singleProgramme?.price * (1 + discount);

  return (
    <div className="flex flex-col h-screen font-sans">
      {showHeader && <Header />}
      <div className="flex-grow flex items-center justify-center p-6  overflow-auto scrollbar-hide max-h-[100vh]">
        <div className="w-full max-w-6xl bg-white shadow-lg rounded-lg mt-20 sm:mt-16 flex flex-col max-h-[60vh] min-w-[80vw] overflow-scroll scrollbar-hide sm:max-h-screen min-h-[60vh]">
          {' '}
          {/* Added min-height and min-width */}
          <Elements stripe={stripePromise}>
            <div className="relative md:flex flex-grow">
              <RxCross2
                onClick={closeModal}
                className="absolute top-2 right-2 text-black p-2 rounded-lg cursor-pointer"
                size={50}
              />

              {loading ? (
                <div className="text-center text-gray-700 text-lg">
                  Loading...
                </div>
              ) : error ? (
                <div className="text-center text-red-500 text-lg">{error}</div>
              ) : singleProgramme ? (
                <>
                  {/* Image or Icon */}
                  {singleProgramme?.categoryPhoto ? (
                    <div className="flex-shrink-0 md:w-1/2 flex ">
                      <img
                        src={singleProgramme?.categoryPhoto?.url}
                        alt={singleProgramme?.category}
                        className="w-full min-w-full max-w-[20vw] sm:min-w-[40vw]  max-h-[20vh] h-[100%]  sm:min-h-[60vh] sm:max-h-[80vh] object-cover shadow-md"
                      />
                    </div>
                  ) : (
                    <div className="flex-shrink-0 md:w-1/2 min-w-[40vw] flex justify-center items-center bg-orange-600 rounded-lg shadow-md">
                      <FaImage className="text-gray-500 text-6xl h-[100%]" />
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1 md:w-1/2 flex flex-col justify-between p-4">
                    {singleProgramme?.discount > 0 && (
                      <div className="bg-green-400 w-[60%] sm:w-[40%] text-gray-200 font-sans text-center py-1 text-xl font-semibold">
                        SALE {singleProgramme?.discount}% OFF
                      </div>
                    )}
                    <div>
                      <div className="text-3xl font-extrabold text-gray-950 font-sans">
                        {singleProgramme.title}
                      </div>

                      <p className="text-base text-gray-500 leading-relaxed mt-4">
                        {singleProgramme.desc}
                      </p>

                      <div className="flex flex-col items-start justify-start text-lg text-gray-800 mt-4">
                        <span className="font-bold text-xl">Categories:</span>
                        <div className="text-gray-600 mt-2 flex flex-wrap gap-2 text-md">
                          {singleProgramme?.category?.map((category, index) => (
                            <span key={index} className="flex-shrink-0">
                              {category}
                              {index < singleProgramme.category.length - 1 &&
                                ', '}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col items-start justify-start text-lg text-gray-800 mt-2">
                        <span className="font-bold text-xl">Price:</span>
                        <div className="flex items-center mt-2 gap-4 ">
                          {singleProgramme?.discount > 0 && (
                            <span className="text-gray-400 line-through text-lg">
                              $
                              {Math.ceil(
                                singleProgramme.price /
                                  (1 - singleProgramme.discount / 100)
                              ).toFixed(2)}
                            </span>
                          )}
                          <span className="text-gray-800 text-2xl">
                            ${singleProgramme?.price.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:justify-between mt-6">
                      <button
                        onClick={handleCheckout}
                        disabled={isProcessing} // Disable button if processing
                        className={`px-6 py-3 w-full ${
                          isProcessing
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-orange-600 hover:bg-orange-500'
                        } text-white transition duration-300 text-xl`}
                      >
                        {isProcessing ? 'Processing...' : 'Check Out'}
                      </button>
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          </Elements>
        </div>
      </div>
    </div>
  );
};

export default ProgrammeDetail;
