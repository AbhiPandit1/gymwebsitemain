import axios from 'axios';
import { useEffect, useState, useRef } from 'react';
import { LuUsers } from 'react-icons/lu';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { BiSolidRightArrow } from 'react-icons/bi';

import DashboardComponent from '../../component/DashboardComponent';
import DashboardHeader from '../../component/DashboardHeader';
import useDashboardLinks from '../../../hook/CreateDahsboardLinks';

const backendapi = import.meta.env.VITE_BACKEND_URL;

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [roleFilter, setRoleFilter] = useState('all');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { id } = useParams();
  const [hoverDashboard, setHoverDashboard] = useState(false);

  const handleClick = () => {
    setHoverDashboard((prevState) => !prevState);
  };

  const { user } = useSelector((state) => state.user);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const dashboardLink = useDashboardLinks(); // Ensure this hook is implemented correctly

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `${backendapi}/api/admin/route/users`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        const filteredUsers = response.data.users.filter(
          (currentUser) => currentUser._id !== user._id
        );
        setUsers(filteredUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Error fetching users');
      }
    };

    fetchUsers();
  }, [user._id, user.token]);

  const handleSelectUser = (userId) => {
    setSelectedUserIds((prevSelectedUserIds) => {
      const updatedSelectedUserIds = new Set(prevSelectedUserIds);
      if (updatedSelectedUserIds.has(userId)) {
        updatedSelectedUserIds.delete(userId);
      } else {
        updatedSelectedUserIds.add(userId);
      }
      return updatedSelectedUserIds;
    });
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedUserIds(new Set());
    } else {
      setSelectedUserIds(new Set(users.map((user) => user._id)));
    }
    setSelectAll(!selectAll);
  };

  const handleRoleFilterChange = (role) => {
    setRoleFilter(role);
    setDropdownOpen(false);
    setSelectedUserIds(new Set());
    setSelectAll(false);
  };

  const deleteUser = async () => {
    try {
      const response = await axios.post(
        `${backendapi}/api/admin/route/users/delete/${id}`,
        { userIds: Array.from(selectedUserIds) },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success('Users Deleted Successfully');
        setUsers(users.filter((user) => !selectedUserIds.has(user._id)));
        setSelectedUserIds(new Set());
        setSelectAll(false);
      } else {
        toast.error('Failed to delete users');
      }
    } catch (error) {
      console.error('Error deleting users:', error);
      toast.error('Error deleting users');
    } finally {
      setShowDeleteModal(false);
    }
  };

  const handleDeleteClick = () => {
    if (selectedUserIds.size === 0) {
      toast.error('Please select at least one user to delete');
      return;
    }
    setShowDeleteModal(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  const fetchRevenueDetails = async (trainerId) => {
    try {
      if (trainerId) {
        navigate(`/payment/invoices/${trainerId}`);
      } else {
        toast.error('Invalid trainer ID');
      }
    } catch (error) {
      console.error('Error fetching revenue details:', error);
      toast.error('Error fetching revenue details');
    }
  };

  const handleShowRevenue = (trainerId) => {
    fetchRevenueDetails(trainerId);
  };

  const filteredUsers = users.filter((user) =>
    roleFilter === 'all' ? true : user.role === roleFilter
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

      <div className=" min-h-screen min-w-[100vw]">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            <LuUsers color="white" size={25} />
            <h1 className="text-2xl font-bold">Users</h1>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <button
              onClick={handleDeleteClick}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none"
            >
              Delete Selected
            </button>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="selectAllCheckbox"
                checked={selectAll}
                onChange={handleSelectAll}
                className="form-checkbox h-5 w-5 text-white"
              />
              <label htmlFor="selectAllCheckbox" className="text-sm">
                Select All
              </label>
            </div>
            <div className="relative">
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 focus:outline-none flex items-center"
              >
                Filter by Role
                <svg
                  className="w-5 h-5 ml-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {dropdownOpen && (
                <div
                  ref={dropdownRef}
                  className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg z-10"
                >
                  <button
                    onClick={() => handleRoleFilterChange('all')}
                    className="block px-4 py-2 text-sm hover:bg-gray-200 w-full text-left"
                  >
                    All
                  </button>
                  <button
                    onClick={() => handleRoleFilterChange('admin')}
                    className="block px-4 py-2 text-sm hover:bg-gray-200 w-full text-left"
                  >
                    Admin
                  </button>
                  <button
                    onClick={() => handleRoleFilterChange('user')}
                    className="block px-4 py-2 text-sm hover:bg-gray-200 w-full text-left"
                  >
                    User
                  </button>
                  <button
                    onClick={() => handleRoleFilterChange('trainer')}
                    className="block px-4 py-2 text-sm hover:bg-gray-200 w-full text-left"
                  >
                    Trainer
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map((user) => (
            <div
              key={user._id}
              className={`p-4 bg-gray-800 rounded-lg ${
                selectedUserIds.has(user._id) ? 'border-2 border-blue-500' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">{user.name}</h2>
                {user.role === 'trainer' && (
                  <button
                    onClick={() => handleShowRevenue(user._id)}
                    className="text-blue-400 hover:underline"
                  >
                    Show Revenue
                  </button>
                )}
              </div>
              <p className="text-sm text-gray-400">{user.email}</p>
              <p className="text-sm text-gray-400">Role: {user.role}</p>
              <input
                type="checkbox"
                checked={selectedUserIds.has(user._id)}
                onChange={() => handleSelectUser(user._id)}
                className="form-checkbox h-5 w-5 mt-2 text-white"
              />
            </div>
          ))}
        </div>

        {showDeleteModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
              <p className="mb-4">
                Are you sure you want to delete the selected users?
              </p>
              <div className="flex gap-4">
                <button
                  onClick={deleteUser}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Confirm
                </button>
                <button
                  onClick={handleCancelDelete}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
