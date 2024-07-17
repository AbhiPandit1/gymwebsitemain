const StripePaymentFailure = () => {
  /*"/payment/failure" */
  return (
    <div className="flex justify-center items-center h-screen bg-red-500">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <svg
          className="mx-auto h-12 w-12 text-red-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
        <h2 className="text-3xl font-semibold text-gray-800 text-center mt-4">
          Payment Failed
        </h2>
        <p className="text-gray-600 text-lg text-center mt-2">
          There was an issue processing your payment. Please try again later.
        </p>
        {/* You can add more content here based on your application's needs */}
      </div>
    </div>
  );
};

export default StripePaymentFailure;
