import axios from 'axios';
import { useEffect, useState, useRef } from 'react';
import { LuUsers } from 'react-icons/lu';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom'; // Assuming you're using react-router

const backendapi = import.meta.env.VITE_BACKEND_URL;

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [roleFilter, setRoleFilter] = useState('all');
  const [dropdownOpen, setDropdownOpen] = useState(false); // State for dropdown visibility
  const { id } = useParams();

  const { user } = useSelector((state) => state.user);
  const dropdownRef = useRef(null); // Reference for dropdown menu

  const navigate = useNavigate(); // For navigation

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
    setDropdownOpen(false); // Close the dropdown when an option is selected
    setSelectedUserIds(new Set()); // Clear selection when filter changes
    setSelectAll(false); // Uncheck "Select All" checkbox
  };

  const deleteUser = async () => {
    try {
      const response = await axios.post(
        `${backendapi}/api/admin/route/users/delete/${id}`,
        { userIds: Array.from(selectedUserIds) }, // Use the selected user IDs in the request body
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

  // Filter users based on roleFilter
  const filteredUsers = users.filter((user) =>
    roleFilter === 'all' ? true : user.role === roleFilter
  );

  // Close the dropdown when clicking outside of it
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
    <div className="bg-black text-white min-h-[100vh] font-sans">
      <div className="flex justify-between items-center p-8">
        <div className="flex items-center gap-3">
          <LuUsers color="white" size={25} />
          <h1 className="text-2xl font-bold">Users</h1>
        </div>
        <div className="m-5 flex flex-col gap-2">
          <button
            onClick={handleDeleteClick}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none"
          >
            Delete Selected
          </button>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="selectAll"
              checked={selectAll}
              onChange={handleSelectAll}
              className="form-checkbox h-5 w-5 text-white"
            />
            <label htmlFor="selectAll" className="text-sm">
              Select All
            </label>
          </div>
          <div className="relative">
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 focus:outline-none"
            >
              Filter by Role
              <svg
                className="w-5 h-5 inline ml-2"
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
                className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg"
              >
                <button
                  onClick={() => handleRoleFilterChange('all')}
                  className="block px-4 py-2 text-sm hover:bg-gray-100"
                >
                  All
                </button>
                <button
                  onClick={() => handleRoleFilterChange('trainer')}
                  className="block px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Trainer
                </button>
                <button
                  onClick={() => handleRoleFilterChange('user')}
                  className="block px-4 py-2 text-sm hover:bg-gray-100"
                >
                  User
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-black divide-y divide-white">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium uppercase">
                <input
                  type="checkbox"
                  id="selectAll"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  className="form-checkbox h-5 w-5 text-white"
                />
              </th>
              <th
                className="px-6 py-3 text-left text-xl font-sans font-bold uppercase cursor-pointer"
                onClick={() =>
                  setRoleFilter(roleFilter === 'all' ? 'all' : roleFilter)
                }
              >
                Role
              </th>
              <th className="px-6 py-3 text-left text-xl font-sans font-bold uppercase">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xl font-sans font-bold uppercase">
                Image
              </th>
              <th className="px-6 py-3 text-left text-xl font-sans font-bold uppercase">
                Email
              </th>
              <th className="px-4 py-4 whitespace-nowrap text-center">
                Programmes
              </th>
              <th className="px-6 py-3 text-left text-xl font-sans font-bold uppercase">
                Created At
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white">
            {filteredUsers.map((currentUser) => (
              <tr key={currentUser._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-white"
                    checked={selectedUserIds.has(currentUser._id)}
                    onChange={() => handleSelectUser(currentUser._id)}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {currentUser.role}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {currentUser.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {currentUser.profilePhoto?.url ? (
                    <img
                      src={currentUser.profilePhoto.url}
                      alt={`${currentUser.name}'s profile`}
                      className="w-16 h-16 object-cover rounded-full"
                    />
                  ) : (
                    'No Image'
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {currentUser.email}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-center">
                  {currentUser.hasTakenProgramme ? 'Yes' : 'No'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(currentUser.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Confirm Deletion
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete the{' '}
                        {selectedUserIds.size} selected users?
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={deleteUser}
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Delete
                </button>
                <button
                  onClick={handleCancelDelete}
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
