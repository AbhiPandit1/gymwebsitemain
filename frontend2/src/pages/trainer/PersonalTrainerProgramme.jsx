import { useEffect, useState } from 'react';
import DashboardComponent from '../../component/DashboardComponent';
import DashboardHeader from '../../component/DashboardHeader';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { MdDelete, MdEdit } from 'react-icons/md';
import { GiAbdominalArmor } from 'react-icons/gi';
import useDashboardLinks from '../../../hook/CreateDahsboardLinks';
import { toast } from 'react-toastify';
import { BiSolidRightArrow } from 'react-icons/bi';

const PersonalTrainerProgramme = () => {
  const { user } = useSelector((state) => state.user);
  const { id } = useParams();
  const [trainerDatas, setTrainerDatas] = useState([]);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showCategory, setShowCategory] = useState({});
  const dashboardLink = useDashboardLinks();

  useEffect(() => {
    const getProgramme = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/admin/trainer/programme/${id}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        setTrainerDatas(response.data.programmes);
        console.log(response.data);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to fetch data.');
      }
    };
    getProgramme();
  }, [id, user.token]);

  const handleDelete = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/trainer/programme`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          data: { programmeId: deleteId },
        }
      );

      setTrainerDatas(trainerDatas.filter((data) => data._id !== deleteId));
      setShowDeletePopup(false);
      toast.success('Programme deleted successfully.');
    } catch (error) {
      toast.error('Failed to delete programme.');
    }
  };

  const handleCategoryToggle = (id) => {
    setShowCategory((prev) => ({ ...prev, [id]: !prev[id] }));
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

      <div className="grid grid-cols-1 p-2 mr-5 sm:grid-cols-3 gap-10 min-h-screen min-w-[100vw]">
        {trainerDatas?.map((card) => (
          <div
            key={card?._id}
            className="bg-gray-800 m-auto min-h-[68vh] max-w-[340px] max-h-[100vh] w-full border-b-4 border-orange-600 shadow-lg relative overflow-hidden"
          >
            <div className="relative">
              <img
                src={card?.categoryPhoto?.url || <GiAbdominalArmor />}
                alt={card?.type}
                className="h-[250px] w-full object-cover"
              />
              <Link
                to={`/trainer/${user?.user?._id}`}
                className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 z-10"
              >
                <img
                  src={user?.user?.profilePhoto?.url || <GiAbdominalArmor />}
                  alt="Trainer Profile"
                  className="w-20 h-20 rounded-full object-cover border-4 border-gray-800"
                />
              </Link>
            </div>

            <div className="p-4 pt-12 h-full">
              <h2 className="text-white text-xl font-semibold mb-2 border-b-2 border-gray-700 pb-2">
                {card.title}
              </h2>
              <h2 className="text-white text-xl font-semibold mb-2 border-b-2 border-gray-700 pb-2">
                ${card.price}
              </h2>
              <div className="relative mb-4 border-b-2 border-gray-700 pb-2 h-[5vh] overflow-hidden">
                <p className="text-white text-sm cursor-pointer overflow-hidden">
                  {card.desc}
                </p>
                {card.desc.length > 50 && (
                  <button
                    className="text-orange-400 ml-2"
                    onClick={() => alert(card.desc)}
                  >
                    See More
                  </button>
                )}
              </div>
              <h3 className="text-white text-lg font-bold mb-2">Categories</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {card.category.map((category, index) => (
                  <button
                    key={index}
                    className="bg-gray-700 text-white px-3 py-1 rounded-lg text-sm hover:bg-orange-500 transition-colors duration-300"
                  >
                    {category}
                  </button>
                ))}
              </div>
              <div className="mt-4 flex justify-between">
                <Link
                  to={`/trainer/programme/edit/${card._id}`}
                  className="flex items-center bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-400 transition-colors duration-300"
                >
                  <MdEdit className="mr-2" /> Edit
                </Link>
                <button
                  className="flex items-center bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-400 transition-colors duration-300"
                  onClick={() => {
                    setDeleteId(card._id);
                    setShowDeletePopup(true);
                  }}
                >
                  <MdDelete className="mr-2" /> Delete
                </button>
              </div>
              <div className="mt-4 flex justify-between gap-4">
                {card.planType === 'Diet' && (
                  <Link
                    to={`/trainer/programme/diet/plan/${user.user._id}/${card._id}`}
                    className="w-full"
                  >
                    <button className="bg-orange-500 w-full text-white py-2 rounded-lg hover:bg-orange-400 transition-colors duration-300">
                      Diet Plan
                    </button>
                  </Link>
                )}
                {card.planType === 'Day' && (
                  <Link
                    to={`/trainer/programme/day/plan/${card.trainerId}/${card._id}`}
                    className="w-full"
                  >
                    <button className="bg-orange-400 w-full text-white py-2 rounded-lg hover:bg-orange-300 transition-colors duration-300">
                      Day Plan
                    </button>
                  </Link>
                )}
                {card.planType === 'Both' && (
                  <>
                    <Link
                      to={`/trainer/programme/diet/plan/${user.user._id}/${card._id}`}
                      className="w-1/2"
                    >
                      <button className="bg-orange-500 w-full text-white py-2 hover:bg-orange-400 transition-colors duration-300">
                        Diet Plan
                      </button>
                    </Link>
                    <Link
                      to={`/trainer/programme/day/plan/${user.user._id}/${card._id}`}
                      className="w-1/2"
                    >
                      <button className="bg-orange-400 w-full text-white py-2 hover:bg-orange-300 transition-colors duration-300">
                        Day Plan
                      </button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
        <div className="">
          <Link to={`/trainer/create/programme/${user.user._id}`}>
            <div className="bg-tertiary m-auto w-[80%] block sm:w-[70%] justify-center items-center rounded-lg mb-[5rem] shadow-lg transition-transform transform hover:scale-105">
              <p className="text-white font-sans text-[2rem] font-bold ml-2 text-center p-4">
                Create New +
              </p>
            </div>
          </Link>
        </div>
      </div>
      {/* Delete Confirmation Popup */}
      {showDeletePopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white text-primary p-6 rounded-lg text-center">
            <p>Are you sure you want to delete this programme?</p>
            <div className="flex justify-center mt-4 gap-4">
              <button
                onClick={() => setShowDeletePopup(false)}
                className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalTrainerProgramme;
