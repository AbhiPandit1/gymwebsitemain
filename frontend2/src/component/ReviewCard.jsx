import { useEffect, useRef, useState } from 'react';
import ReactStars from 'react-rating-stars-component';
import { CgProfile } from 'react-icons/cg';

// Modal Component
const Modal = ({ reviewText, onClose }) => {
  if (!reviewText) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-orange-600 p-6 rounded-lg shadow-lg max-w-lg w-full relative">
        <button
          className="absolute top-2 right-2 bg-orange-500 text-white rounded-full p-2 hover:bg-orange-400 transition-colors"
          onClick={onClose}
        >
          &times;
        </button>
        <div className="text-lg text-white">{reviewText}</div>
      </div>
    </div>
  );
};

const ReviewCard = () => {
  const [data, setData] = useState([]);
  const [isScrolling, setIsScrolling] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [selectedReview, setSelectedReview] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/get/review`
        ); // API endpoint to get reviews
        const reviews = await response.json();
        setData(reviews);
        console.log(reviews);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures this runs only once on mount

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
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
  };

  // Mouse move event to scroll horizontally
  const handleMouseMove = (e) => {
    if (!isScrolling) return;
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = x - startX; // distance scrolled
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  // Mouse up or leave event to stop scrolling
  const handleMouseUpOrLeave = () => {
    setIsScrolling(false);
  };

  const handleCardClick = (reviewText) => {
    setSelectedReview(reviewText);
  };

  const closeModal = () => {
    setSelectedReview(null);
  };

  return (
    <div className="rounded-[40px] h-full m-auto w-[100%] sm:rounded-[10px] p-4">
      <div className="flex justify-between items-center m-3">
        <h2 className="flex justify-between text-center font-extrabold items-center text-2xl sm:text-4xl font-sans text-white">
          What People Say
        </h2>
        <div className="bg-orange-600 flex justify-center items-center w-[4rem] h-10 text-xs sm:text-xl sm:w-28 sm:h-14 rounded-[7px] sm:rounded-[10px] text-white font-sans">
          {data.length} Total
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div
          ref={containerRef}
          className="flex overflow-x-auto w-full p-4 scrollbar-hide"
          style={{
            cursor: isScrolling ? 'grabbing' : 'grab',
          }} // Hide scrollbars
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
        >
          {data.map((item, index) => (
            <div
              key={index}
              className="h-[340px] p-4 min-w-[60vw] sm:min-w-[30vw] flex flex-col justify-around bg-transparent m-[20px] min-h-[40vh] sm:min-h-[60vh] text-white rounded-[10px] relative border border-orange-400 border-b-8 border-b-orange-500 overflow-hidden shadow-lg hover:border-4 hover:border-b-orange-600 transition-all cursor-pointer"
              onClick={() => handleCardClick(item.reviewText)}
            >
              <div className="font-sans min-h-[60%] text-[18px] sm:text-[24px] mt-4 leading-snug tracking-wide overflow-scroll scrollbar-hide">
                {item.reviewText || 'No review text available.'}
              </div>

              <div className="absolute top-5 left-5 w-[90%] p-4 rounded-lg "></div>
              <div className="mt-4 font-extrabold text-2xl flex justify-between font-sans text-white">
                {item.user?.profilePhoto?.url ? (
                  <img
                    src={item.user.profilePhoto.url}
                    alt={item.user.name || 'Anonymous'}
                    className="w-[4rem] h-[4rem] rounded-full object-cover object-center ml-[10%]"
                  />
                ) : (
                  <CgProfile size={40} color="white" />
                )}
                {item.user?.name || 'Anonymous'}
              </div>
              <ReactStars
                count={5}
                size={40}
                isHalf={true}
                value={item.rating}
                activeColor="#F97316"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <Modal reviewText={selectedReview} onClose={closeModal} />
    </div>
  );
};

export default ReviewCard;
