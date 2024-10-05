import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { BiSolidRightArrow } from 'react-icons/bi';
import DashboardComponent from '../../component/DashboardComponent';
import DashboardHeader from '../../component/DashboardHeader';
import useDashboardLinks from '../../../hook/CreateDahsboardLinks';
import AdminDisselectedUserPage from './AdminDisselectedUserPage';

const backendapi = import.meta.env.VITE_BACKEND_URL;

const AdminProgrammePage = () => {
  const [programmes, setProgrammes] = useState([]);
  const [selectedProgrammeIds, setSelectedProgrammeIds] = useState(new Set());
  const [disselectedProgrammeIds, setDisselectedProgrammeIds] = useState(
    new Set()
  );

  const [selectAll, setSelectAll] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [filter, setFilter] = useState('all');
  const dashboardLink = useDashboardLinks();
  const { user } = useSelector((state) => state.user);
  const [hoverDashboard, setHoverDashboard] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  console.log(isSelected);

  useEffect(() => {
    const fetchProgrammes = async () => {
      try {
        const response = await axios.get(
          `${backendapi}/api/admin/route/programmes`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        setProgrammes(response.data.data);
      } catch (error) {
        console.error('Error fetching programmes:', error);
        toast.error('Error fetching programmes');
      }
    };

    fetchProgrammes();
  }, [user.token, filter]);

  const handleSelectProgramme = (programmeId) => {
    setSelectedProgrammeIds((prevSelectedProgrammeIds) => {
      const updatedSelectedProgrammeIds = new Set(prevSelectedProgrammeIds);
      if (updatedSelectedProgrammeIds.has(programmeId)) {
        updatedSelectedProgrammeIds.delete(programmeId);
      } else {
        updatedSelectedProgrammeIds.add(programmeId);
      }
      return updatedSelectedProgrammeIds;
    });
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedProgrammeIds(new Set());
    } else {
      setSelectedProgrammeIds(
        new Set(programmes.map((programme) => programme._id))
      );
    }
    setSelectAll(!selectAll);
  };

  const handleDeleteClick = () => {
    if (selectedProgrammeIds.size > 0) {
      setShowDeleteModal(true);
    } else {
      toast.warning('No programmes selected for deletion');
    }
  };
  const handleClick = () => {
    setHoverDashboard((prevState) => !prevState);
  };

  const deleteProgrammes = async () => {
    try {
      const response = await axios.post(
        `${backendapi}/api/admin/route/delete/programmes`,
        { programmeIds: Array.from(selectedProgrammeIds) },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success('Programmes Deleted Successfully');
        setProgrammes(
          programmes.filter(
            (programme) => !selectedProgrammeIds.has(programme._id)
          )
        );
        setSelectedProgrammeIds(new Set());
        setSelectAll(false);
      } else {
        toast.error('Failed to delete programmes');
      }
    } catch (error) {
      console.error('Error deleting programmes:', error);
      toast.error('Error deleting programmes');
    } finally {
      setShowDeleteModal(false);
    }
  };

  const sendSelectedProgrammesToBackend = async () => {
    try {
      const response = await axios.post(
        `${backendapi}/api/admin/route/selected/programme`,
        {
          programmeIds: Array.from(selectedProgrammeIds),
          isSelected: isSelected,
        },

        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success('Selected Programmes sent successfully');
      }
    } catch (error) {
      console.error('Error sending selected programmes:', error);
      toast.error('Failed to send selected programmes');
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

      <div className=" min-h-screen min-w-[100vw]">
        <h1 className="text-2xl font-bold mb-4">Admin Programme</h1>
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={handleDeleteClick}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none"
          >
            Delete Selected
          </button>
          <button
            onClick={sendSelectedProgrammesToBackend}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
          >
            Send Selected Programmes
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

          <div className="flex items-center gap-2">
            <select
              value={isSelected}
              onChange={(e) => setIsSelected(e.target.value)}
              className="px-4 py-2 bg-gray-800 text-white rounded"
            >
              <option value="true">Select</option>
              <option value="false">Remove</option>
            </select>
          </div>
        </div>

        {/* Programmes Table */}
        <div className="overflow-x-auto mb-6">
          <table className="min-w-full bg-gray-900 divide-y divide-white">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium uppercase">
                  Select
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium uppercase">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium uppercase">
                  Price
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium uppercase">
                  Trainer
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium uppercase">
                  Is Selected
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white">
              {programmes
                .filter((programme) => {
                  if (filter === 'selected') return programme.isSelected;
                  if (filter === 'notSelected') return !programme.isSelected;
                  return true; // 'all'
                })
                .map((programme) => (
                  <tr key={programme._id} className="hover:bg-secondary">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        className="form-checkbox h-5 w-5 text-white"
                        checked={selectedProgrammeIds.has(programme._id)}
                        onChange={() => handleSelectProgramme(programme._id)}
                      />
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {programme.category}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      ${programme.price}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {programme.trainer ? (
                        <div className="flex items-center">
                          {programme.trainer.profilePhoto?.url && (
                            <img
                              src={programme.trainer.profilePhoto.url}
                              alt={`${programme.trainer.name}'s profile`}
                              className="w-10 h-10 object-cover rounded-full mr-2"
                            />
                          )}
                          <div>
                            <div className="font-medium">
                              {programme.trainer.name}
                            </div>
                            <div className="text-sm text-gray-400">
                              {programme.trainer.email}
                            </div>
                          </div>
                        </div>
                      ) : (
                        'No Trainer Assigned'
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {programme.isSelected ? 'Yes' : 'No'}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
              <p className="mb-4">
                Are you sure you want to delete the selected programmes?
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  onClick={deleteProgrammes}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProgrammePage;
