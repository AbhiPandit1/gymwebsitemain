import { IoMdMail } from 'react-icons/io';
import Equipment from '../assets/Equipment.png';
import { PiArrowRightLight } from 'react-icons/pi';

const EquipCard = () => {
  return (
    <div className="grid sm:grid-cols-2 overflow-y-hidden  bg-secondary h-[100vh] sm:min-h-[40vh] sm:max-h-[50vh] pb-10 rounded-xl w-[95%] min-w-screen m-auto mt-5 overflow-hidden">
      {/*Grid 1 */}
      <div className="flex justify-center order-2 sm:order-1 items-center">
        <img
          src={Equipment}
          alt="equip"
          className="h-[60vh] sm:h-[80vh] w-[40vw] transform sm:-rotate-180 rotate-0 sm:translate-y-[-20%]"
        />
      </div>

      {/*Grid 2 */}
      <div className="flex flex-col gap-8 order-1 sm:order-2  p-8">
        <div className="flex justify-center items-center text-white font-bold leading-none font-sans text-[2rem] sm:text-[2.8rem] w-[100%] sm:w-[90%]">
          Get free fitness and diet tips
        </div>
        <div className="text-center text-paraColor  flex justify-start">
          Sign up for our newsletter
        </div>
        <div className="flex font-sans relative">
          <IoMdMail size={30} color="black" className="absolute top-4 left-5" />
          <input
            type="email"
            placeholder="          Enter Your email....."
            className="w-[100%] sm:w-[80%] h-[4rem] font-sans rounded-l-[1rem] rounded-r-[1rem] p-4 bg-white border-secondary border-[1px]"
          />
          <PiArrowRightLight
            size={30}
            color="black"
            className="absolute right-[5%] sm:right-[24%] top-5"
          />
        </div>
      </div>
    </div>
  );
};

export default EquipCard;
