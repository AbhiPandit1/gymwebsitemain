import { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const ComplaintForm = () => {
  const [isComplain, setIsComplain] = useState(false);
  const [complain, setComplain] = useState('');
  const [complainSubmitted, setComplainSubmitted] = useState(false);
  const [loading, setLoading] = useState(false); // State to manage loading
  const { user } = useSelector((state) => state.user);
  const token = user.token;
  const userId = user.user._id;
  const backendapi = import.meta.env.VITE_BACKEND_URL;

  const handleComplainButtonClick = () => {
    setIsComplain(true);
    setComplainSubmitted(false);
  };

  const handleComplainChange = (event) => {
    setComplain(event.target.value);
  };

  const handleComplainSubmit = async () => {
    setLoading(true); // Start loading
    setComplainSubmitted(false); // Reset submission state

    try {
      // Submit complaint to backend
      const response = await axios.post(
        `${backendapi}/api/setting/complain/${userId}`, // Correct endpoint URL
        { complaintText: complain }, // Correct payload structure
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add the token to headers
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        setComplainSubmitted(true);
        toast.success('Complaint Registered');
        setComplain(''); // Clear the complaint field
      }
    } catch (error) {
      console.error('Error submitting complaint:', error);
    } finally {
      setLoading(false); // End loading
      setTimeout(() => {
        setComplainSubmitted(false);
      }, 30000); // 30 seconds
    }
  };

  return (
    <div className="flex flex-col items-center justify-start bg-black text-white p-4 font-sans">
      {!isComplain ? (
        <button
          onClick={handleComplainButtonClick}
          className="px-4 py-2 bg-red-500 w-[50%] hover:bg-red-700 rounded"
        >
          Submit a Complaint
        </button>
      ) : (
        <div className="flex flex-col space-y-4 mt-4">
          <textarea
            value={complain}
            onChange={handleComplainChange}
            className="px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Write your complaint here..."
            rows="4"
          />
          <button
            onClick={handleComplainSubmit}
            className="px-4 py-2 bg-green-500 hover:bg-green-700 rounded"
            disabled={loading} // Disable button while loading
          >
            {loading ? 'Submitting...' : 'Submit Complaint'}
          </button>
        </div>
      )}

      {complainSubmitted && (
        <p className="mt-4 text-white">
          Your complaint has been registered. We will contact you within 24
          hours regarding your complaint.
        </p>
      )}
    </div>
  );
};

export default ComplaintForm;
