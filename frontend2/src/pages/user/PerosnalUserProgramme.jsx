import { IoIosArrowRoundForward } from 'react-icons/io';
import DashboardComponent from '../../component/DashboardComponent';
import DashboardHeader from '../../component/DashboardHeader';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ImCheckboxChecked } from 'react-icons/im';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import useDashboardLinks from '../../../hook/CreateDahsboardLinks';
import { BiSolidRightArrow } from 'react-icons/bi';
import SkeletonLoader from '../skeletons/SkeletonLoader';

const backendapi = import.meta.env.VITE_BACKEND_URL;

const PersonalUserProgramme = () => {
  const { user } = useSelector((state) => state.user);
  const token = user.token;

  const dashboardLink = useDashboardLinks();
  const [trainerDatas, setTrainerDatas] = useState([]);
  const [hoverDashboard, setHoverDashboard] = useState(false);
  const [showCategory, setShowCategory] = useState({});

  useEffect(() => {
    const getPersonalProgramme = async () => {
      try {
        const response = await axios.get(
          `${backendapi}/api/after/user/${user.user._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTrainerDatas(response.data.availableProgrammes);
        console.log(response.data);
      } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.error || 'Something went wrong');
      }
    };

    getPersonalProgramme();
  }, [user.user._id, token]);

  const handleClick = () => {
    setHoverDashboard((prevState) => !prevState);
  };
  const handleCategoryToggle = (id) => {
    setShowCategory((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  return (
    <>
      {trainerDatas?.length > 0 ? (
        <div className="grid grid-cols-9 h-screen max-w-[100vw] gap-[2rem] text-white font-sans bg-gray-900">
          <div
            className={`transition-transform duration-300 ${
              hoverDashboard ? 'hidden sm:hidden' : 'col-span-3 sm:col-span-1'
            }`}
          >
            <DashboardComponent
              dashBoardLink={dashboardLink}
              hoverDashboard={hoverDashboard}
              setHoverDashboard={setHoverDashboard}
            />
          </div>
          <div
            className={`transition-transform duration-300 ${
              hoverDashboard
                ? 'col-span-9 sm:col-span-9'
                : 'col-span-6 sm:col-span-8'
            } overflow-auto`}
          >
            <DashboardHeader />
            {hoverDashboard && (
              <div className="absolute left-0 top-[10%] animate-shake cursor-pointer hover:animate-none transition-transform duration-300">
                <BiSolidRightArrow
                  size={40}
                  color="white"
                  onClick={handleClick}
                />
              </div>
            )}
            <div className="grid grid-cols-3 sm:pl-5 w-full max-h-full sm:max-h-[80vh] overflow-auto">
              <div className="col-span-3 items-start justify-center overflow-auto">
                <div className="grid grid-cols-1 p-2 mr-5 sm:grid-cols-3 gap-4">
                  {trainerDatas.map((card) => (
                    <div
                      key={card?._id}
                      className="bg-gray-800 rounded-[10px] m-auto min-h-[400px] p-4  w-[300px] shadow-lg border-4 border-orange-600 "
                    >
                      <img
                        src={card.categoryPhoto.url}
                        alt={card.type}
                        className="h-[249px]  w-[320px] object-cover rounded-[10px] mb-4"
                      />
                      <div className="h-[2rem] max-w-[5rem] m-[5%] text-[0.8rem] rounded-[10px] bg-orange-700 font-sans flex justify-center items-center text-white">
                        Category
                      </div>
                      <button
                        onClick={() => handleCategoryToggle(card._id)}
                        className="text-sm font-semibold h-[2rem] w-[8rem] py-1 px-4 rounded-lg bg-orange-600 text-white shadow-md hover:bg-orange-500 transition-colors duration-300"
                      >
                        {showCategory[card._id] ? 'Hide' : 'Show'}
                      </button>
                      {showCategory[card._id] && (
                        <div className="mt-2">
                          <p className="text-sm text-white">
                            {card.category.join(', ')}
                          </p>
                        </div>
                      )}
                      <div className="font-sans text-1xl text-orange-300 w-[90%] m-[5%] line-clamp-3">
                        {card.desc}
                      </div>
                      <div className="flex justify-between items-center mt-4">
                        <div className="text-xl text-white font-sans font-bold flex justify-center items-center m-2">
                          <ImCheckboxChecked color="green" size={40} />
                        </div>
                        <button className="w-[3.6rem] h-[3.2rem] bg-orange-600 flex items-center justify-center ml-4 mr-2 rounded-xl">
                          <Link to={`/user/payment/invoice`}>
                            <IoIosArrowRoundForward
                              color="white"
                              className="w-14 h-10"
                            />
                          </Link>
                        </button>
                      </div>
                      {/* Conditional Rendering for Plan Type */}
                      <div className="mt-4 flex gap-4">
                        {card.planType === 'Diet' && (
                          <Link
                            to={`/trainer/programme/diet/plan/${user.user._id}/${card._id}`}
                          >
                            <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-400 transition-colors duration-300">
                              Diet Plan
                            </button>
                          </Link>
                        )}
                        {card.planType === 'Day' && (
                          <Link
                            to={`/trainer/programme/day/plan/${card.trainerId}/${card._id}`}
                          >
                            <button className="bg-orange-400 text-white px-4 py-2 rounded-lg hover:bg-orange-300 transition-colors duration-300">
                              Day Plan
                            </button>
                          </Link>
                        )}
                        {card.planType === 'Both' && (
                          <>
                            <Link
                              to={`/trainer/programme/diet/plan/${user.user._id}/${card._id}`}
                            >
                              <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-400 transition-colors duration-300">
                                Diet Plan
                              </button>
                            </Link>
                            <Link
                              to={`/trainer/programme/day/plan/${user.user._id}/${card._id}`}
                            >
                              <button className="bg-orange-400 text-white px-4 py-2 rounded-lg hover:bg-orange-300 transition-colors duration-300">
                                Day Plan
                              </button>
                            </Link>
                          </>
                        )}
                      </div>

                      <div className="h-[3rem] w-[6rem] mt-[4%] flex justify-center items-center text-sans font-extrabold bg-orange-500 text-white hover:bg-orange-400 cursor-pointer text-center rounded-lg">
                        <Link to={`/trainer/${card.trainer?._id}`}>
                          Trainer
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-screen text-white">
          <div className="text-center">
            <p>No programs are available for you at the moment.</p>
            <p>
              Please check back later or contact your trainer for more details.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default PersonalUserProgramme;
