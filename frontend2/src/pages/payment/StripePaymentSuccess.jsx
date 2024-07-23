import { BiLeftArrow } from 'react-icons/bi';
import { Link } from 'react-router-dom';

const StripePaymentSuccess = () => {
  {
    /*"/payment/success" */
  }
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-green-500">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <svg
          className="mx-auto h-12 w-12 text-green-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
        <h2 className="text-3xl font-semibold text-gray-800 text-center mt-4">
          Payment Successful!
        </h2>
        <p className="text-gray-600 text-lg text-center mt-2">
          Thank you for your purchase. A confirmation email has been sent to
          your registered email address.
        </p>
      </div>
      <Link to="/programmes">
        <button className="h-[2rem] w-[6rem] rounded-md flex justify-center items-center bg-secondary mt-2 font-sans text-white">
          <BiLeftArrow color="white" size={20} />
          Back
        </button>
      </Link>
    </div>
  );
};

export default StripePaymentSuccess;
