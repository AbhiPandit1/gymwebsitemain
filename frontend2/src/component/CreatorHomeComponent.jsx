import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

// Skeleton component for loading placeholders
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
  }, []);

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
    <div className="p-8 text-white">
      <h1 className="text-4xl font-extrabold text-center mb-8">
        Meet Our Creators
      </h1>

      {/* Desktop View: Horizontal Scroll Layout */}
      <div
        ref={scrollContainerRef}
        className="hidden sm:block overflow-x-auto whitespace-nowrap scrollbar-hide"
        style={{ scrollBehavior: 'smooth' }}
      >
        {trainerDatas?.map((data) => (
          <div
            key={data._id}
            className="inline-block rounded-xl w-[30vw] bg-gray-800 p-6 m-2 hover:shadow-lg transition-shadow duration-300 border-b border-r border-orange-600 hover:border-4 hover:shadow-orange-600"
          >
            <div className="overflow-hidden rounded-lg">
              <img
                src={data?.user?.profilePhoto?.url}
                alt={data?.user?.name}
                className="object-cover w-full h-[250px] rounded-lg"
              />
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold hover:text-orange-300">
                {data?.user?.name}
              </h3>
              <p className="text-gray-400 mt-1">Creator</p>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile View: Carousel Layout */}
      <div
        ref={scrollContainerRef}
        className="block sm:hidden overflow-x-auto whitespace-nowrap scrollbar-hide"
        style={{ scrollBehavior: 'smooth' }}
      >
        {trainerDatas?.map((data) => (
          <div
            key={data._id}
            className="inline-block rounded-xl w-[300px] p-6 m-2 hover:shadow-lg bg-transparent border-2 border-orange-600 transition-shadow duration-300 border-b-4 hover:border-4"
          >
            <div className="overflow-hidden rounded-lg">
              <img
                src={data?.user?.profilePhoto?.url}
                alt={data?.user?.name}
                className="object-cover w-full h-[250px] rounded-lg"
              />
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold">{data?.user?.name}</h3>
              <p className="text-gray-400 mt-1">Creator</p>
            </div>
          </div>
        ))}
      </div>

      {/* View All Trainers Button */}
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
