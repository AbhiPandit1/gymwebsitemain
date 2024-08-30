import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { FaArrowDown } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const CategoriesCard = () => {
  const [loadButton, setLoadButton] = useState(false);
  const { programme } = useSelector((state) => state.programme);
  const navigate = useNavigate();

  // State to track horizontal scroll
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollContainerRef = useRef(null);
  const scrollStartPosition = useRef(0);
  const scrollStartX = useRef(0);

  // Toggle Load More/Load Less button
  const handleLoadMore = () => {
    setLoadButton((prev) => !prev);
  };

  // Navigate to /categories
  const handleArrowDownClick = () => {
    navigate('/categories');
  };

  // Check if `programme` and `programme.categories` are defined and are arrays
  if (!programme || !Array.isArray(programme.categories)) {
    console.error('Programme data is not available or is not an array');
    return (
      <div className="text-center text-white">Error loading programmes</div>
    );
  }

  // Filter out items without a categoryPhoto and ensure only one item per category
  const flattenedProgrammes = (programme?.categories || []) // Checkpoint to handle undefined or null `programme` and `categories`
    .filter((data) => data?.categoryPhoto?.url) // Ensure `data` and `categoryPhoto` exist before accessing `url`
    .reduce((acc, current) => {
      const categories = Array.isArray(current?.category) // Check if `current.category` is an array
        ? current.category
        : current?.category
        ? [current.category] // Convert single or non-array values to an array
        : []; // Default to an empty array if no category exists

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
  const visibleProgrammes = flattenedProgrammes;

  // Check for small screen size
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 640);

  // Update screen size on resize
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 640);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mouse down event to start scrolling
  const handleMouseDown = (e) => {
    setIsScrolling(true);
    scrollStartPosition.current = scrollContainerRef.current.scrollLeft;
    scrollStartX.current = e.pageX - scrollContainerRef.current.offsetLeft;
  };

  // Mouse move event to scroll horizontally
  const handleMouseMove = (e) => {
    if (!isScrolling) return;
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
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

  return (
    <div
      className="text-white flex flex-col items-center  max-w-[100%] mx-auto rounded-xl p-10"
     
    >
      <h1 className="text-xl sm:text-3xl text-center font-sans font-extrabold">
        Our Core Services
      </h1>

      <div
        className="gap-4 sm:gap-8 flex overflow-x-auto mt-4 rounded-lg p-6 w-full scrollbar-hide"
        ref={scrollContainerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        style={{ cursor: isScrolling ? 'grabbing' : 'grab' }}
      >
        {visibleProgrammes?.map((data) => (
          <div
            key={data?._id}
            className="relative rounded-xl overflow-hidden m-auto min-h-[40vh] max-h-[60vh] min-w-[60vw] sm:min-w-[30%] border-b-4 border-orange-600 transition-transform duration-500 ease-in-out hover:scale-110 hover:shadow-lg hover:shadow-orange-500"
          >
            <div className="relative max-h-full overflow-hidden rounded-lg">
              <img
                src={data.categoryPhoto?.url || '/default-image.jpg'}
                alt={`Category ${data._id}`}
                className="h-[40vh] object-cover w-full"
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

      <div className="flex justify-center items-center mt-4">
        <button
          className="w-12 h-12 bg-transparent text-white rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-colors duration-300"
          onClick={handleArrowDownClick}
        >
          <FaArrowDown size={50} />
        </button>
      </div>
    </div>
  );
};

export default CategoriesCard;
