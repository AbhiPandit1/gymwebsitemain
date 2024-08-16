import { useEffect, useState } from 'react';
import cardData from '../data/cardData'; // default import
import { IoIosArrowRoundForward, IoIosArrowRoundBack } from 'react-icons/io';
import { Link } from 'react-router-dom';

const Card = ({ title, backgroundColor, buttonTrue }) => {
  const [data, setData] = useState([]);
  const [visibleIndex, setVisibleIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);

  useEffect(() => {
    setData(cardData);

    // Adjust the number of items per page based on screen width
    const updateItemsPerPage = () => {
      if (window.innerWidth <= 640) {
        setItemsPerPage(1);
      } else if (window.innerWidth <= 1024) {
        setItemsPerPage(2);
      } else {
        setItemsPerPage(3);
      }
    };

    updateItemsPerPage();
    window.addEventListener('resize', updateItemsPerPage);

    return () => {
      window.removeEventListener('resize', updateItemsPerPage);
    };
  }, []);

  const next = () => {
    setVisibleIndex((prev) =>
      prev + itemsPerPage >= data.length
        ? data.length - itemsPerPage
        : prev + itemsPerPage
    );
  };

  const prev = () => {
    setVisibleIndex((prev) => (prev === 0 ? 0 : prev - itemsPerPage));
  };

  return (
    <div>
      <h1 className="text-white font-sans font-extrabold text-[40px] sm:text-[48px] mt-5 sm:mt-20 ml-10">
        {title}
      </h1>
      <div className="flex items-center justify-center">
        <button
          onClick={prev}
          className="bg-secondary w-[4rem] h-[4rem] flex items-center justify-center rounded-full"
          disabled={visibleIndex === 0}
        >
          <IoIosArrowRoundBack
            color="white"
            className="w-4 h-2 sm:w-14 sm:h-10"
          />
        </button>
        <div className="overflow-hidden w-full max-w-[90%] mx-4">
          <div
            className="grid transition-transform duration-300 ease-in-out"
            style={{
              transform: `translateX(-${visibleIndex * (100 / itemsPerPage)}%)`,
              gridTemplateColumns: `repeat(${data.length}, calc(100% / ${itemsPerPage}))`,
            }}
          >
            {data.map((card, index) => (
              <div
                key={card.id}
                className={`bg-${backgroundColor} rounded-[32px] p-4 h-[400px] m-2 flex-shrink-0`}
                style={{ minWidth: `calc(100% / ${itemsPerPage})` }}
              >
                <img
                  src={card.image}
                  alt={card.type}
                  className="h-[249px] w-full object-cover rounded-[32px]"
                />
                <div className="p-4">
                  <h2 className="text-xl text-white font-sans font-bold">
                    {card.type}
                  </h2>
                </div>
                <button className="w-[4rem] h-[4rem] bg-secondary flex items-center ml-4 mr-2 rounded-l-[1rem] rounded-r-[1rem] float-right">
                  <IoIosArrowRoundForward color="white" className="w-14 h-10" />
                </button>
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={next}
          className="bg-secondary w-[4rem] h-[4rem] flex items-center justify-center rounded-full"
          disabled={visibleIndex + itemsPerPage >= data.length}
        >
          <IoIosArrowRoundForward
            color="white"
            className="w-4 h-2 sm:w-14 sm:h-10"
          />
        </button>
      </div>

      <div className="flex justify-center mb-2">
        <Link to="/programmes">
          {buttonTrue && (
            <button className="w-[8rem] h-[4rem] bg-secondary flex items-center ml-4 mr-2 rounded-l-[1rem] rounded-r-[1rem] font-sans text-white pl-3">
              See all
              <IoIosArrowRoundForward color="white" className="w-14 h-10" />
            </button>
          )}
        </Link>
      </div>
    </div>
  );
};

export default Card;
