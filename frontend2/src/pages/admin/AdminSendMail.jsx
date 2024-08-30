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
    <div className="grid grid-cols-9 h-screen max-w-[100vw] gap-[2rem] text-white font-sans bg-gray-900">
      <div
        className={`transition-transform duration-300 ${
          hoverDashboard ? 'hidden sm:hidden' : 'col-span-2 sm:col-span-1'
        }`}
        onClick={handleClick}
      >
        <DashboardComponent
          dashBoardLink={dashboardLink}
          hoverDashboard={hoverDashboard}
        />
      </div>
      <div
        className={`transition-transform duration-300 ${
          hoverDashboard
            ? 'col-span-9 sm:col-span-9'
            : 'col-span-7 sm:col-span-8'
        } overflow-y-scroll`}
      >
        <DashboardHeader />
        {hoverDashboard && (
          <div
            className="absolute left-0 top-[10%] animate-shake cursor-pointer hover:animate-none transition-transform duration-300"
            onClick={handleClick}
          >
            <BiSolidRightArrow size={40} color="white" />
          </div>
        )}
        {/* Dashboard Header */}

        <h2 className="text-3xl font-semibold mb-6 text-white text-center">
          Send Advertisement Email
        </h2>
        <form
          onSubmit={handleSubmit}
          className="max-w-4xl mx-auto bg-black shadow-lg p-6 rounded-lg"
        >
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
  );
};

export default AdminSendMail;
