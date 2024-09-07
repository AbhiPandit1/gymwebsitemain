import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { BiSolidRightArrow } from 'react-icons/bi';
import DashboardComponent from '../../component/DashboardComponent';
import DashboardHeader from '../../component/DashboardHeader';
import useDashboardLinks from '../../../hook/CreateDahsboardLinks';

const backendapi = import.meta.env.VITE_BACKEND_URL;

const AdminDisselectedUserPage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState(new Set());
  const [disselectedUserIds, setDisselectedUserIds] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [filter, setFilter] = useState('all');
  const dashboardLink = useDashboardLinks();
  const { user } = useSelector((state) => state.user) || {};
  const [hoverDashboard, setHoverDashboard] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!user?.token) return;

      try {
        const response = await axios.get(
          `${backendapi}/api/admin/route/users`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        setUsers(response.data.data);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Error fetching users');
      }
    };

    fetchUsers();
  }, [user?.token, filter]);

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

  const handleDeleteClick = () => {
    if (selectedUserIds.size > 0) {
      setShowDeleteModal(true);
    } else {
      toast.warning('No users selected for deletion');
    }
  };

  const deleteUsers = async () => {
    if (!user?.token) return;

    try {
      const response = await axios.post(
        `${backendapi}/api/admin/route/delete/users`,
        { userIds: Array.from(selectedUserIds) },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success('Users Deleted Successfully');
        setUsers((prevUsers) =>
          prevUsers.filter((user) => !selectedUserIds.has(user._id))
        );
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

  const sendSelectedUsersToBackend = async () => {
    if (!user?.token) return;

    try {
      const response = await axios.post(
        `${backendapi}/api/admin/route/selected/user`,
        { userIds: Array.from(selectedUserIds) },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success('Selected Users sent successfully');
      }
    } catch (error) {
      console.error('Error sending selected users:', error);
      toast.error('Failed to send selected users');
    }
  };

  const sendDisselectedIdsToBackend = async () => {
    if (!user?.token) return;

    try {
      const response = await axios.post(
        `${backendapi}/api/admin/route/disselected/user`,
        { userIds: Array.from(disselectedUserIds) },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success('Disselected Users sent successfully');
      }
    } catch (error) {
      console.error('Error sending disselected users:', error);
      toast.error('Failed to send disselected users');
    }
  };

  const handleDisselectUser = (userId) => {
    setDisselectedUserIds((prevIds) => new Set(prevIds.add(userId)));
  };

  const handleRemoveDisselectedUser = (userId) => {
    setDisselectedUserIds(
      (prevIds) => new Set([...prevIds].filter((id) => id !== userId))
    );
  };

  return (
    <div className="grid grid-cols-9 h-screen max-w-[100vw] gap-[2rem] text-white font-sans bg-gray-900">
      <div
        className={`transition-transform duration-300 ${
          hoverDashboard ? 'hidden sm:hidden' : 'col-span-2 sm:col-span-1'
        }`}
        onClick={() => setHoverDashboard((prev) => !prev)}
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
            onClick={() => setHoverDashboard((prev) => !prev)}
          >
            <BiSolidRightArrow size={40} color="white" />
          </div>
        )}

        <h1 className="text-2xl font-bold mb-4">Admin Disselected Users</h1>
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={handleDeleteClick}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none"
          >
            Delete Selected
          </button>
          <button
            onClick={sendSelectedUsersToBackend}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
          >
            Send Selected Users
          </button>
          <button
            onClick={sendDisselectedIdsToBackend}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-blue-600 focus:outline-none"
          >
            Send Disselected Users
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
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="disselectAllCheckbox"
              checked={disselectedUserIds.size === users.length}
              onChange={() => {
                if (disselectedUserIds.size === users.length) {
                  setDisselectedUserIds(new Set());
                } else {
                  setDisselectedUserIds(new Set(users.map((u) => u._id)));
                }
              }}
              className="form-checkbox h-5 w-5 text-white"
            />
            <label htmlFor="disselectAllCheckbox" className="text-sm">
              Disselect All
            </label>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 bg-gray-800 text-white rounded"
            >
              <option value="all">All</option>
              <option value="selected">Selected</option>
              <option value="notSelected">Not Selected</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-800 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="form-checkbox h-5 w-5 text-white"
                  />
                </th>
                <th className="px-6 py-3 bg-gray-800 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 bg-gray-800 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 bg-gray-800 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-900 divide-y divide-gray-700">
              {users
                .filter((user) => {
                  if (filter === 'all') return true;
                  if (filter === 'selected')
                    return selectedUserIds.has(user._id);
                  if (filter === 'notSelected')
                    return !selectedUserIds.has(user._id);
                  return true;
                })
                .map((user) => (
                  <tr key={user._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedUserIds.has(user._id)}
                        onChange={() => handleSelectUser(user._id)}
                        className="form-checkbox h-5 w-5 text-white"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      <button
                        onClick={() => handleDisselectUser(user._id)}
                        className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 focus:outline-none"
                      >
                        Disselect
                      </button>
                      <button
                        onClick={() => handleRemoveDisselectedUser(user._id)}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none"
                      >
                        Remove Disselected
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {showDeleteModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
              <p className="mb-4">
                Are you sure you want to delete the selected users?
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={deleteUsers}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 focus:outline-none"
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

export default AdminDisselectedUserPage;
