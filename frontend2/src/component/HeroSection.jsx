import { IoIosArrowRoundDown } from 'react-icons/io';
import trainerMainImage from '../assets/trainerMainImage.jpeg';

const HeroSection = ({ category, para, searchCategory }) => {
  return (
    <div>
      <div className="h-max w-full overflow-hidden">
        <img
          src={trainerMainImage}
          alt="trainer"
          className="h-[90vh]  w-[100%] sm:w-[60%] float-right  object-right transform translate-x-[10%] sm:translate-x-[30%] relative overflow-hidden "
        />
        <div className="flex flex-col gap-5 absolute  top-[40%] sm:top-[30%] p-[10%]   w-full  overflow-hidden">
          <div className="text-white font-extrabold text-[3rem]  w-[40%] leading-none">
            {category}
          </div>
          <div className="font-sans text-[0.8rem] sm:text-[1.2rem] text-paraColor w-[80%] sm:w-[50%] ">
            {para}
          </div>
          <div className="flex left-[80%]    justify-start sm:justify-end">
            <div className="text-white flex items-center font-sans text-[1rem] sm:text-[1.5rem]">
              {searchCategory}
            </div>
            <button className="w-[20%] h-[3.5rem]  sm:static  sm:w-[8%]  flex justify-center  bg-secondary text-white items-center ml-4 mr-2 rounded-l-[1rem] rounded-r-[1rem]">
              <a href="#">
                <IoIosArrowRoundDown color="white" size={30} />
              </a>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
