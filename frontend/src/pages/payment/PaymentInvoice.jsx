import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const PaymentInvoice = () => {
  const [paymentDetails, setPaymentDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  const api = import.meta.env.VITE_BACKEND_URL;
  useEffect(() => {
    const getPaymentDetail = async () => {
      setLoading(true); // Start loading
      try {
        const response = await axios.get(`${api}/api/payment/detail/${id}`);
        console.log(response.data.payments);
        const sortedPayments = response.data.payments[0].sort((a, b) => {
          return new Date(b.paymentDate) - new Date(a.paymentDate); // Sort by latest paymentDate
        });
        setPaymentDetails(sortedPayments);
        setError(null); // Clear any previous errors
      } catch (error) {
        console.error('Error fetching payment details:', error);
        setError('Error loading payment details'); // Set error state
      } finally {
        setLoading(false); // Stop loading
      }
    };

    if (id) {
      getPaymentDetail(); // Fetch payment details when ID changes
    } else {
      setLoading(false); // No ID, stop loading
    }
  }, [id]);

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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading payment details: {error}</div>;
  if (!paymentDetails?.length) return <div>No payment details found</div>;

  return (
    <div className="payment-invoice min-h-screen bg-gray-800 text-white p-8">
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
        Payment Invoice
      </h2>

      {paymentDetails.map((payment, index) => (
        <div
          key={index}
          className="bg-gray-700 rounded-lg p-4 mb-6 max-h-[200vh]"
        >
          <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold mb-2">
            Invoice Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <p>
                <strong>User ID:</strong> {payment.userId}
              </p>
              <p>
                <strong>Amount:</strong> {payment.amount} {payment.currency}
              </p>
            </div>
            <div className="mb-4">
              <p>
                <strong>Payment Intent ID:</strong> {payment.paymentIntentId}
              </p>
              <p>
                <strong>Payment Date & Time:</strong>{' '}
                {payment.paymentDate && formatDateTime(payment.paymentDate)}
              </p>
            </div>
          </div>

          <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold mb-2">
              Programmes Purchased:
            </h3>
            {payment.programmes &&
              payment.programmes.map((programme) => (
                <div
                  key={programme._id}
                  className="flex flex-col md:flex-row items-center mb-4"
                >
                  <div className="w-full md:w-20 h-20 md:h-20 rounded-md overflow-hidden mb-4 md:mb-0 md:mr-4">
                    <img
                      src="https://via.placeholder.com/150"
                      alt="Programme"
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div>
                    <p className="font-semibold mb-1">
                      {/* Replace with actual programme category */}
                      {programme.category}
                    </p>
                    <p>
                      <strong>Price:</strong> {payment.amount}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PaymentInvoice;
