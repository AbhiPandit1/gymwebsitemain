import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import ProgrammeDetail from '../../user/ProgrammeDetail.jsx';
import Modal from 'react-modal';

const PersonalInfoTrainer = () => {
  const [trainerDatas, setTrainerDatas] = useState([]);
  const [showDescriptionModal, setShowDescriptionModal] = useState(false); // State for the description modal
  const [showDetailModal, setShowDetailModal] = useState(false); // State for the detail modal
  const [selectedProgramme, setSelectedProgramme] = useState(null);
  const { trainerId } = useParams();
  const backendapi = import.meta.env.VITE_BACKEND_URL;

  const scrollContainerRef = useRef(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 640);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);

  // Fetch Trainer Programmes
  useEffect(() => {
    const getPersonalProgramme = async () => {
      try {
        const response = await axios.get(
          `${backendapi}/api/admin/trainer/programme/${trainerId}`
        );
        setTrainerDatas(response.data.programmes);
      } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.error || 'Add a programme');
      }
    };

    getPersonalProgramme();
  }, [trainerId, backendapi]);

  // Scroll Functions
  const scrollLeftFunc = () => {
    scrollContainerRef.current.scrollLeft -=
      scrollContainerRef.current.offsetWidth / 2;
  };

  const scrollRightFunc = () => {
    scrollContainerRef.current.scrollLeft +=
      scrollContainerRef.current.offsetWidth / 2;
  };

  // Handle Mouse Events for Scrolling
  const handleMouseDown = () => setIsScrolling(true);

  const handleMouseMove = (e) => {
    if (!isScrolling) return;
    scrollContainerRef.current.scrollLeft -= e.movementX; // Move the scroll based on mouse movement
  };

  const handleMouseUp = () => setIsScrolling(false);

  // Responsive Design Handling
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 640);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Handle Programme Detail Modal
  const closeDetailModal = () => {
    setShowDetailModal(false);
  };

  const closeDescriptionModal = () => {
    setShowDescriptionModal(false);
  };

  const handleShowDescription = (programme) => {
    setSelectedProgramme(programme);
    setShowDescriptionModal(true);
  };

  const openDetailModal = (programmeId) => {
    const selected = trainerDatas.find((p) => p._id === programmeId);
    setSelectedProgramme(selected);
    setShowDetailModal(true);
  };

  return (
    <div
      className="relative"
      style={{
        background:
          'linear-gradient(180deg, #050c1e 0%, #050c1e 40%, #050c1e 70%, #050c1e 100%)',
      }}
    >
      {/* Scroll Buttons */}
      {!isSmallScreen && (
        <>
          <button
            onClick={scrollLeftFunc}
            className="absolute left-0 top-[50%] transform -translate-y-1/2 bg-orange-500 p-2 rounded-full hover:bg-orange-600 transition-colors z-10"
            aria-label="Scroll Left"
          >
            <IoIosArrowBack color="white" className="w-6 h-6 sm:w-10 sm:h-10" />
          </button>

          <button
            onClick={scrollRightFunc}
            className="absolute right-0 top-[50%] transform -translate-y-1/2 bg-orange-500 p-2 rounded-full hover:bg-orange-600 transition-colors z-10"
            aria-label="Scroll Right"
          >
            <IoIosArrowForward
              color="white"
              className="w-6 h-6 sm:w-10 sm:h-10"
            />
          </button>
        </>
      )}

      {/* Trainer Programmes */}
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto whitespace-nowrap scrollbar-hide"
        style={{ scrollBehavior: 'smooth' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div className="flex gap-4 sm:gap-10 min-h-screen p-4">
          {trainerDatas.map((programme) => (
            <div
              key={programme._id}
              // Open detail modal on programme click
              className="bg-gray-800 m-auto w-full sm:min-w-[450px] max-w-[450px] min-h-[68vh] border-b-4 border-orange-600 shadow-lg relative overflow-hidden cursor-pointer"
            >
              <div className="relative">
                <img
                  src={programme.categoryPhoto?.url || 'defaultImage.jpg'}
                  alt="Programme"
                  className="h-[250px] w-full object-cover"
                />
              </div>

              <div className="p-4 pt-12 h-full">
                <h2 className="text-white text-xl font-semibold mb-2 border-b-2 border-gray-700 pb-2">
                  {programme.name}
                </h2>
                <h2 className="text-white text-xl font-semibold mb-2 border-b-2 border-gray-700 pb-2">
                  ${programme.price}
                </h2>
                <div className="relative mb-4 border-b-2 border-gray-700 pb-2 h-[5vh] overflow-hidden">
                  <p className="text-white text-sm cursor-pointer overflow-hidden">
                    {programme.desc.slice(0, 80)}...
                  </p>
                  {programme.desc && (
                    <button
                      className="text-orange-400 mb-2 ml-2"
                      onClick={() => handleShowDescription(programme)} // Open description modal on description click
                    >
                      See More
                    </button>
                  )}
                </div>
                <h3 className="text-white text-lg font-bold mb-2">
                  Categories
                </h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {programme.category.map((category, index) => (
                    <button
                      key={index}
                      className="bg-gray-700 text-white px-3 py-1 rounded-lg text-sm hover:bg-orange-500 transition-colors duration-300"
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={() => openDetailModal(programme._id)}
                className="bg-gradient-to-r from-orange-400 to-orange-600 text-white font-semibold py-2 px-4 rounded-lg m-4 shadow-md transition-transform duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                Buy
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for full programme description */}
      <RModal
        isOpen={showDescriptionModal}
        onClose={closeDescriptionModal}
        description={selectedProgramme?.desc || ''}
      />

      {/* Modal for programme detail */}
      <Modal
        isOpen={showDetailModal}
        onRequestClose={closeDetailModal} // Use onRequestClose for better practice
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0)', // Transparent background
          },
          content: {
            top: isMobile ? '50%' : '50%', // Adjust top based on screen size
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: '1200px',
            height: 'auto',
            padding: '0',
            background: 'transparent',

            border: 'none',
          },
        }}
      >
        {/* Conditionally render the close button based on isMobile */}
        {isMobile && (
          <button
            onClick={closeDetailModal}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              backgroundColor: 'red', // Red background
              color: 'orange', // White text color
              border: 'none',
              borderRadius: '4px',
              padding: '8px 12px',
              cursor: 'pointer',
              fontSize: '16px',
            }}
          >
            X
          </button>
        )}

        {/* Render the ProgrammeDetail component */}
        <ProgrammeDetail
          programmeId={selectedProgramme?._id}
          closeModal={closeDetailModal}
        />
      </Modal>
    </div>
  );
};

// Modal Component
const RModal = ({ isOpen, onClose, description, children }) => {
  if (!isOpen) return null; // Don't render if modal is not open

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-4 max-w-md w-full">
        {children || (
          <>
            <h2 className="text-xl font-bold mb-2">Programme Description</h2>
            <p className="text-gray-700">{description}</p>
          </>
        )}
        <button
          onClick={onClose}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default PersonalInfoTrainer;
