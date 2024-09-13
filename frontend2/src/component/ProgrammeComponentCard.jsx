import { useState } from 'react';
import { FaMinus, FaPlus } from 'react-icons/fa';
import { IoIosArrowRoundForward } from 'react-icons/io';
import { AiOutlineArrowUp } from 'react-icons/ai';
import { Link } from 'react-router-dom';

const ProgrammeComponentCard = ({ programmeData, filter }) => {
  const [loadButton, setLoadButton] = useState(false);
  const [expandedCard, setExpandedCard] = useState(null); // Track the expanded card
  const [showCategory, setShowCategory] = useState({}); // Track category visibility

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
  const visibleProgrammes = loadButton
    ? filteredProgrammes
    : filteredProgrammes.slice(0, 3);

  const handleExpandToggle = (id) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  const handleCategoryToggle = (id) => {
    setShowCategory((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="mt-10">
      {/* Grid layout with responsive columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 overflow-hidden">
        {visibleProgrammes.map((card) => (
          <div
            key={card._id}
            className="relative bg-gray-950 opacity-90 rounded-xl min-h-[450px] p-4 l w-[300px] mx-auto my-4 overflow-hidden bg-cover bg-center group border-2 border-orange-600 hover:shadow-orange-600 hover:shadow-2xl"
            style={{ backgroundImage: `url(${card.categoryPhoto?.url})` }}
          >
            {/* Dark overlay specific to hovered card */}
            <div
              className={`absolute inset-0 rounded-xl transition-opacity duration-300 ${
                expandedCard === card._id
                  ? 'bg-black opacity-60'
                  : 'bg-black opacity-30'
              }`}
            ></div>

            <div className="relative flex flex-col justify-end h-full p-4">
              {/* Title */}
              <h3 className="text-xl sm:text-2xl text-white font-bold mb-2">
                {card.title}
              </h3>

              {/* Category button */}
              <button
                onClick={() => handleCategoryToggle(card._id)}
                className="text-xs sm:text-sm font-semibold h-8 w-32 py-1 px-4 rounded-lg bg-tertiary text-white shadow-md hover:bg-gray-500 transition-colors duration-300"
              >
                {showCategory[card._id] ? 'Hide' : 'Show'}
              </button>
              {showCategory[card._id] && (
                <div className="mt-2">
                  <h2 className="text-sm sm:text-lg text-white font-sans font-bold mb-1">
                    {card.category.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-white">
                    {card.category.join(', ')}
                  </p>
                </div>
              )}

              {/* Description animation specific to expanded card */}
              <div
                className={`absolute inset-0 flex flex-col justify-end p-4 bg-primary rounded-3xl text-white font-sans transition-transform duration-300 ${
                  expandedCard === card._id
                    ? 'translate-y-0 opacity-90'
                    : 'translate-y-full opacity-0'
                }`}
                style={{ bottom: '3.5rem' }} // Ensure description stays above arrow
              >
                <div className="text-sm sm:text-lg mt-2">{card.desc}</div>
              </div>

              {/* Arrow icon to toggle description visibility */}

              <div className="flex justify-between mt-4 z-99">
                <div className="h-[3rem] w-[6rem] bg-gray-950 rounded-3x flex justify-center items-center border-4 border-orange-600 rounded-3xl">
                  <div className="text-lg sm:text-xl text-white font-sans font-bold flex items-center">
                    ${card.price}
                  </div>
                </div>

                <Link to={`/programme/${card._id}`} className="relative z-10">
                  <button className="w-[3.6rem] h-[3.2rem] bg-gray-950 border-2 hover:border-2 hover:bg-gray-800 hover:border-orange-900 border-orange-600 flex items-center justify-center rounded-xl">
                    <IoIosArrowRoundForward
                      color="white"
                      className="w-10 sm:w-14 h-8 sm:h-10"
                    />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgrammeComponentCard;
