import { useState } from 'react';
import { FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';
import Category1 from '../assets/Category1.png';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { useParams } from 'react-router-dom';

const ProductPage = () => {
  {
    /*"/programmes/:id" */
  }
  const price = 199; // Ensure this is a number
  const country = 'USA';
  const trainerName = 'John Doe';
  const trainerExperience = '10 years';
  const instagramLink = 'https://www.instagram.com/trainer';
  const linkedinLink = 'https://www.linkedin.com/in/trainer';
  const facebookLink = 'https://www.facebook.com/trainer';

  const { id } = useParams;

  const [checkoutDetails] = useState({
    amount: price * 100, // Stripe requires the amount in cents
    country: country,
    trainerName: trainerName,
    trainerExperience: trainerExperience,
  });

  const initiateCheckout = async () => {
    const stripePromise = loadStripe(
      'pk_test_51Pa814I7lJRhp8GEBpmlT7u9bssCwu3MtiZALmBXBIsYkeqZboK3CT8JgOpMfwLdMXyyKrFXuUAc28crTu0DmJG300zMtqLK58'
    );

    try {
      // Send checkoutDetails to your backend API to create a Stripe session
      const response = await axios.post(
        `http://localhost:3000/api/payment/checkout/${id}`,
        checkoutDetails
      );
      const session = response.data;

      // Initialize Stripe with the publishable key and redirect to checkout
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (error) {
        console.error('Error redirecting to checkout:', error);
      }
    } catch (error) {
      console.error('Error during checkout:', error.response.data);
    }
  };

  return (
    <div className="max-h-screen sm:max-h-[100vh] overflow-scroll sm:overflow-hidden relative">
      <div>
        <img
          src={Category1}
          alt="image"
          className="h-screen w-full opacity-30 bg-primary bg-repeat"
        />
      </div>

      <div className="absolute top-[15%] sm:[top-2%] z-10 text-white flex flex-col sm:flex-row justify-around w-full ">
        <div className="w-full sm:w-[100%]">
          <h1 className="flex justify-center text-2xl sm:text-4xl font-extrabold top-[10%]">
            BodyBuilding
          </h1>
          <p className="text-white font-sans w-[90%] text-xl text-ellipsis sm:leading-relaxed sm:tracking-wide first-letter:text-3xl first-letter:font-bold text-justify">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolore
            expedita quod aliquid hic quaerat at accusantium fugit eius quae!
            Excepturi perspiciatis tenetur numquam veritatis distinctio
            delectus, blanditiis deserunt vel id enim doloribus porro inventore
            ratione voluptate repellat qui alias possimus quam minima, sunt
            quibusdam magni? Odit provident soluta itaque, placeat ut illum sint
            atque reprehenderit dolorem fugiat repudiandae facere velit maiores
            molestias ad numquam nulla esse? Voluptatem pariatur, repellendus,
            sunt numquam natus exercitationem omnis libero aliquid, alias quae
            aspernatur tempore accusantium quaerat sed. Aliquid fugiat maxime,
            debitis necessitatibus eos reprehenderit doloribus non consectetur
            ex distinctio sint fuga, vero cum.
          </p>

          <div className="mt-[10%] ml-[20%] flex gap-10%">
            <h1 className="text-gray-300 font-sans text-2xl border-b">
              TIMING
            </h1>
            <p className="text-gray-100 font-sans text-2xl border-b">
              APPROX 40-60 MINUTES
            </p>
          </div>
        </div>
        <div className="w-full h-[200vh]">
          <div className="p-8 w-full bg-gray-800 rounded-lg shadow-lg">
            <h1 className="flex justify-center text-3xl font-extrabold mt-4 mb-8">
              Checkout
            </h1>
            <div className="text-white text-2xl mb-4 tracking-wider leading-relaxed">
              <p className="font-bold flex justify-center items-center gap-5">
                <span className="font-sans text-3xl">Price:</span> ${price}
              </p>
              <p className="font-bold flex justify-center items-center gap-5">
                <span className="font-bold text-3xl">Country:</span> {country}
              </p>
              <p className="font-bold flex justify-center items-center gap-5">
                <span className="font-bold text-3xl">Trainer Name:</span>{' '}
                {trainerName}
              </p>
              <p className="font-bold flex justify-center items-center gap-5">
                <span className="font-bold text-3xl">Experience:</span>{' '}
                {trainerExperience}
              </p>
            </div>
            <div className="text-white text-xl mb-8">
              <p className="font-bold mb-2">Connect with the Trainer:</p>
              <div className="flex gap-4">
                <a
                  href={instagramLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-2xl text-white hover:text-gray-300"
                >
                  <FaInstagram size={40} />
                </a>
                <a
                  href={linkedinLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-2xl text-white hover:text-gray-300"
                >
                  <FaLinkedin size={40} />
                </a>
                <a
                  href={facebookLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-2xl text-white hover:text-gray-300"
                >
                  <FaFacebook size={40} />
                </a>
              </div>
            </div>
            <div className="flex justify-center">
              <button
                className="px-8 py-4 bg-secondary rounded-xl text-white text-2xl hover:bg-blue-500 focus:outline-none"
                onClick={initiateCheckout} // Call initiateCheckout on button click
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
