import { useState } from 'react';
import { IoIosArrowRoundForward } from 'react-icons/io';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { AiOutlineArrowUp } from 'react-icons/ai';
import { Link } from 'react-router-dom';

const ProgrammeComponentCardMobile = ({ programmeData, filter }) => {
  const [loadButton, setLoadButton] = useState(false);
  const [expandedCard, setExpandedCard] = useState(null);
  const [showCategory, setShowCategory] = useState({});

  const handleLoadMore = () => {
    // Toggle the state between true and false
    setLoadButton((prev) => !prev);
  };

  const applyFilter = (data) => {
    switch (filter) {
      case 'priceLowToHigh':
        return [...data].sort((a, b) => a.price - b.price);
      case 'priceHighToLow':
        return [...data].sort((a, b) => b.price - a.price);
      case 'bestsellers':
        return [...data].sort((a, b) => b.sales - a.sales);
      default:
        return data;
    }
  };

  const filteredProgrammes = applyFilter(programmeData);

  // Adjusted the slicing logic based on loadButton state
  const displayedData = loadButton
    ? filteredProgrammes
    : filteredProgrammes.slice(0, 3); // Show only 3 items by default

  const handleExpandToggle = (id) => {
    setExpandedCard((prev) => (prev === id ? null : id));
  };

  const handleCategoryToggle = (id) => {
    setShowCategory((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="mt-10">
      <div className="grid grid-cols-1 gap-4 h-auto">
        {displayedData.map((card) => (
          <div
            key={card._id}
            className="relative bg-gray-950 opacity-90 rounded-xl min-h-[500px] p-4 w-[300px] my-4 bg-cover bg-center group border-2 border-orange-600 hover:shadow-lg"
            style={{ backgroundImage: `url(${card.categoryPhoto?.url})` }}
          >
            <div
              className={`absolute inset-0 rounded-xl transition-opacity duration-300 ${
                expandedCard === card._id
                  ? 'bg-black opacity-60'
                  : 'bg-black opacity-30'
              }`}
            ></div>

            <div className="relative flex flex-col justify-end h-full p-4">
              {/* Title */}
              <h3 className="text-2xl text-white font-bold mb-2">
                {card.title}
              </h3>

              {/* Category button */}
              <button
                onClick={() => handleCategoryToggle(card._id)}
                className="text-sm font-semibold h-8 w-32 py-1 px-4 rounded-lg bg-gray-700 text-white shadow-md hover:bg-gray-500 transition-colors duration-300"
              >
                {showCategory[card._id] ? 'Hide' : 'Show'}
              </button>
              {showCategory[card._id] && (
                <div className="mt-2">
                  <h2 className="text-lg text-white font-bold mb-1">
                    {card.category.title}
                  </h2>
                  <p className="text-sm text-white">
                    {card.category.join(', ')}
                  </p>
                </div>
              )}

              {/* Description animation specific to expanded card */}
              <div
                className={`absolute inset-0 flex flex-col justify-end p-4 bg-gray-800 rounded-3xl text-white font-sans transition-transform duration-300 ${
                  expandedCard === card._id
                    ? 'translate-y-0 opacity-90'
                    : 'translate-y-full opacity-0'
                }`}
                style={{ bottom: '3.5rem' }}
              >
                <div className="text-lg mt-2">{card.desc}</div>
              </div>

              {/* Arrow icon to toggle description visibility */}
              <div className="absolute bottom-0 w-full flex justify-center p-4">
                <button
                  className={`bg-gray-900 rounded-full p-2 border-2 border-orange-600 hover:border-orange-900 hover:bg-gray-800 ${
                    expandedCard === card._id ? 'bg-opacity-80' : ''
                  }`}
                  onClick={() => handleExpandToggle(card._id)}
                >
                  <AiOutlineArrowUp
                    color="white"
                    className={`w-8 h-8 transform transition-transform duration-300 ${
                      expandedCard === card._id ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              </div>

              <div className="flex justify-between mt-4 z-10">
                <div className="text-xl text-white font-bold flex items-center">
                  ${card.price}
                </div>
                <Link to={`/programme/${card._id}`} className="relative z-10">
                  <button className="w-14 h-10 bg-gray-900 border-2 border-orange-600 hover:bg-gray-800 hover:border-orange-900 flex items-center justify-center rounded-xl">
                    <IoIosArrowRoundForward color="white" className="w-7 h-7" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-4">
        <button
          className="w-40 h-12 text-lg bg-gray-900 hover:bg-gray-600 border-2 border-orange-600 text-white px-5 flex items-center justify-between rounded-lg shadow-md"
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

export default ProgrammeComponentCardMobile;
