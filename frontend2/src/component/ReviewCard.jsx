import { useEffect, useState, useRef } from 'react';
import Marquee from 'react-fast-marquee';
import ReactStars from 'react-rating-stars-component';
import ProgressBar from './Progressbar';
import { PiArrowLeftLight, PiArrowRightLight } from 'react-icons/pi';

const ReviewCard = () => {
  const [data, setData] = useState([]);
  const marqueeRef = useRef(null); // Reintroduce the marquee reference

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('api/get/review'); // API endpoint to get reviews
        const reviews = await response.json();
        setData(reviews);
        console.log(reviews);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-secondary rounded-[40px] h-full m-auto w-[95%] sm:w-[90%] sm:rounded-[20px] p-4 sm:p-10">
      <div className="flex justify-between items-center m-3">
        <div className="flex justify-start font-extrabold items-center text-2xl sm:text-4xl font-sans text-white">
          What People Say
        </div>
        <div className="bg-reviewColor flex justify-center items-center w-[4rem] h-10 text-xs sm:text-xl sm:w-28 sm:h-14 rounded-[7px] sm:rounded-[10px] text-white font-sans">
          {data.length} Total
        </div>
      </div>

      <div className="relative">
        <Marquee
          className="flex"
          pauseOnClick={true}
          pauseOnHover={true}
          speed={50} // Adjust the speed as needed
          loop={0} // Infinite loop
          gradient={false} // Disables the gradient effect at the edges
          ref={marqueeRef} // Assign the reference here
        >
          {data.map((item, id) => (
            <div
              key={id}
              className="h-[340px] w-[360px] sm:h-[400px] sm:w-[420px] bg-black m-[20px] text-white rounded-[32px] relative flex-shrink-0 overflow-hidden shadow-lg"
            >
              <img
                src={item.user?.profilePhoto?.url || '/default-image.png'} // Default image if none is provided
                alt={item.user?.name || 'Anonymous'}
                className="w-full h-full rounded-[32px] object-cover object-center"
              />
              <div className="absolute top-5 left-5">
                <ReactStars
                  count={5}
                  size={40}
                  isHalf={true}
                  value={item.rating} // Assuming you have a rating field in your review data
                  activeColor="#F97316"
                />
                <div className="w-full sm:w-[90%] font-sans text-[18px] sm:text-[24px] mt-4 leading-snug tracking-wide">
                  {item.reviewText || 'No review text available.'}
                </div>
                <div className="mt-4 font-extrabold text-2xl font-sans text-white">
                  {item.user?.name || 'Anonymous'}
                  <div className="text-sm font-bold text-designationColor">
                    User
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Marquee>

        <div className="flex justify-between items-center mt-5">
          <div className="ml-8">
            <ProgressBar />
          </div>
          <div className="gap-3 flex mr-4">
            <button
              className="h-10 w-10 sm:h-12 sm:w-12 bg-white rounded-xl flex justify-center items-center shadow-md hover:bg-gray-200 transition"
              onClick={() => (marqueeRef.current.scrollLeft -= 300)} // Scrolls left by 300px
            >
              <PiArrowLeftLight width={20} height={60} color="#2563EB" />
            </button>
            <button
              className="h-10 w-10 sm:h-12 sm:w-12 bg-white rounded-xl flex justify-center items-center shadow-md hover:bg-gray-200 transition"
              onClick={() => (marqueeRef.current.scrollLeft += 300)} // Scrolls right by 300px
            >
              <PiArrowRightLight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
