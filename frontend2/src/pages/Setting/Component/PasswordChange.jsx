import { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import LoadingSpinner from '../../../../LoadingSpinner'; // Adjust the path as needed

const PasswordChange = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const { user } = useSelector((state) => state.user);
  const token = user.token;
  const userId = user.user._id;

  // Access backend API URL from environment variable
  const backendapi = import.meta.env.VITE_BACKEND_URL;

  const handleButtonClick = () => {
    setIsEditing(true);
  };

  const handleOldPasswordChange = (event) => {
    setOldPassword(event.target.value);
  };

  const handleNewPasswordChange = (event) => {
    setNewPassword(event.target.value);
  };

  const handleSubmit = async () => {
    setLoading(true); // Start loading
    setError(null); // Clear previous errors
    setSuccessMessage(''); // Clear previous success messages

    try {
      // Make the API request to change the password
      const response = await axios.put(
        `${backendapi}/api/setting/password/change/${userId}`,
        {
          oldPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add the token to headers
            'Content-Type': 'application/json',
          },
        }
      );

      // Handle success
      setSuccessMessage(response.data.message);
      setIsEditing(false);
    } catch (err) {
      // Handle error
      setError(err.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="flex flex-col items-center justify-start bg-black text-white p-4">
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {successMessage && (
        <div className="text-green-500 mb-2">{successMessage}</div>
      )}

      {!isEditing ? (
        <button
          onClick={handleButtonClick}
          className="px-4 py-2 w-[50%] bg-blue-500 hover:bg-blue-700 rounded"
        >
          Change Password
        </button>
      ) : (
        <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
          <input
            type="password"
            value={oldPassword}
            onChange={handleOldPasswordChange}
            className="px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter old password"
          />
          <input
            type="password"
            value={newPassword}
            onChange={handleNewPasswordChange}
            className="px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter new password"
          />
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-500 hover:bg-green-700 rounded"
            disabled={loading} // Disable button while loading
          >
            {loading ? <LoadingSpinner /> : 'Submit'}
          </button>
        </div>
      )}
    </div>
  );
};

export default PasswordChange;
