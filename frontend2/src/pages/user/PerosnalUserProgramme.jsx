import { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import ReactModal from 'react-modal';
import DashboardHeader from '../../component/DashboardHeader';

const backendapi = import.meta.env.VITE_BACKEND_URL;

const PersonalUserProgramme = () => {
  const { user } = useSelector((state) => state.user);
  const token = user.token;

  const [trainerDatas, setTrainerDatas] = useState([]);
  const [selectedDescription, setSelectedDescription] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const descriptionRefs = useRef([]);

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
        setTrainerDatas(response?.data?.availableProgrammes);
      } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.error || 'Something went wrong');
      }
    };

    getPersonalProgramme();
  }, [user?.user?._id, token]);

  const openModal = (desc) => {
    setSelectedDescription(desc);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDescription(null);
  };

  return (
    <>
      {trainerDatas?.length > 0 ? (
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

          <div className="grid grid-cols-3 sm:pl-5 w-full max-h-full min-h-[88vh] sm:max-h-[100vh] overflow-auto col-span-9">
            <div className="col-span-3 items-start justify-center overflow-auto">
              <div className="grid grid-cols-1 p-2 mr-5 sm:grid-cols-3 gap-10">
                {trainerDatas?.map((card, index) => (
                  <div
                    key={card?._id}
                    className="bg-gray-800 m-auto min-h-[68vh] max-h-[100vh] w-full border-b-4 border-orange-600 shadow-lg relative overflow-hidden"
                  >
                    <div className="relative">
                      <img
                        src={card?.categoryPhoto?.url}
                        alt={card?.type}
                        className="h-[250px] w-full object-cover"
                      />
                      <Link
                        to={`/trainer/${card.trainer?._id}`}
                        className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 z-10"
                      >
                        <img
                          src={card?.trainer?.profilePhoto?.url}
                          alt="Trainer Profile"
                          className="w-20 h-20 rounded-full object-cover border-4 border-gray-800"
                        />
                      </Link>
                    </div>

                    <div className="p-4 pt-12 h-full">
                      <h2 className="text-white text-xl font-semibold mb-2 border-b-2 border-gray-700 pb-2">
                        {card.title}
                      </h2>
                      <div className="relative mb-4 border-b-2 border-gray-700 pb-2 h-[5vh] overflow-hidden">
                        <p
                          ref={(el) => (descriptionRefs.current[index] = el)}
                          className="text-white text-sm cursor-pointer overflow-hidden"
                          style={{ maxHeight: '5vh' }}
                          onClick={() => openModal(card.desc)}
                        >
                          {card.desc}
                        </p>
                        {descriptionRefs.current[index]?.clientHeight > 50 && (
                          <button
                            className="text-orange-400 ml-2"
                            onClick={() => openModal(card.desc)}
                          >
                            See More
                          </button>
                        )}
                      </div>
                      <h3 className="text-white text-lg font-bold mb-2">
                        Categories
                      </h3>
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

      {/* Modal for Full Description */}
      <ReactModal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Full Description"
        className="Modal"
        overlayClassName="Overlay"
        style={{
          content: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            transform: 'translate(-50%, -50%)',
            background: '#2D2D2D',
            borderRadius: '10px',
            padding: '20px',
          },
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
          },
        }}
      >
        <div className="text-white">
          <h2 className="text-2xl font-bold mb-4">Full Description</h2>
          <p>{selectedDescription}</p>
          <button
            onClick={closeModal}
            className="mt-4 bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-400"
          >
            Close
          </button>
        </div>
      </ReactModal>
    </>
  );
};

export default PersonalUserProgramme;
