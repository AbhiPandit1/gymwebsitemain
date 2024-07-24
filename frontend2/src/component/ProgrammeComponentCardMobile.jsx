import { IoIosArrowRoundForward } from 'react-icons/io';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const ProgrammeComponentCardMobile = ({ programmeData }) => {
  const [loadButton, setLoadButton] = useState(false);

  const handleLoadMore = () => {
    setLoadButton(!loadButton);
  };

  // Display up to 3 items when loadButton is false, otherwise display all items
  const displayedData = loadButton ? programmeData : programmeData.slice(0, 3);

  return (
    <div className="w-full">
      <div className="grid grid-cols-1">
        {displayedData.map((card) => (
          <div
            key={card.id}
            className="bg rounded-[32px] gap-[5px] min-h-[500px] overflow-y-clip p-2 bg-primary w-[300px] my-[1rem]"
          >
            {card.categoryPhoto && (
              <img
                src={card.categoryPhoto.url}
                alt={card.type}
                className="h-[249px] object-cover rounded-[50px] p-4 opacity-1"
              />
            )}
            <div className="h-[2rem] max-w-[5rem] m-[5%] text-[0.8rem] rounded-[10px] bg-paraColor font-sans flex justify-center items-center">
              Category
            </div>
            <div className="p-4">
              <h2 className="text-xl text-white font-sans font-bold">
                {card.category}
              </h2>
            </div>
            <div className="font-sans text-1xl text-paraColor w-[90%] m-[5%] line-clamp-2">
              {card.desc}
            </div>
            <div className="flex justify-between">
              <div className="text-xl text-white font-sans font-bold flex justify-center items-center m-2">
                ${card.price}
              </div>
              <Link to={`/programme/${card._id}`}>
                <button className="w-[3.6rem] h-[3.2rem] bg-secondary flex items-center justify-center ml-4 mr-2 rounded-xl float-right">
                  <IoIosArrowRoundForward color="white" className="w-14 h-10" />
                </button>
              </Link>
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
