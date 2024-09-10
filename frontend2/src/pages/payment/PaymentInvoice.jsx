import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux'; // Import useSelector to get token
import HomeSkeleton from '../skeletons/HomeSkeleton';

const backendapi = import.meta.env.VITE_BACKEND_URL;

const PaymentInvoice = () => {
  const [paymentDetails, setPaymentDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user } = useSelector((state) => state.user); // Retrieve token from Redux store
  const token = user?.token; // Use optional chaining to handle undefined user

  useEffect(() => {
    const getPaymentDetail = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${backendapi}/api/payment/detail/${user.user._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include JWT token in request headers
            },
          }
        );

        const sortedPayments = response?.data?.payments
          ?.flat()
          .sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate));
        setPaymentDetails(sortedPayments);
        setError(null);
      } catch (error) {
        console.error('Error fetching payment details:', error);
        setError(
          error.response?.data?.message || 'Error loading payment details'
        );
      } finally {
        setLoading(false);
      }
    };

    if (user.user._id && token) {
      getPaymentDetail();
    } else {
      setLoading(false);
    }
  }, [user.user._id, token]);

  const formatDateTime = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) return <HomeSkeleton />;
  if (error) return <div className="text-red-500 text-center">{error}</div>;
  if (!paymentDetails.length)
    return (
      <div className="text-white min-h-[100vh] flex justify-center items-center">
        No payment details found
      </div>
    );

  return (
    <div className="payment-invoice min-h-screen bg-gray-900 text-white p-8">
      <h2 className="text-4xl md:text-5xl font-bold text-center mb-8">
        Payment Invoice
      </h2>

      {paymentDetails.map((payment, index) => (
        <div key={index} className="bg-gray-800 shadow-md rounded-lg p-6 mb-8">
          <h3 className="text-2xl md:text-3xl font-semibold mb-4 text-gray-100">
            Invoice #{index + 1}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="mb-2">
                <strong>User ID:</strong> {payment.userId}
              </p>
              <p className="mb-2">
                <strong>Amount:</strong> {payment.amount} {payment.currency}
              </p>
            </div>
            <div>
              <p className="mb-2">
                <strong>Payment Intent ID:</strong> {payment.paymentIntentId}
              </p>
              <p className="mb-2">
                <strong>Payment Date & Time:</strong>{' '}
                {formatDateTime(payment.paymentDate)}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="text-xl font-semibold text-gray-100 mb-4">
              Programmes Purchased:
            </h4>
            <div className="grid grid-cols-1 gap-4">
              {payment.programmes &&
                payment.programmes.map((programme) => (
                  <div
                    key={programme._id}
                    className="flex items-center bg-gray-700 rounded-lg p-4"
                  >
                    <div className="w-20 h-20 rounded-md overflow-hidden mr-4">
                      <img
                        src={
                          programme.imageUrl ||
                          'https://via.placeholder.com/150'
                        }
                        alt="Programme"
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div>
                      <p className="text-lg font-semibold">
                        {programme.category}
                      </p>
                      <p>
                        <strong>Price:</strong> {programme.price}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PaymentInvoice;
