import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import {
  IoIosArrowRoundForward,
  IoIosArrowBack,
  IoIosArrowForward,
} from 'react-icons/io';
import CardSkeleton from '../pages/skeletons/CardSkeleton';
import ProgrammeDetail from '../pages/user/ProgrammeDetail';
import Modal from 'react-modal';
import { FaUserCircle } from 'react-icons/fa';

// Ensure that the app element is set for accessibility
Modal.setAppElement('#root');

const Card = ({ title, backgroundColor }) => {
  const backendapi = import.meta.env.VITE_BACKEND_URL;
  const [data, setData] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedProgrammeId, setSelectedProgrammeId] = useState(null); // State for selected programme ID
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 640);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const containerRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${backendapi}/api/admin/programme`);
        const filteredData = response.data.filter(
          (item) => item.isSelected === true
        );
        setData(filteredData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();

    const updateItemsPerPage = () => {
      if (window.innerWidth <= 640) {
        setItemsPerPage(1);
      } else if (window.innerWidth <= 1024) {
        setItemsPerPage(2);
      } else {
        setItemsPerPage(3);
      }
    };

    updateItemsPerPage();
    window.addEventListener('resize', updateItemsPerPage);

    return () => {
      window.removeEventListener('resize', updateItemsPerPage);
    };
  }, []);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  const scrollLeftFunc = () => {
    containerRef.current.scrollTo({
      left:
        containerRef.current.scrollLeft -
        containerRef.current.offsetWidth / itemsPerPage,
      behavior: 'smooth',
    });
  };

  const scrollRightFunc = () => {
    containerRef.current.scrollTo({
      left:
        containerRef.current.scrollLeft +
        containerRef.current.offsetWidth / itemsPerPage,
      behavior: 'smooth',
    });
  };

  const openModal = (programmeId) => {
    setSelectedProgrammeId(programmeId); // Set the selected programme ID
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  if (loading) {
    return <CardSkeleton />;
  }

  return (
    <div className="relative rounded-lg ">
      <h1 className="text-white flex justify-center items-center font-light font-bebes text-[28px] sm:text-[32px] text-center mb-4">
        {title}
      </h1>

      <button
        onClick={scrollLeftFunc}
        className="hidden sm:block absolute left-0 top-[50%] transform -translate-y-1/2 bg-orange-500 p-3 rounded-full hover:bg-orange-600 transition-colors z-10 shadow-lg"
      >
        <IoIosArrowBack color="white" className="w-8 h-8" />
      </button>

      <div
        ref={containerRef}
        className="overflow-x-auto w-full max-w-[100%] mx-auto mt-4 cursor-grab scrollbar-hide"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
      >
        <div className="flex transition-transform duration-300 ease-in-out">
          {data.map((card) => (
            <div key={card._id} onClick={() => openModal(card._id)}>
              <div
                className={`relative min-w-[250px] max-w-[200px] m-[1rem] sm:m-[2rem] p-0 h-[350px] border-y-2 flex-shrink-0 border-4 rounded-lg border-orange-400 hover:border-orange-600 transition-all transform hover:scale-105 hover:shadow-lg`}
                style={{ backgroundColor }} // Use inline style for dynamic background color
              >
                {card.categoryPhoto?.url ? (
                  <img
                    src={card.categoryPhoto.url}
                    alt={card.title}
                    className="h-full w-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="h-full w-full flex justify-center items-center">
                    <FaUserCircle className="text-orange-600 w-full h-full" />
                  </div>
                )}
                <div className="absolute bottom-2 left-2 right-2 flex flex-col justify-between p-2 rounded-lg">
                  <h2 className="text-xl text-white font-sans font-bold mb-1">
                    {card.title}
                  </h2>
                  <p className="text-sm text-gray-900 brightness-50 font-sans mb-2 font-extrabold">
                    {card.trainer?.name}
                  </p>
                  <div className="flex flex-col brightness-100">
                    {card?.discount > 0 && (
                      <span className="text-gray-400 line-through text-lg mr-2">
                        $
                        {Math.ceil(
                          card.price + card.price.toFixed(2) / card.discount
                        ).toFixed(2)}
                      </span>
                    )}

                    <p className="text-xl font-bold text-yellow-600">
                      ${card?.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={scrollRightFunc}
        className="hidden sm:block absolute right-0 top-[50%] transform -translate-y-1/2 bg-orange-500 p-3 rounded-full hover:bg-orange-600 transition-colors z-10 shadow-lg"
      >
        <IoIosArrowForward color="white" className="w-8 h-8" />
      </button>

      {/* Modal for ProgrammeDetail */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Programme Details"
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0)', // Transparent background
          },
          content: {
            top: isMobile ? '35%' : '50%', // Adjust top based on screen size
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
        <ProgrammeDetail
          programmeId={selectedProgrammeId}
          closeModal={closeModal}
        />
      </Modal>
    </div>
  );
};

export default Card;
