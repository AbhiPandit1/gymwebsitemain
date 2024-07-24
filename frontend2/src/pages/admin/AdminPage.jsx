import axios from 'axios';
import { useEffect, useState, useRef } from 'react';
import { LuUsers } from 'react-icons/lu';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import useDashboardLinks from '../../../hook/CreateDahsboardLinks';
import DashboardComponent from '../../component/DashboardComponent';
import { BiSolidRightArrow } from 'react-icons/bi';

const backendapi = import.meta.env.VITE_BACKEND_URL;

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [roleFilter, setRoleFilter] = useState('all');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const { id } = useParams();
  const [hoverDashboard, setHoverDashboard] = useState(false);

  const handleClick = () => {
    setHoverDashboard((prevState) => !prevState);
  };

  const { user } = useSelector((state) => state.user);
  const dropdownRef = useRef(null);

  const navigate = useNavigate();
  const dashboard = useDashboardLinks();

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
    <>
      <div className="bg-black text-white min-h-screen font-sans p-4 flex flex-col md:flex-row max-h-[100vh] overflow-hidden scrollbar-hide-body ">
        <div
          className={`${
            !hoverDashboard ? 'sm:w-1/3' : 'hidden'
          }  bg-tertiary rounded-lg p-4 transition-width duration-300 rounded-[32px] ease-in-out`}
          onClick={handleClick}
        >
          <DashboardComponent
            dashBoardLink={dashboard}
            hoverDashboard={hoverDashboard}
          />
        </div>
        <div className="flex-1 p-4 overflow-scroll scrollbar-hide  relative">
          {hoverDashboard ? (
            <div
              className="absolute left-0 top-[50%]  animate-shake "
              onClick={handleClick}
            >
              <BiSolidRightArrow size={80} color="white" />
            </div>
          ) : (
            ''
          )}

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
                      className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left"
                    >
                      All
                    </button>
                    <button
                      onClick={() => handleRoleFilterChange('trainer')}
                      className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left"
                    >
                      Trainer
                    </button>
                    <button
                      onClick={() => handleRoleFilterChange('user')}
                      className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left"
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
                  <th className="px-4 py-3 text-left text-sm font-medium uppercase">
                    <input
                      type="checkbox"
                      id="selectAll"
                      checked={selectAll}
                      onChange={handleSelectAll}
                      className="form-checkbox h-5 w-5 text-white"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium uppercase">
                    Role
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium uppercase">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium uppercase">
                    Image
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium uppercase">
                    Email
                  </th>
                  <th className="px-4 py-3 text-sm font-medium uppercase text-center">
                    Programmes
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium uppercase">
                    Created At
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white">
                {filteredUsers.map((currentUser) => (
                  <tr key={currentUser._id} className="hover:bg-gray-800">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        className="form-checkbox h-5 w-5 text-white"
                        checked={selectedUserIds.has(currentUser._id)}
                        onChange={() => handleSelectUser(currentUser._id)}
                      />
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {currentUser.role}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {currentUser.name}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {currentUser.profilePhoto?.url ? (
                        <img
                          src={currentUser.profilePhoto.url}
                          alt={`${currentUser.name}'s profile`}
                          className="w-10 h-10 object-cover rounded-full"
                        />
                      ) : (
                        'No Image'
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {currentUser.email}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-center">
                      {currentUser.hasTakenProgramme ? 'Yes' : 'No'}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {new Date(currentUser.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {showDeleteModal && (
            <div className="fixed z-10 inset-0 overflow-y-auto scrollbar-hide ">
              <div className="flex items-center justify-center min-h-screen px-4 py-6">
                <div className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:w-full sm:max-w-lg">
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
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
      </div>
    </>
  );
};

export default AdminPage;
