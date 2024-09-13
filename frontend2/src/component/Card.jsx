import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import {
  IoIosArrowRoundForward,
  IoIosArrowBack,
  IoIosArrowForward,
} from 'react-icons/io';
import CardSkeleton from '../pages/skeletons/CardSkeleton';
import { Link } from 'react-router-dom';
import { IoArrowDownSharp } from 'react-icons/io5';
import { FaUserCircle } from 'react-icons/fa';

const Card = ({ title, backgroundColor }) => {
  const backendapi = import.meta.env.VITE_BACKEND_URL;
  const [data, setData] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [loading, setLoading] = useState(true);

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
    return <CardSkeleton />;
  }

  return (
    <div className="relative rounded-[20px]">
      <h1 className="text-white flex justify-center items-center font-light font-bebes text-[28px] sm:text-[32px] sm:mt-20 text-center">
        {title}
        <IoArrowDownSharp className="hover:bg-orange-600 rounded-3xl " />
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
            <Link to={`/programme/${card._id}`} key={card._id}>
              <div
                className={`relative bg-${backgroundColor} brightness-100 min-w-[300px] max-w-[300px] m-[1rem] sm:m-[2rem] p-0 h-[500px] border-y-2 flex-shrink-0 border-4 rounded-lg border-orange-400 hover:border hover:border-orange-600 transition-all`}
              >
                {card.categoryPhoto?.url ? (
                  <img
                    src={card.categoryPhoto.url}
                    alt={card.type}
                    className="h-full w-full object-cover rounded-[2px] brightness-100"
                  />
                ) : (
                  <div className="h-full w-full flex justify-center items-center">
                    <FaUserCircle className="text-orange-600 w-full h-full" />
                  </div>
                )}
                <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center bg-opacity-40">
                  <h2 className="text-2xl text-white font-sans font-bold">
                    {card.category[0]}
                  </h2>
                  <div className="h-[2rem] w-[5rem] border-2 border-orange-600 bg-gray-950 rounded-2xl flex justify-center items-center">
                    <p className="text-2xl font-bold text-yellow-600">
                      ${card.price}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
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
