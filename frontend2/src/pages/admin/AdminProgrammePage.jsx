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
  const dropdownRef = useRef(null);
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
    <div className="text-white min-h-[100vh] p-4 flex flex-col md:flex-row">
      <div
        className={`${
          !hoverDashboard ? 'sm:w-1/3' : 'hidden'
        } bg-tertiary transition-width duration-300 ease-in-out rounded-[32px] p-4 `}
        onClick={handleClick}
      >
        <DashboardComponent
          dashBoardLink={dashboardLink}
          hoverDashboard={hoverDashboard}
        />
      </div>
      <div
        className={`flex-1 transition-all ml-4 overflow-auto scrollbar-hide`}
      >
        {hoverDashboard && (
          <div
            className="absolute left-0 top-[50%] transform -translate-y-1/2 cursor-pointer"
            onClick={handleClick}
          >
            <BiSolidRightArrow size={80} color="white" />
          </div>
        )}
        <div>
          <DashboardHeader />
        </div>
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
              id="selectAll"
              checked={selectAll}
              onChange={handleSelectAll}
              className="form-checkbox h-5 w-5 text-white"
            />
            <label htmlFor="selectAll" className="text-sm">
              Select All
            </label>
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
