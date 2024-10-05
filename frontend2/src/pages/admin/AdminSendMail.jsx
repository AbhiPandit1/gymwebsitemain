import React, { useState } from 'react';
import axios from 'axios';
import { BiSolidRightArrow } from 'react-icons/bi';
import DashboardComponent from '../../component/DashboardComponent';
import DashboardHeader from '../../component/DashboardHeader'; // Import the DashboardHeader component
import useDashboardLinks from '../../../hook/CreateDahsboardLinks';
import { useSelector } from 'react-redux';

const backendapi = import.meta.env.VITE_BACKEND_URL;

const AdminSendMail = () => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [recipientType, setRecipientType] = useState('user'); // New state for recipient type
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [hoverDashboard, setHoverDashboard] = useState(false);
  const [showDashboard, setShowDashboard] = useState(true);

  const dashboardLink = useDashboardLinks();

  const handleClick = () => {
    setHoverDashboard((prevState) => !prevState);
  };

  const { user } = useSelector((state) => state.user);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await axios.post(
        `${backendapi}/api/admin/route/send/advertisment`,
        {
          subject,
          message,
          recipientType, // Include recipientType in the request body
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setSuccess('Email sent successfully!');
      setSubject('');
      setMessage('');
    } catch (err) {
      setError('Failed to send email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="grid grid-cols-9 max-w-[100vw] text-white font-sans"
      style={{
        background:
          'linear-gradient(180deg, #050c1e 0%, #050c1e 40%, #050c1e 70%, #050c1e 100%)',
      }}
    >
      <div className="col-span-9 sticky top-0 z-50">
        <DashboardHeader />
      </div>

      <div className=" min-h-screen min-w-[100vw] flex justify-center items-center">
        <div className="flex flex-col mb-4 gap-4">
          <h2 className="text-3xl font-semibold mb-6 text-white text-center">
            Send Advertisement Email
          </h2>
          <form
            onSubmit={handleSubmit}
            className="max-w-4xl  bg-black shadow-lg p-6 rounded-lg"
          >
            <div className="flex flex-col mb-4">
              <label
                htmlFor="recipientType"
                className="font-medium mb-2 text-white"
              >
                Send to
              </label>
              <select
                id="recipientType"
                value={recipientType}
                onChange={(e) => setRecipientType(e.target.value)}
                className="p-3 bg-gray-800 border border-gray-600 rounded-md shadow-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="user">Users</option>
                <option value="trainer">Trainers</option>
                <option value="all">All</option> {/* Added option for 'all' */}
              </select>
            </div>
            <div className="flex flex-col mb-4">
              <label htmlFor="subject" className="font-medium mb-2 text-white">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                className="p-3 bg-gray-800 border border-gray-600 rounded-md shadow-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter the subject"
              />
            </div>
            <div className="flex flex-col mb-4">
              <label htmlFor="message" className="font-medium mb-2 text-white">
                Message
              </label>
              <textarea
                id="message"
                rows="6"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                className="p-3 bg-gray-800 border border-gray-600 rounded-md shadow-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your message"
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full p-3 rounded-md text-white font-semibold ${
                loading ? 'bg-gray-600' : 'bg-blue-600 hover:bg-blue-700'
              } transition duration-300 ease-in-out`}
            >
              {loading ? 'Sending...' : 'Send Email'}
            </button>
            {error && <p className="text-red-400 text-center mt-4">{error}</p>}
            {success && (
              <p className="text-green-400 text-center mt-4">{success}</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminSendMail;
