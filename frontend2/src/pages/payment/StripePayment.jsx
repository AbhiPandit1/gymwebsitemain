import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement } from '@stripe/react-stripe-js';
import axios from 'axios';

const backendapi = import.meta.env.VITE_BACKEND_URL;
const StripePayment = ({ amount }) => {
  const stripePromise = loadStripe(import.meta.process.env.STRIPE_LOAD);

  const [country, setCountry] = useState('inr');
  console.log(amount);
  console.log(country);

  const makePayment = async () => {
    const response = await axios.post(`${backendapi}/api/payment/checkout`, {
      amount: 200,
      country: 'inr',
    });
    console.log(response);

    const session = response.data;

    const stripe = await stripePromise;
    const { error } = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (error) {
      console.error('Error redirecting to checkout:', error);
    }
  };

  return (
    <Elements stripe={stripePromise}>
      <form className="h-[100vh] bg-black text-white flex flex-col justify-center items-center">
        <h1 className="text-white">
          {country} amount: {amount}
        </h1>

        {/* Stripe CardElement */}
        <CardElement options={{ style: { base: { fontSize: '16px' } } }} />

        <button type="button" onClick={makePayment}>
          Pay
        </button>
      </form>
    </Elements>
  );
};

export default StripePayment;
