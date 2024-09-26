import { loadStripe } from '@stripe/stripe-js';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../component/Header';

// Load Stripe using your publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const StripeAccount = () => {
  const { user } = useSelector((state) => state.user);
  const backendApi = import.meta.env.VITE_BACKEND_URL;
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleClick = async () => {
    setLoading(true);
    setErrorMessage('');

    try {
      const stripe = await stripePromise;

      if (!stripe) throw new Error('Stripe failed to initialize');
      const url = `${backendApi}/api/payment/create/account/${user.user._id}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.error || 'Failed to create account link');
      }

      const accountResponse = await response.json();

      if (accountResponse.url) {
        window.location.href = accountResponse.url; // Redirect to Stripe onboarding
      } else {
        console.error('Account link URL missing in the response');
        setErrorMessage('Failed to retrieve account link. Please try again.');
      }
    } catch (error) {
      setErrorMessage(`Error: ${error.message}`);
      console.error('Error during Stripe account creation:', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-50"
      style={{
        background: 'linear-gradient(180deg, #050c1e 0%, #050c1e 100%)',
      }}
    >
      {/* Header */}
      <Header />

      <div className="min-h-screen flex flex-col justify-center items-center">
        <h1 className="text-center text-4xl font-bold text-white mb-2">
          Payments Dashboard
        </h1>
        <p className="text-center text-white mb-6">
          Easily connect your account to Stripe for hassle-free payments.
        </p>

        {/* Main Content */}
        <div className="bg-white p-10 rounded-xl shadow-2xl max-w-md w-full transform transition-all duration-500 hover:scale-105">
          <h2 className="text-3xl font-bold text-center text-purple-600 mb-6">
            Create a Stripe Account
          </h2>

          <p className="text-gray-600 text-center mb-4">
            Connect your account with Stripe to start managing payments.
          </p>

          {errorMessage && (
            <p className="text-red-600 text-center mb-4">{errorMessage}</p>
          )}

          <button
            onClick={handleClick}
            disabled={loading}
            className={`w-full py-3 px-6 rounded-lg text-lg font-semibold text-white ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-700 shadow-lg transition duration-300'
            }`}
          >
            {loading ? 'Processing...' : 'Connect with Stripe'}
          </button>

          <div className="flex justify-center mt-6">
            <Link to="/dashboard" className="text-center text-white w-full">
              <button className="w-full py-3 px-6 rounded-lg text-lg font-semibold bg-blue-600 hover:bg-blue-700 shadow-lg transition duration-300">
                Check Your Dashboard
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StripeAccount;
