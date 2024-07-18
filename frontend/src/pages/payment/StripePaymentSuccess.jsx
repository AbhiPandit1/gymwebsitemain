const StripePaymentSuccess = () => {
  {
    /*"/payment/success" */
  }
  return (
    <div className="flex justify-center items-center h-screen bg-green-500">
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
        {/* You can add more content here based on your application's needs */}
      </div>
    </div>
  );
};

export default StripePaymentSuccess;
