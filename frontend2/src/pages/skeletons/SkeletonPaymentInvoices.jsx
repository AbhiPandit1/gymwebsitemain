const SkeletonPaymentInvoices = () => (
  <div className="payment-invoice min-h-screen bg-gray-800 text-white p-8">
    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gray-700 rounded-lg h-8 w-1/2 animate-pulse"></h2>

    <div className="bg-gray-700 rounded-lg p-4 mb-6 max-h-[200vh] animate-pulse">
      <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold mb-2 bg-gray-600 rounded-lg h-6 w-3/4"></h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="mb-4">
          <p className="bg-gray-600 rounded-lg h-4 w-3/4 mb-2"></p>
          <p className="bg-gray-600 rounded-lg h-4 w-1/2"></p>
        </div>
        <div className="mb-4">
          <p className="bg-gray-600 rounded-lg h-4 w-3/4 mb-2"></p>
          <p className="bg-gray-600 rounded-lg h-4 w-1/2"></p>
        </div>
      </div>

      <div className="bg-gray-700 rounded-lg p-4 mt-4 animate-pulse">
        <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold mb-2 bg-gray-600 rounded-lg h-6 w-3/4"></h3>
        <div className="flex flex-col md:flex-row items-center mb-4">
          <div className="w-full md:w-20 h-20 md:h-20 rounded-md bg-gray-600 mb-4 md:mb-0 md:mr-4"></div>
          <div className="bg-gray-600 rounded-lg h-4 w-3/4 mb-2"></div>
          <div className="bg-gray-600 rounded-lg h-4 w-1/2"></div>
        </div>
      </div>
    </div>
  </div>
);

export default SkeletonPaymentInvoices;
