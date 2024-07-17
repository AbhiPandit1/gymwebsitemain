import { IoIosArrowRoundForward } from 'react-icons/io';
import DashboardComponent from '../../component/DashboardComponent';
import DashboardHeader from '../../component/DashboardHeader';
import { useEffect, useState } from 'react';

import { useSelector } from 'react-redux';
import { ImCheckboxChecked } from 'react-icons/im';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const PersonalUserProgramme = () => {
  const { user } = useSelector((state) => state.user);
  const dashBoardLink = [
    {
      id: '1',
      name: 'Home',
      link: '/',
      role: 'user',
    },
    {
      id: '2',
      name: 'My Programs',
      link: '/user/programmes',
      role: '',
    },
    {
      id: '3',
      name: 'Settings',
      link: '/settings',
    },
    {
      id: '4',
      name: 'Edit',
      link: `/user/detail/${user.user._id}`,
    },
  ];
  // Initialize state for trainerDatas
  const [trainerDatas, setTrainerDatas] = useState([]);

  useEffect(() => {
    const getPersonalProgramme = async () => {
      try {
        const response = await axios.get(`/api/after/user/${user.user._id}`);

        setTrainerDatas(response.data.programmeDetails); // Assuming setTrainerDatas is a state setter function
      } catch (error) {
        console.error(error);
        toast.error('Failed to fetch personal programme'); // Toast error message
      }
    };

    getPersonalProgramme(); // Call the function to fetch personal programme data
  }, [user.user._id]); // Add user.user._id to dependency array to re-run effect when user changes

  return (
    <>
      {trainerDatas ? (
        <>
          <div className="grid sm:grid-cols-7 text-white font-sans max-w-[100vw]">
            <div className="col-span-2 hidden sm:grid">
              <DashboardComponent dashBoardLink={dashBoardLink} />
            </div>
            <div className="col-span-5">
              <div>
                <DashboardHeader />
              </div>
              <div className="grid grid-cols-3  m-auto  sm:pl-5 w-full max-h-full sm:max-h-[80vh] overflow-scroll ">
                <div className="col-span-3 items-start justify-center overflow-scroll">
                  <div className="grid grid-cols-1 p-2 mr-5 sm:grid-cols-3 gap-2 overflow-hidden">
                    {trainerDatas.map((card) => (
                      <div
                        key={card.id} // Assuming `card` objects have unique `id` property
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
                            <Link to={`/user/payment/detail/${user.user._id}`}>
                              {' '}
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
        </>
      ) : (
        '...Loading'
      )}
    </>
  );
};

export default PersonalUserProgramme;
