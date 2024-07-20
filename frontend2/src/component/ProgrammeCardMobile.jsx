import { useState } from 'react';
import { useSelector } from 'react-redux';
import { FaPlus, FaMinus } from 'react-icons/fa';

const ProgrammeCardMobile = () => {
  const [loadButton, setLoadButton] = useState(false);

  const handleLoadMore = () => {
    setLoadButton(!loadButton);
  };

  const { programme } = useSelector((state) => state.programme);

  // Check if `programme` and `programme.categories` are defined and are arrays
  if (!programme || !Array.isArray(programme.categories)) {
    console.error('Programme data is not available or is not an array');
    return null;
  }

  // Display up to 3 items when loadButton is false, otherwise display all items
  const visibleProgrammes = loadButton
    ? programme.categories
    : programme.categories.slice(0, 3);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 mt-4 bg-trainerColor">
      {visibleProgrammes.map((data) => (
        <div
          key={data._id}
          className="relative rounded-xl overflow-hidden bg-primary m-auto h-[40vh] sm:h-[40vh] w-[70vw] sm:w-[30vw]"
        >
          <img
            src={data.categoryPhoto?.url || '/default-image.jpg'} // Fallback image in case `data.image` is not available
            alt={`Trainer ${data._id}`} // More descriptive alt text
            className="object-cover w-full h-full rounded-lg opacity-50"
          />
          <div className="absolute top-1/2 left-5 transform -translate-y-1/2">
            <div className="font-extrabold text-4xl text-white">
              {data.category}
            </div>
          </div>
        </div>
      ))}
      <div className="flex justify-center mt-4">
        <button
          className="w-40 h-12 text-lg bg-white text-black px-5 flex items-center justify-between rounded-lg shadow-md"
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
    </div>
  );
};

export default ProgrammeCardMobile;
