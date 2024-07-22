import React, { useState } from 'react';
import { FaLinkedin, FaInstagram, FaFacebook } from 'react-icons/fa';
import axios from 'axios';
import LoadingSpinner from '../../../../LoadingSpinner'; // Adjust the path as needed
import { useSelector } from 'react-redux';

const SocialMediaLinkChange = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [linkedin, setLinkedin] = useState('');
  const [instagram, setInstagram] = useState('');
  const [facebook, setFacebook] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const { user } = useSelector((state) => state.user);
  const token = user.token;
  const userId = user.user._id;

  const backendapi = import.meta.env.VITE_BACKEND_URL;

  const handleButtonClick = () => {
    setIsEditing(true);
  };

  const handleLinkedinChange = (event) => {
    setLinkedin(event.target.value);
  };

  const handleInstagramChange = (event) => {
    setInstagram(event.target.value);
  };

  const handleFacebookChange = (event) => {
    setFacebook(event.target.value);
  };

  const handleSubmit = async () => {
    setLoading(true); // Start loading
    setError(null); // Clear previous errors
    setSuccessMessage(''); // Clear previous success messages

    try {
      // Make the API request to update social media links
      const response = await axios.post(
        `${backendapi}/api/setting/socialmedia/change/${userId}`,
        {
          linkedin,
          instagram,
          facebook,
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
          Change Social Media Links
        </button>
      ) : (
        <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:space-x-4">
          <div className="flex items-center space-x-2">
            <FaLinkedin size={24} />
            <input
              type="url"
              value={linkedin}
              onChange={handleLinkedinChange}
              className="px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="LinkedIn URL"
            />
          </div>
          <div className="flex items-center space-x-2">
            <FaInstagram size={24} />
            <input
              type="url"
              value={instagram}
              onChange={handleInstagramChange}
              className="px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Instagram URL"
            />
          </div>
          <div className="flex items-center space-x-2">
            <FaFacebook size={24} />
            <input
              type="url"
              value={facebook}
              onChange={handleFacebookChange}
              className="px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Facebook URL"
            />
          </div>
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

export default SocialMediaLinkChange;
