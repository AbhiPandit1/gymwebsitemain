import { useEffect, useState } from 'react';
import cardData from '../data/cardData'; // default import
import Marquee from 'react-fast-marquee';
import { IoIosArrowRoundForward } from 'react-icons/io';

const Card = ({ title, backgroundColor }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(cardData);
  }, []);

  return (
    <div>
      <h1 className="text-white font-sans font-extrabold text-[40px] sm:text-[48px]  mt-5 sm:mt-20 ml-10">
        {title}
      </h1>
      <Marquee className="flex" pauseOnClick="true" pauseOnHover="true">
        {data.map((card) => (
          <div
            key={card.id}
            className={`bg-${backgroundColor} rounded-[32px]  gap-[16px] p-4 h-[400px] w-[368.4px] m-[2rem]`}
          >
            <img
              src={card.image}
              alt={card.type}
              className="h-[249px] w-[336px] object-cover  rounded-[32px]"
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
      </Marquee>
      <div className="flex justify-center mb-2">
        <button className="w-[8rem] h-[4rem] bg-secondary flex items-center ml-4 mr-2 rounded-l-[1rem] rounded-r-[1rem] font-sans text-white pl-3">
          See All
          <IoIosArrowRoundForward color="white" className="w-14 h-10" />
        </button>
      </div>
    </div>
  );
};

export default Card;
