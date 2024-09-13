import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaArrowDown } from 'react-icons/fa';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { Link, useNavigate } from 'react-router-dom';
import { getProgramme } from '../action/programmeActions';

const CategoriesCard = () => {
  const [loadButton, setLoadButton] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 640);
  const [isScrolling, setIsScrolling] = useState(false);

  const scrollContainerRef = useRef(null);
  const scrollStartPosition = useRef(0);
  const scrollStartX = useRef(0);

  const dispatch = useDispatch();
  const { programme, error } = useSelector((state) => state.programme);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch programme data on component mount
    dispatch(getProgramme());
  }, [dispatch]);

  useEffect(() => {
    // Update screen size on resize
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 640);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Check if `programme` is defined and has a `categories` array
  if (!programme || !Array.isArray(programme.categories)) {
    console.error(
      'Programme data is not available or categories is not an array'
    );
    return (
      <div className="text-center text-white">Error loading programmes</div>
    );
  }

  // Filter out items without a categoryPhoto and ensure only one item per category
  const flattenedProgrammes = programme.categories
    .filter((data) => data?.categoryPhoto?.url) // Ensure `data` and `categoryPhoto` exist before accessing `url`
    .reduce((acc, current) => {
      const categories = Array.isArray(current?.category)
        ? current.category
        : current?.category
        ? [current.category]
        : [];

      categories.forEach((cat) => {
        if (!acc.some((item) => item.category.includes(cat))) {
          acc.push({
            ...current,
            category: [cat],
          });
        }
      });

      return acc;
    }, []);

  // Display up to 3 items when loadButton is false, otherwise display all items
  const visibleProgrammes = loadButton
    ? flattenedProgrammes
    : flattenedProgrammes;

  // Mouse down event to start scrolling
  const handleMouseDown = (e) => {
    setIsScrolling(true);
    scrollStartPosition.current = scrollContainerRef.current.scrollLeft;
    scrollStartX.current = e.clientX - scrollContainerRef.current.offsetLeft; // Use clientX for more consistent coordinates
  };

  // Mouse move event to scroll horizontally
  const handleMouseMove = (e) => {
    if (!isScrolling) return;
    const x = e.clientX - scrollContainerRef.current.offsetLeft;
    const scroll = x - scrollStartX.current;
    scrollContainerRef.current.scrollLeft =
      scrollStartPosition.current - scroll;
  };

  // Mouse up event to stop scrolling
  const handleMouseUp = () => {
    setIsScrolling(false);
  };

  // Mouse leave event to stop scrolling
  const handleMouseLeave = () => {
    setIsScrolling(false);
  };

  // Scroll to the left with smooth behavior
  const scrollLeftFunc = () => {
    scrollContainerRef.current.scrollBy({
      left: -scrollContainerRef.current.offsetWidth / 2,
      behavior: 'smooth',
    });
  };

  // Scroll to the right with smooth behavior
  const scrollRightFunc = () => {
    scrollContainerRef.current.scrollBy({
      left: scrollContainerRef.current.offsetWidth / 2,
      behavior: 'smooth',
    });
  };

  // Navigate to /categories
  const handleArrowDownClick = () => {
    navigate('/categories');
  };

  return (
    <div className="text-white flex flex-col items-center max-w-[100%] mx-auto rounded-xl p-10 relative">
      <h1 className="text-xl sm:text-3xl text-center font-sans font-extrabold">
        Our Core Services
      </h1>

      {/* Left Button - Hidden on small screens */}
      {!isSmallScreen && (
        <button
          onClick={scrollLeftFunc}
          className="absolute left-0 top-[50%] transform -translate-y-1/2 bg-orange-500 p-2 rounded-full hover:bg-orange-600 transition-colors z-10"
        >
          <IoIosArrowBack color="white" className="w-6 h-6 sm:w-10 sm:h-10" />
        </button>
      )}

      {/* Card Container */}
      <div
        className="gap-2 sm:gap-4 flex overflow-x-auto mt-4 rounded-lg p-6 w-full scrollbar-hide"
        ref={scrollContainerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        style={{ cursor: isScrolling ? 'grabbing' : 'grab' }}
      >
        {visibleProgrammes.map((data) => (
          <div
            key={data._id}
            className="relative rounded-xl overflow-hidden brightness-200 h-[40vh] sm:min-h-[60vh] m-[2rem] max-h-[60vh] min-w-[60vw] sm:min-w-[20%] border-b-4 border-orange-600 transition-transform duration-500 ease-in-out hover:scale-110 hover:shadow-lg hover:shadow-orange-500"
          >
            <div className="relative max-h-full overflow-hidden rounded-lg">
              <img
                src={data.categoryPhoto.url || '/default-image.jpg'}
                alt={`Category ${data._id}`}
                className="sm:h-[60vh] h-[40vh] object-cover w-full"
              />
              <div className="absolute inset-x-0 bottom-0 h-[64rem] bg-gradient-to-t from-black to-transparent pointer-events-none" />
            </div>
            <div className="absolute inset-0 flex items-end justify-center mb-2">
              <div className="font-extrabold text-2xl sm:text-4xl text-white text-center">
                {data.category}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Right Button - Hidden on small screens */}
      {!isSmallScreen && (
        <button
          onClick={scrollRightFunc}
          className="absolute right-0 top-[50%] transform -translate-y-1/2 bg-orange-500 p-2 rounded-full hover:bg-orange-600 transition-colors z-10"
        >
          <IoIosArrowForward
            color="white"
            className="w-6 h-6 sm:w-10 sm:h-10"
          />
        </button>
      )}

      <div className="flex justify-center items-center mt-4">
        <Link to="/categories">
          <div
            className="w-12 h-12 bg-transparent text-white rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-colors duration-300"
            onClick={handleArrowDownClick}
          >
            <FaArrowDown size={50} />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default CategoriesCard;
