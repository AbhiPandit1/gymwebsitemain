import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Header from '../../component/Header';

const ProgrammeDetail = () => {
  const [singleProgramme, setSingleProgramme] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const { programmeId } = useParams();
  const navigate = useNavigate();

  const stripePromise = loadStripe(
    'pk_test_51Pa814I7lJRhp8GEBpmlT7u9bssCwu3MtiZALmBXBIsYkeqZboK3CT8JgOpMfwLdMXyyKrFXuUAc28crTu0DmJG300zMtqLK58'
  );

  const fetchProgramme = async () => {
    try {
      setLoading(true);
      setError(false);
      const response = await axios.get(`/api/admin/programme/${programmeId}`);
      console.log(response);
      if (response.data.message === 'success') {
        setSingleProgramme(response.data.singleProgramme);
      } else {
        throw new Error('Failed to fetch programme.');
      }
    } catch (error) {
      setError(true);
      toast.error('Error fetching programme details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgramme();
  }, []);

  const makePayment = async () => {
    try {
      const response = await axios.post(
        `/api/payment/checkout/${programmeId}`,
        {
          amount: singleProgramme.price * 100, // Amount in cents
          country: 'usa', // Hardcoded country selection
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
      console.error('Error making payment:', error);
      toast.error(error.message);
    }
  };

  const handleCheckout = () => {
    if (singleProgramme) {
      makePayment();
    } else {
      toast.error('Programme details are not available.');
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="h-screen bg-primary max-h-screen overflow-hidden">
      <Header />
      <div className="bg-orange-500 mt-[30%] sm:mt-[10%] w-[90%] m-auto h-[60%] sm:h-[90%] rounded-[32px] relative">
        <Elements stripe={stripePromise}>
          <div className="bg-primary w-full h-full rounded-[32px] absolute top-1 left-2 border p-5 text-white">
            {loading && <div className="text-center">Loading...</div>}
            {error && (
              <div className="text-center text-red-500">
                Error loading programme details.
              </div>
            )}
            {!loading && !error && singleProgramme && (
              <div className="p-5">
                <h1 className="text-2xl font-bold">
                  {singleProgramme.category}
                </h1>
                <p className="mt-4 line-clamp-4">{singleProgramme.desc}</p>
                {singleProgramme.categoryPhoto && (
                  <img
                    src={singleProgramme.categoryPhoto.url}
                    alt={singleProgramme.category}
                    className="w-[40%] h-auto sm:h-[30vh] mt-4 rounded-md"
                  />
                )}
                <div className="mt-4">
                  <strong>Category:</strong> {singleProgramme.category}
                </div>
                <div className="mt-2">
                  <strong>Price:</strong> ${singleProgramme.price}
                </div>
                <div className="flex justify-between mt-4">
                  <button
                    onClick={handleBack}
                    className="px-4 py-2 bg-secondary text-white rounded-md"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleCheckout}
                    className="px-4 py-2 bg-green-500 text-white rounded-md"
                  >
                    Check Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </Elements>
      </div>
    </div>
  );
};

export default ProgrammeDetail;
