import { useState } from 'react';
import { IoIosArrowRoundForward } from 'react-icons/io';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { AiOutlineArrowDown, AiOutlineArrowUp } from 'react-icons/ai'; // Import arrow icons
import { Link } from 'react-router-dom';

const ProgrammeComponentCardMobile = ({ programmeData, filter }) => {
  const [loadButton, setLoadButton] = useState(false);
  const [expandedCard, setExpandedCard] = useState(null); // Track the expanded card

  const handleLoadMore = () => {
    setLoadButton(!loadButton);
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

  // Display up to 3 items when loadButton is false, otherwise display all items
  const displayedData = loadButton
    ? filteredProgrammes
    : filteredProgrammes.slice(0, 3);

  const handleExpandToggle = (id) => {
    setExpandedCard(expandedCard === id ? null : id); // Toggle description visibility
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 gap-4">
        {displayedData.map((card) => (
          <div
            key={card._id}
            className="relative bg-primary rounded-[32px] min-h-[500px] p-2 w-[300px] my-[1rem] overflow-hidden bg-cover bg-center"
            style={{ backgroundImage: `url(${card.categoryPhoto?.url})` }}
          >
            <div className="absolute inset-0 bg-black opacity-50 rounded-[32px]"></div>
            <div className="relative flex flex-col justify-end h-full p-4">
              <div className="h-[2rem] max-w-[5rem] mb-2 text-[0.8rem] rounded-[10px] bg-paraColor font-sans flex justify-center items-center text-black">
                Category
              </div>
              <h2 className="text-xl text-white font-sans font-bold">
                {card.category}
              </h2>

              {/* Description section with toggle visibility */}
              <div
                className={`absolute inset-0 flex flex-col justify-end p-4 bg-primary rounded-[32px] text-white font-sans transition-transform duration-300 ${
                  expandedCard === card._id
                    ? 'translate-y-0 opacity-90'
                    : 'translate-y-full opacity-0'
                }`}
                style={{ bottom: '3.5rem' }} // Ensure description stays above arrow
              >
                <div className="text-1xl mt-2">{card.desc}</div>
              </div>

              {/* Arrow icon to toggle description visibility */}
              <div className="absolute bottom-0 w-full flex justify-center p-4">
                <button
                  className="bg-secondary rounded-full p-2"
                  onClick={() => handleExpandToggle(card._id)}
                >
                  {expandedCard === card._id ? (
                    <AiOutlineArrowUp color="white" className="w-8 h-8" />
                  ) : (
                    <AiOutlineArrowDown color="white" className="w-8 h-8" />
                  )}
                </button>
              </div>

              <div className="flex justify-between mt-4">
                <div className="text-xl text-white font-sans font-bold flex items-center">
                  ${card.price}
                </div>
                <Link to={`/programme/${card._id}`}>
                  <button className="w-[3.6rem] h-[3.2rem] bg-secondary flex items-center justify-center rounded-xl">
                    <IoIosArrowRoundForward
                      color="white"
                      className="w-14 h-10"
                    />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-4">
        <button
          className="w-40 h-12 text-lg bg-secondary text-white px-5 flex items-center justify-between rounded-lg shadow-md"
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
