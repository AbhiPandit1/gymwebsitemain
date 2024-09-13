import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { FaArrowRight, FaUserCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

const Skeleton = () => (
  <div className="flex gap-4 p-4">
    {Array(5)
      .fill(null)
      .map((_, index) => (
        <div
          key={index}
          className="w-[30vw] h-[350px] bg-gray-700 rounded-xl animate-pulse"
        >
          <div className="w-full h-[250px] bg-gray-600 rounded-t-xl"></div>
          <div className="p-4">
            <div className="w-3/4 h-6 bg-gray-600 rounded mb-2"></div>
            <div className="w-1/2 h-4 bg-gray-600 rounded"></div>
          </div>
        </div>
      ))}
  </div>
);

const backendapi = import.meta.env.VITE_BACKEND_URL;

const CreatorHomeComponent = () => {
  const [trainerDatas, setTrainerDatas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const scrollContainerRef = useRef(null);
  const scrollStartPosition = useRef(0);
  const scrollStartX = useRef(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 640);

  useEffect(() => {
    const fetchTrainerData = async () => {
      try {
        const response = await axios.get(`${backendapi}/api/trainer`);
        setTrainerDatas(response.data.trainers);
      } catch (err) {
        console.error('Error fetching trainer data:', err);
        setError('Failed to fetch trainer data');
      } finally {
        setLoading(false);
      }
    };

    fetchTrainerData();
  }, [backendapi]);

  const handleMouseDown = (e) => {
    setIsScrolling(true);
    scrollStartPosition.current = scrollContainerRef.current.scrollLeft;
    scrollStartX.current = e.pageX - scrollContainerRef.current.offsetLeft;
  };

  const handleMouseMove = (e) => {
    if (!isScrolling) return;
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const scroll = x - scrollStartX.current;
    scrollContainerRef.current.scrollLeft =
      scrollStartPosition.current - scroll;
  };

  const handleMouseUp = () => {
    setIsScrolling(false);
  };

  const handleMouseLeave = () => {
    setIsScrolling(false);
  };

  const scrollLeftFunc = () => {
    scrollContainerRef.current.scrollLeft -=
      scrollContainerRef.current.offsetWidth / 2;
  };

  const scrollRightFunc = () => {
    scrollContainerRef.current.scrollLeft +=
      scrollContainerRef.current.offsetWidth / 2;
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('mousedown', handleMouseDown);
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseup', handleMouseUp);
      container.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (container) {
        container.removeEventListener('mousedown', handleMouseDown);
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseup', handleMouseUp);
        container.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [isScrolling]);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 640);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-white">
        <h1 className="text-4xl font-extrabold text-center mb-8">
          Meet Our Creators
        </h1>
        <Skeleton />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-8 text-white relative">
      <h1 className="text-4xl font-extrabold text-center mb-8">
        Meet Our Creators
      </h1>

      {!isSmallScreen && (
        <div className="relative">
          <button
            onClick={scrollLeftFunc}
            className="absolute left-0 top-[50%] transform -translate-y-1/2 bg-orange-500 p-2 rounded-full hover:bg-orange-600 transition-colors z-10"
            aria-label="Scroll Left"
          >
            <IoIosArrowBack color="white" className="w-6 h-6 sm:w-10 sm:h-10" />
          </button>
          <div
            ref={scrollContainerRef}
            className="overflow-x-auto whitespace-nowrap scrollbar-hide"
            style={{ scrollBehavior: 'smooth' }}
          >
            {trainerDatas?.map((data) => (
              <div
                key={data?._id}
                className="relative inline-block rounded-xl w-[350px] bg-gray-800 m-2 hover:shadow-lg transition-shadow duration-300 border-b border-r border-orange-600 hover:border-4 hover:shadow-orange-600"
              >
                <div className="relative w-full h-[550px]">
                  {data?.user?.profilePhoto?.url ? (
                    <img
                      src={data.user.profilePhoto.url}
                      alt={data.user.name}
                      className="object-cover w-full h-full rounded-xl"
                    />
                  ) : (
                    <FaUserCircle className="text-gray-600 w-full h-full" />
                  )}
                  <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 to-transparent p-4">
                    <h3 className="text-2xl font-bold text-white">
                      {data?.user?.name}
                    </h3>
                    <p className="text-gray-400 mt-1">Creator</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
        </div>
      )}

      {isSmallScreen && (
        <div
          ref={scrollContainerRef}
          className="block overflow-x-auto whitespace-nowrap scrollbar-hide"
          style={{ scrollBehavior: 'smooth' }}
        >
          {trainerDatas?.map((data) => (
            <div
              key={data._id}
              className="relative inline-block rounded-xl w-[300px] m-2 hover:shadow-lg bg-transparent border-2 border-orange-600 transition-shadow duration-300 border-b-4 hover:border-4"
            >
              <div className="relative w-full h-[350px]">
                {data?.user?.profilePhoto?.url ? (
                  <img
                    src={data.user.profilePhoto.url}
                    alt={data.user.name}
                    className="object-cover w-full h-full rounded-xl"
                  />
                ) : (
                  <FaUserCircle className="text-gray-600 w-full h-full" />
                )}
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 to-transparent p-4">
                  <h3 className="text-2xl font-bold text-white">
                    {data?.user?.name}
                  </h3>
                  <p className="text-gray-400 mt-1">Creator</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-center mt-8">
        <Link
          to="/trainers"
          className="px-4 py-2 bg-orange-600 hover:shadow-lg hover:shadow-orange-600 text-white rounded-full flex items-center"
        >
          View All Trainers
          <FaArrowRight className="ml-2" />
        </Link>
      </div>
    </div>
  );
};

export default CreatorHomeComponent;
