import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FaMinus, FaPlus } from 'react-icons/fa';
import ProgrammeCardMobile from './ProgrammeCardMobile';
import EquipCard from './EquipCard';
import SkeletonCard from '../pages/skeletons/SkeletonCard';
import SkeletonLoader from '../pages/skeletons/SkeletonLoader';
import Footer from './Footer';

const ProgrammeCard = () => {
  const [loadButton, setLoadButton] = useState(false);
  const [loading, setLoading] = useState(true); // State to manage loading
  const { programme } = useSelector((state) => state.programme);

  // Toggle Load More/Load Less button
  const handleLoadMore = () => {
    setLoadButton(!loadButton);
  };

  // Check if `programme` and `programme.categories` are defined and are arrays
  if (!programme || !Array.isArray(programme.categories)) {
    console.error('Programme data is not available or is not an array');
    return (
      <div className="text-center text-white">Error loading programmes</div>
    );
  }

  // Filter out items without a categoryPhoto and ensure only one item per category
  const flattenedProgrammes = programme.categories
    .filter((data) => data.categoryPhoto?.url)
    .reduce((acc, current) => {
      // Extract unique categories
      current.category.forEach((cat) => {
        if (!acc.some((item) => item.category.includes(cat))) {
          acc.push({
            ...current,
            category: [cat], // Keep only one category for unique representation
          });
        }
      });
      return acc;
    }, []);

  // Display up to 4 items when loadButton is false, otherwise display all items
  const visibleProgrammes = loadButton
    ? flattenedProgrammes
    : flattenedProgrammes.slice(0, 4);

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

  // Simulate data fetching
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false); // Set loading to false after 2 seconds
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="text-white">
      <div className="bg-footerColor flex flex-col items-center text-white min-h-screen max-w-[90%] mx-auto rounded-xl p-10">
        <div className="flex flex-col sm:flex-row justify-between items-center w-full p-1 sm:p-10">
          <h1 className="text-[1xl] sm:text-[3rem] font-sans font-extrabold">
            Our Core Services
          </h1>
          <div className="h-[2.5rem] w-[3.5rem] sm:h-[3rem] sm:w-[4em] rounded-xl flex justify-center items-center border bg-white text-black">
            {flattenedProgrammes.length} total
          </div>
        </div>

        {loading ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 mt-4 rounded-lg p-6 bg-trainerColor w-[90%]">
              {Array(4)
                .fill(null)
                .map((_, index) => (
                  <SkeletonCard key={index} />
                ))}
            </div>
            <SkeletonLoader />
          </>
        ) : !isSmallScreen ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 mt-4 rounded-lg p-6  w-[90%]">
              {visibleProgrammes.map((data) => (
                <div
                  key={data._id}
                  className="relative rounded-xl overflow-hidden bg-primary m-auto h-[40vh] w-[70vw] sm:h-[40vh] sm:w-[30vw]"
                >
                  <img
                    src={data.categoryPhoto?.url || '/default-image.jpg'}
                    alt={`Trainer ${data._id}`}
                    className="object-cover w-full h-full rounded-lg brightness-125 opacity-30"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="font-extrabold text-2xl sm:text-4xl text-white text-center">
                      {data.category}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center items-center mt-4">
              <button
                className="w-40 h-12 text-lg bg-orange-600 text-white px-5 flex items-center justify-between rounded-lg shadow-md"
                onClick={handleLoadMore}
              >
                {loadButton ? (
                  <>
                    <FaMinus className="ml-2" />
                    Load Less
                  </>
                ) : (
                  <>
                    <FaPlus className="ml-2" />
                    Load More
                  </>
                )}
              </button>
            </div>
          </>
        ) : (
          <ProgrammeCardMobile />
        )}
      </div>

      <div className="mt-4">
        <EquipCard />
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
};

export default ProgrammeCard;
