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

const backendapi = import.meta.env.VITE_BACKEND_URL;

const PersonalUserProgramme = () => {
  const { user } = useSelector((state) => state.user);
  const token = user.token;

  const dashBoardLink = useDashboardLinks();
  const [trainerDatas, setTrainerDatas] = useState([]);
  const [hoverDashboard, setHoverDashboard] = useState(false);

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
        setTrainerDatas(response.data.programmeDetails);
      } catch (error) {
        console.error(error);
        toast.error(error.response.data.error);
      }
    };

    getPersonalProgramme();
  }, [user.user._id, token]);

  const handleClick = () => {
    setHoverDashboard((prevState) => !prevState);
  };

  return (
    <>
      {trainerDatas ? (
        <div className="grid grid-cols-7 min-h-screen overflow-hidden text-white font-sans scrollbar-hide-body">
          <div
            className={`transition-transform duration-300 ${
              hoverDashboard ? 'hidden' : 'col-span-7'
            } sm:${hoverDashboard ? 'hidden' : 'col-span-2'}`}
            onClick={handleClick}
          >
            <DashboardComponent dashBoardLink={dashBoardLink} />
          </div>
          <div
            className={`transition-transform duration-300 ${
              hoverDashboard ? 'col-span-7' : 'col-span-7'
            } sm:${hoverDashboard ? 'col-span-7' : 'col-span-5'}`}
          >
            <DashboardHeader />
            <div className="p-2">
              <div className="bg-primary h-full w-full flex flex-col mb-1">
                <div className="relative">
                  {hoverDashboard && (
                    <div
                      className="absolute left-0 top-[10%] animate-shake cursor-pointer hover:animate-none transition-transform duration-300"
                      onClick={handleClick}
                    >
                      <IoIosArrowRoundForward size={80} color="white" />
                    </div>
                  )}
                  <div className="grid grid-cols-3 m-auto sm:pl-5 w-full max-h-full sm:max-h-[80vh] overflow-auto">
                    <div className="col-span-3 items-start justify-center overflow-auto">
                      <div className="grid grid-cols-1 p-2 mr-5 sm:grid-cols-3 gap-2 overflow-auto">
                        {trainerDatas.map((card) => (
                          <div
                            key={card.id}
                            className="bg rounded-[32px] gap-[5px] min-h-[400px] p-4 bg-tertiary w-full sm:w-[300.4px] m-[1rem] p-auto"
                          >
                            <img
                              src={card.categoryPhoto.url}
                              alt={card.type}
                              className="h-[249px] object-cover rounded-[50px] p-4 opacity-1"
                            />
                            <div className="h-[2rem] max-w-[5rem] m-[5%] text-[0.8rem] rounded-[10px] bg-paraColor font-sans flex justify-center items-center">
                              Category
                            </div>
                            <div className="p-4">
                              <h2 className="text-xl text-white font-sans font-bold">
                                {card.category}
                              </h2>
                            </div>
                            <div className="font-sans text-1xl text-paraColor w-[90%] m-[5%] line-clamp-3">
                              {card.desc}
                            </div>
                            <div className="flex justify-between">
                              <div className="text-xl text-white font-sans font-bold flex justify-center items-center m-2">
                                <ImCheckboxChecked color="green" size={40} />
                              </div>
                              <button className="w-[3.6rem] h-[3.2rem] bg-secondary flex items-center justify-center ml-4 mr-2 rounded-xl float-right">
                                <Link
                                  to={`/user/payment/detail/${user.user._id}`}
                                >
                                  <IoIosArrowRoundForward
                                    color="white"
                                    className="w-14 h-10"
                                  />
                                </Link>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        '...Loading'
      )}
    </>
  );
};

export default PersonalUserProgramme;
