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
  const [hoverDashboard, setHoverDashboard] = useState(false);
  const [showCategory, setShowCategory] = useState({});
  const dashBoardLink = useDashboardLinks();

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
      console.log(error);
      toast.error('Failed to delete programme.');
    }
  };
  console.log(deleteId);

  const handleClick = () => {
    setHoverDashboard((prevState) => !prevState);
  };

  const handleCategoryToggle = (id) => {
    setShowCategory((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div
      className="grid grid-cols-9 h-screen max-w-[100vw] text-white font-sans "
      style={{
        backgroundImage: `url('https://s3-alpha-sig.figma.com/img/fb55/b466/b05afb0a4774775c1b269cd0567431cd?Expires=1725235200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=k2kKnQWDVaXS2KNjmIuXcspoOwqvjRU0TVK232dlgoBtFMW0Ofrw4lcJKMzLCZNYmG3WL~O6lbOkgJzhPfhEWq3fhj4giSAjOsC4w4ycNxInm7NrJEznDq9-xsy1sN2BcBqvUSFEYaVkRIzdHEh1qJOGsInAuSXcpwBSXHGnESfEUrrdaR0uP4zQmqmGqwgZ7z9Uijpbudfyyivqo7e8jvKRhYhm2UGFQg-qXcJax2LJxETUPE6gAHjt3GhiNK39D~Lw1AEUS~bCIbWdOSVYAA6wNhBTlKh3JwoXPVGtlvjs9PS0QLXvLIBgL9ASEfiv3fJ9l3icHusqaZFCHNzAFg__')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div
        className={`transition-transform duration-300 bg-gray-900 ${
          hoverDashboard ? 'hidden sm:hidden' : 'col-span-3 sm:col-span-1'
        }`}
      >
        <DashboardComponent
          dashBoardLink={dashBoardLink}
          hoverDashboard={hoverDashboard}
          setHoverDashboard={setHoverDashboard}
        />
      </div>
      <div
        className={`transition-transform duration-300 ${
          hoverDashboard
            ? 'col-span-9 sm:col-span-9'
            : 'col-span-6 sm:col-span-8'
        } overflow-scroll`}
      >
        <DashboardHeader />
        {hoverDashboard && (
          <div className="absolute left-0 z-10 top-[10%] animate-shake cursor-pointer hover:animate-none transition-transform duration-300">
            <BiSolidRightArrow size={40} color="orange" onClick={handleClick} />
          </div>
        )}

        <div className="grid grid-cols-3 m-auto sm:pl-5 w-full max-h-full sm:max-h-[80vh] overflow-auto">
          <div className="col-span-3 items-start justify-center overflow-auto">
            <div className="grid grid-cols-1 p-2 mr-5 sm:grid-cols-3 gap-2 overflow-auto">
              {trainerDatas.map((card) => (
                <div
                  key={card._id}
                  className="rounded-[12px] gap-[5px] min-h-[400px]  max-h-[80vh] p-4 bg-gray-950 border-2 border-orange-600 w-full sm:w-[300.4px] m-[1rem] p-auto"
                >
                  <img
                    src={card.categoryPhoto?.url || <GiAbdominalArmor />}
                    alt={card.type}
                    className="h-[249px] object-cover w-full sm:w-[300.4px] rounded-[50px] p-4 opacity-1"
                  />
                  <button
                    onClick={() => handleCategoryToggle(card._id)}
                    className="text-sm font-semibold h-[2rem] border-2 border-orange-400 w-[8rem] py-1 px-4 rounded-lg bg-transparent text-white shadow-md hover:bg-gray-500 transition-colors duration-300"
                  >
                    {showCategory[card._id] ? 'Category' : 'Show'}
                  </button>
                  {showCategory[card._id] && (
                    <div className="mt-2">
                      <p className="text-sm text-white ">
                        {card.category.join(', ')}
                      </p>
                    </div>
                  )}
                  <div className="font-sans text-1xl text-paraColor w-[90%] m-[5%] h-[10vh] overflow-hidden">
                    {/* Display only the first three items of the description */}
                    {card.desc.slice(0, 3).map((item, index) => (
                      <p key={index}>{item}</p>
                    ))}
                    {/* Show Know More button if there are more than 3 items */}
                  </div>
                  {card.desc.length > 1 && (
                    <Link to={`/trainer/${user.user._id}`}>
                      <button className="mt-2 text-orange-500 underline hover:text-blue-700 transition-colors">
                        Know More
                      </button>
                    </Link>
                  )}
                  <div className="flex justify-between">
                    <div className="text-xl text-white font-sans font-bold flex justify-center items-center m-2">
                      ${card.price}
                    </div>
                    <button
                      onClick={() => {
                        setDeleteId(card._id);
                        setShowDeletePopup(true);
                      }}
                      className="w-[3.6rem] h-[3.2rem] bg-red-500 flex items-center justify-center ml-4 mr-2 rounded-xl"
                    >
                      <MdDelete color="black" className="w-14 h-10" />
                    </button>

                    <Link to={`/trainer/programme/edit/${card._id}`}>
                      <button className="w-[3.6rem] h-[3.2rem] bg-green-500 flex items-center justify-center ml-4 mr-2 rounded-xl">
                        <MdEdit color="black" className="w-14 h-10" />
                      </button>
                    </Link>
                  </div>

                  {/* Conditional Rendering for Plan Type */}
                  {card.planType === 'Diet' && (
                    <Link
                      to={`/trainer/programme/diet/plan/${user.user._id}/${card._id}`}
                    >
                      <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300">
                        Diet Plan
                      </button>
                    </Link>
                  )}
                  {card.planType === 'Day' && (
                    <Link
                      to={`/trainer/programme/day/plan/${user.user._id}/${card._id}`}
                    >
                      <button className="mt-4 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-300">
                        Day Plan
                      </button>
                    </Link>
                  )}
                  {card.planType === 'Both' && (
                    <div className="mt-4 flex gap-4">
                      <Link
                        to={`/trainer/programme/diet/plan/${user.user._id}/${card._id}`}
                      >
                        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300">
                          Diet Plan
                        </button>
                      </Link>
                      <Link
                        to={`/trainer/programme/day/plan/${user.user._id}/${card._id}`}
                      >
                        <button className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-300">
                          Day Plan
                        </button>
                      </Link>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* New Programme Button */}
            <Link to={`/trainer/create/programme/${user.user._id}`}>
              <div className="bg-tertiary m-auto w-[80%] sm:w-[40%] flex justify-center gap-3 items-center rounded-lg mb-[5rem]">
                <div className="flex justify-center items-center">
                  <span className="text-white text-[2.5rem] flex justify-center items-center">
                    +
                  </span>
                </div>
                <div className="flex justify-center items-center placeholder">
                  <p className="text-white font-sans text-[2rem] font-bold">
                    Create New
                  </p>
                </div>
              </div>
            </Link>
          </div>
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
