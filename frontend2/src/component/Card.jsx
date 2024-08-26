import { useEffect, useState, useRef } from 'react';
import cardData from '../data/cardData'; // default import
import { IoIosArrowRoundForward } from 'react-icons/io';

const Card = ({ title, backgroundColor }) => {
  const [data, setData] = useState([]);
  const [visibleIndex, setVisibleIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const containerRef = useRef(null);

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

  // Mouse down event to start dragging
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
  };

  // Mouse move event to scroll horizontally
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Adjust scroll speed
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  // Mouse up and leave events to stop dragging
  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousedown', handleMouseDown);
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseup', handleMouseUpOrLeave);
      container.addEventListener('mouseleave', handleMouseUpOrLeave);
    }

    return () => {
      if (container) {
        container.removeEventListener('mousedown', handleMouseDown);
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseup', handleMouseUpOrLeave);
        container.removeEventListener('mouseleave', handleMouseUpOrLeave);
      }
    };
  }, [isDragging]);

  return (
    <div>
      <h1 className="text-white font-extrabold text-[40px] sm:text-[48px] mt-10 sm:mt-20 border-b-2 border-orange-500 text-center">
        {title}
      </h1>
      <div
        ref={containerRef}
        className="overflow-x-auto w-full max-w-[95%] mx-auto mt-4 cursor-grab scrollbar-hide"
      >
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{
            transform: `translateX(-${visibleIndex * (100 / itemsPerPage)}%)`,
            gridTemplateColumns: `repeat(${data.length}, calc(100% / ${itemsPerPage}))`,
          }}
        >
          {data.map((card) => (
            <div
              key={card.id}
              className={`bg-${backgroundColor} rounded-[16px] p-4 h-[400px] m-2 flex-shrink-0 border-b-4 border-orange-400 hover:border hover:border-orange-600 transition-all`}
              style={{ minWidth: `calc(100% / ${itemsPerPage})` }}
            >
              <img
                src={card.image}
                alt={card.type}
                className="h-[300px] w-full object-cover rounded-[32px]"
              />
              <div className="p-4 flex justify-between flex-col sm:flex-row">
                <h2 className="text-xl text-white font-sans font-bold flex justify-center items-center">
                  {card.type}
                </h2>
                <h1 className="text-white font-orbitron flex justify-center items-center">
                  know more
                  <span>
                    <IoIosArrowRoundForward
                      color="orange"
                      className="w-10 h-8 sm:w-14 sm:h-10"
                    />
                  </span>
                </h1>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Card;
