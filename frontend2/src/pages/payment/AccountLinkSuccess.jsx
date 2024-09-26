import { BiLeftArrow } from 'react-icons/bi';
import { Link } from 'react-router-dom';
import Header from '../../component/Header';

const AccountLinkSuccess = () => {
  return (
    <div
      style={{
        background:
          'linear-gradient(270deg, #17381A 0%, rgba(6, 33, 11, 0.746434) 32.93%, rgba(30, 86, 44, 0.5) 64.94%, #010B03 102.92%)',
      }}
      className="min-h-screen flex flex-col justify-between"
    >
      {/* Header Component */}
      <Header />

      {/* Main Content */}
      <div className="flex flex-col justify-center items-center flex-grow">
        <div className="bg-white p-10 rounded-xl shadow-2xl max-w-md w-full transform transition-all duration-500 hover:scale-105">
          <div className="flex justify-center items-center">
            <svg
              className="h-20 w-20 text-green-500 animate-pulse"
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
          </div>
          <h2 className="text-3xl font-bold text-gray-900 text-center mt-6">
            Account Link Successful!
          </h2>
          <p className="text-gray-600 text-lg text-center mt-4">
            Your account has been successfully linked.
          </p>
          <p className="text-gray-500 text-center mt-2 text-sm">
            You can now manage your account details.
          </p>
        </div>

        {/* Back to Dashboard Button */}
        <Link to="/dashboard">
          <button className="flex items-center justify-center mt-6 px-8 py-3 bg-green-600 text-white text-lg font-medium rounded-lg shadow-md hover:bg-green-500 hover:shadow-lg transform transition-all duration-300">
            <BiLeftArrow color="white" size={24} className="mr-2" />
            Back to Dashboard
          </button>
        </Link>
      </div>

      {/* Footer */}
      <footer className="text-center py-4 text-gray-400">
        © 2024 ProgramPanda. All rights reserved.
      </footer>
    </div>
  );
};

export default AccountLinkSuccess;
