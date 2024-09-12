import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import {
  IoIosArrowRoundForward,
  IoIosArrowBack,
  IoIosArrowForward,
} from 'react-icons/io';
import CardSkeleton from '../pages/skeletons/CardSkeleton';
import { Link } from 'react-router-dom';

const Card = ({ title, backgroundColor }) => {
  const backendapi = import.meta.env.VITE_BACKEND_URL;
  const [data, setData] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [loading, setLoading] = useState(true); // State for loading

  const containerRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${backendapi}/api/admin/programme`);
        const filteredData = response.data.filter(
          (item) => item.isSelected === true
        );
        setData(filteredData);
        setLoading(false); // Data fetched, set loading to false
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false); // Handle error and stop loading
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

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousedown', handleMouseDown);
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseup', handleMouseUpOrLeave);
      container.addEventListener('mouseleave', handleMouseUpOrLeave);
    }

    return () => {
      if (container) {
        container.removeEventListener('mousedown', handleMouseDown);
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseup', handleMouseUpOrLeave);
        container.removeEventListener('mouseleave', handleMouseUpOrLeave);
      }
    };
  }, [isDragging]);

  if (loading) {
    return <CardSkeleton />; // Return skeleton loader while loading
  }

  return (
    <div className="relative">
      <h1 className="text-white font-extrabold text-[40px] sm:text-[48px] mt-10 sm:mt-20 border-b-2 border-orange-500 text-center">
        {title}
      </h1>

      <button
        onClick={scrollLeftFunc}
        className="hidden sm:block absolute left-0 top-[50%] transform -translate-y-1/2 bg-orange-500 p-2 rounded-full hover:bg-orange-600 transition-colors z-10"
      >
        <IoIosArrowBack color="white" className="w-6 h-6 sm:w-10 sm:h-10" />
      </button>

      <div
        ref={containerRef}
        className="overflow-x-auto w-full max-w-[100%] mx-auto mt-4 cursor-grab scrollbar-hide"
      >
        <div className="flex transition-transform duration-300 ease-in-out">
          {data.map((card) => (
            <div
              key={card?._id}
              className={`bg-${backgroundColor} brightness-100 rounded-[2px] max-w-[300px]  m-[4rem] p-4 h-[400px] border-y-2 flex-shrink-0 border-b-4 border-orange-400 hover:border hover:border-orange-600 transition-all`}
            >
              <img
                src={card?.categoryPhoto?.url}
                alt={card.type}
                className="h-[300px] w-[250px] object-cover rounded-[12px] brightness-100"
              />
              <div className="p-4 flex justify-between  items-center flex-col ">
                <h2 className="text-xl text-white font-sans font-bold flex justify-center items-center">
                  {card?.category[0]}
                </h2>
                <Link to={`/programme/${card._id}`}>
                  <h1 className="text-white font-orbitron flex justify-center items-center">
                    know more
                    <span>
                      <IoIosArrowRoundForward
                        color="orange"
                        className="w-10 h-8 sm:w-14 sm:h-10"
                      />
                    </span>
                  </h1>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={scrollRightFunc}
        className="hidden sm:block absolute right-0 top-[50%] transform -translate-y-1/2 bg-orange-500 p-2 rounded-full hover:bg-orange-600 transition-colors z-10"
      >
        <IoIosArrowForward color="white" className="w-6 h-6 sm:w-10 sm:h-10" />
      </button>
    </div>
  );
};

export default Card;
