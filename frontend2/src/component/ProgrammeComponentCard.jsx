import { useState } from 'react';
import { FaMinus, FaPlus } from 'react-icons/fa';
import { IoIosArrowRoundForward } from 'react-icons/io';
import ProgrammeDetail from '../pages/user/ProgrammeDetail'; // Ensure this path is correct

const ProgrammeComponentCard = ({ programmeData, filter }) => {
  const [loadButton, setLoadButton] = useState(false);
  const [expandedCard, setExpandedCard] = useState(null);
  const [showCategory, setShowCategory] = useState({});
  const [selectedProgramme, setSelectedProgramme] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    : filteredProgrammes.slice(0, 9);

  const handleExpandToggle = (id) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  const handleCategoryToggle = (id) => {
    setShowCategory((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const openModal = (programme) => {
    setSelectedProgramme(programme);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProgramme(null);
  };

  return (
    <div className="mt-10">
      {/* Grid layout with responsive columns */}
      <div className="grid w-[100vw] grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 overflow-hidden">
        {visibleProgrammes.map((card) => (
          <div
            key={card._id}
            className="relative bg-gray-950 opacity-90 rounded-xl min-h-[450px] p-4 w-[300px] mx-auto my-4 overflow-hidden bg-cover bg-center group border-2 border-orange-600 hover:border-4 hover:shadow-2xl"
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
                style={{ bottom: '3.5rem' }}
              >
                <div className="text-sm sm:text-lg mt-2">{card.desc}</div>
              </div>
              {card.discount > 0 && (
                <div className="h-7 w-20 border-2 border-green-300 mt-4 flex justify-center items-center bg-green-500 ">
                  {card.discount}% OFF
                </div>
              )}
              {/* Arrow icon to toggle description visibility */}
              <div className="flex  justify-between mt-4 z-10">
                <div className="flex justify-between mt-4 z-10">
                  <div className="flex brightness-200">
                    {card?.discount > 0 && (
                      <span className="text-gray-400 line-through text-lg mr-2">
                        $
                        {Math.ceil(
                          card.price + card.price.toFixed(2) / card.discount
                        ).toFixed(2)}
                      </span>
                    )}

                    <p className="text-2xl font-bold text-yellow-600">
                      ${card?.price.toFixed(2)}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => openModal(card)}
                  className="w-[3.6rem] h-[3.2rem] sm:h-[3.2rem] bg-gray-950 border-2 border-orange-600 hover:bg-gray-800 hover:border-orange-900 flex items-center justify-center rounded-xl"
                >
                  <IoIosArrowRoundForward
                    color="white"
                    className="w-10 sm:w-14 h-8 sm:h-10"
                  />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for ProgrammeDetail */}
      {isModalOpen && selectedProgramme && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <ProgrammeDetail
            programmeId={selectedProgramme._id}
            closeModal={closeModal}
          />
        </div>
      )}
    </div>
  );
};

export default ProgrammeComponentCard;
