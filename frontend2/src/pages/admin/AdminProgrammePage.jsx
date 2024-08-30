import axios from 'axios';
import { useEffect, useState, useRef } from 'react';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { BiSolidRightArrow } from 'react-icons/bi';
import DashboardComponent from '../../component/DashboardComponent';
import DashboardHeader from '../../component/DashboardHeader';
import useDashboardLinks from '../../../hook/CreateDahsboardLinks';

const backendapi = import.meta.env.VITE_BACKEND_URL;

const AdminProgrammePage = () => {
  const [programmes, setProgrammes] = useState([]);
  const [selectedProgrammeIds, setSelectedProgrammeIds] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const dashboardLink = useDashboardLinks();

  const { user } = useSelector((state) => state.user);
  const [hoverDashboard, setHoverDashboard] = useState(false);

  const handleClick = () => {
    setHoverDashboard((prevState) => !prevState);
  };

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
  }, [user.token]);

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

  const handleDeleteClick = () => {
    if (selectedProgrammeIds.size === 0) {
      toast.error('Please select at least one programme to delete');
      return;
    }
    setShowDeleteModal(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
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

        <h1 className="text-2xl font-bold mb-4">Admin Programme</h1>
        <div className="flex items-center gap-4 mb-4">
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
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-900 divide-y divide-white">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium uppercase">
                  <input
                    type="checkbox"
                    id="selectAllTableCheckbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="form-checkbox h-5 w-5 text-white"
                  />
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
              </tr>
            </thead>
            <tbody className="divide-y divide-white">
              {programmes.map((programme) => (
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showDeleteModal && (
          <div className="fixed z-10 inset-0 overflow-y-auto">
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
                          {selectedProgrammeIds.size} selected programmes?
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    onClick={deleteProgrammes}
                    className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-500 px-4 py-2 text-base font-medium text-white shadow-sm ring-1 ring-gray-900/10 hover:bg-red-600 focus:outline-none sm:w-auto sm:text-sm"
                  >
                    Delete
                  </button>
                  <button
                    onClick={handleCancelDelete}
                    className="mt-3 inline-flex w-full justify-center rounded-md border border-transparent bg-gray-200 px-4 py-2 text-base font-medium text-gray-700 shadow-sm ring-1 ring-gray-900/10 hover:bg-gray-300 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm"
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
  );
};

export default AdminProgrammePage;
