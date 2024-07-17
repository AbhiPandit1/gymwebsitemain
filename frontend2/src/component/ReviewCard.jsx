import { useEffect, useState } from 'react';
import reviewRating from '../data/reviewData';
import Marquee from 'react-fast-marquee';
import ReactStars from 'react-rating-stars-component';
import ProgressBar from './Progressbar';
import { PiArrowLeftLight } from 'react-icons/pi';
import { PiArrowRightLight } from 'react-icons/pi';

const ReviewCard = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(reviewRating);
  }, []);

  

  return (
    <div className="bg-secondary  rounded-[40px] h-full   m-auto   w-[95%] sm:w-[90%]  sm:rounded-[20px] p-2 sm:p-10 ">
      <div className=" flex justify-between    items-center m-3  ">
        <div className="flex justify-start  font-extrabold items-center text-2xl sm:text-4xl font-sans text-white ">
          What People Say
        </div>
        <div className="bg-reviewColor flex justify-center items-center w-[4rem] h-10 text-xs sm:text-xl sm:w-28 sm:h-14 rounded-[7px]  sm:rounded-[10px] text-white font-sans">
          165 Total
        </div>
      </div>

      <Marquee className="flex " pauseOnClick="true" pauseOnHover="true">
        {data.map((data, id) => (
          <div
            key={id}
            className="h-[340px] w-[360px] sm:h-[400px] sm:w-[420px] bg-black m-[20px] text-white rounded-[32px]  relative flex-shrink-0 overflow-hidden"
          >
            <img
              src={data.image}
              alt="image"
              className="w-[320px] h-[300px] rounded-[32px] object-cover object-left float-end"
            />
            <div className="absolute top-2 sm:top-5 float-left  ml-[5%]">
              <ReactStars
                count={5}
                size={40}
                isHalf={true}
                emptyIcon={<i className="far fa-star"></i>}
                halfIcon={<i className="fa fa-star-half-alt"></i>}
                fullIcon={<i className="fa fa-star"></i>}
                activeColor="#F97316"
              />
              <div className="w-[70%] font-sans text-[18px] sm:text-[24px] mt-4 line-height-custom tracking-custom">
                {data.review}
              </div>
              <div className="mt-[1rem] font-extrabold items-center text-2xl font-sans text-white h-[20vh]">
                {data.name}
                <div className=" font-extrabold items-center text-1xl font-sans text-designationColor h-[20vh]">
                  {data.designation}
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
          <button className="h-10 w-10 sm:h-12 sm:w-12 bg-white rounded-xl flex justify-center items-center ">
            <PiArrowLeftLight width={20} height={60} color="#2563EB" />
          </button>{' '}
          <button className="h-10 w-10 sm:h-12 sm:w-12 bg-white rounded-xl flex justify-center items-center ">
            <PiArrowRightLight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
