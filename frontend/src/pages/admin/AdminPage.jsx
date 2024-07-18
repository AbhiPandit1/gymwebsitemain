import axios from 'axios';
import { useEffect, useState } from 'react';
import { LuUsers } from 'react-icons/lu';
import { FiEdit2 } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

const api = import.meta.env.VITE_BACKEND_URL;
const AdminPage = () => {
  {
    /*/admin/page/:id */
  }
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // State for showing delete confirmation modal
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user.user);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${backendapi}/api/admin/user`);

        const filteredUsers = response.data.users.filter(
          (currentUser) => currentUser._id !== user._id
        );
        setUsers(filteredUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [user._id]); // Add selectedUserId to dependency array to refetch users when it changes

  const deleteUser = async () => {
    try {
      const response = await axios.delete(`${api}/api/admin/user/${selectedUserId}`);
      if (response.status === 200) {
        toast.success('User Deleted Successfully');
        setUsers(users.filter((user) => user._id !== selectedUserId));
        setSelectedUserId(null);
      } else {
        toast.error('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Error deleting user');
    } finally {
      setShowDeleteModal(false); // Close the delete confirmation modal regardless of success or failure
    }
  };

  const handleDeleteClick = () => {
    if (!selectedUserId) {
      toast.error('Please select a user to delete');
      return;
    }
    setShowDeleteModal(true); // Show delete confirmation modal
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false); // Close delete confirmation modal without deleting
  };

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
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-black divide-y divide-white">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium uppercase"></th>
              <th className="px-6 py-3 text-left text-xl font-sans font-bold uppercase">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xl font-sans font-bold uppercase">
                Image
              </th>
              <th className="px-6 py-3 text-left text-xl font-sans font-bold uppercase">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xl font-sans font-bold uppercase">
                Role
              </th>
              <th className="px-6 py-3 text-xl font-sans font-bold uppercase text-center">
                Programmes
              </th>
              <th className="px-6 py-3 text-left text-xl font-sans font-bold uppercase">
                Edit
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white">
            {users.map((currentUser) => (
              <tr key={currentUser._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="radio"
                    className="form-radio h-5 w-5 text-white"
                    checked={selectedUserId === currentUser._id}
                    onChange={() => setSelectedUserId(currentUser._id)}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {currentUser.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {currentUser.profilePhoto}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {currentUser.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {currentUser.role}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-center">
                  {currentUser.takenProgramme ? 'Yes' : 'No'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <Link
                    to={
                      currentUser.role === 'admin' ||
                      currentUser._id === user._id
                        ? `/user/detail/${currentUser._id}`
                        : '/'
                    }
                    className="text-red-500 hover:text-red-700 focus:outline-none"
                  >
                    <FiEdit2 className="h-5 w-5" />
                  </Link>
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
                        Are you sure you want to delete this user?
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
