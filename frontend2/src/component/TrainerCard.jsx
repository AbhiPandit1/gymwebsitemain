import { useEffect, useState } from 'react';
import trainerData from '../data/trainerData';
import {
  AiFillFacebook,
  AiFillInstagram,
  AiFillLinkedin,
} from 'react-icons/ai';

const TrainerCard = () => {
  const [trainerDatas, setTrainerDatas] = useState([]);

  useEffect(() => {
    // Set trainerDatas state with trainerData array on component mount
    setTrainerDatas(trainerData);
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4   ">
      {trainerDatas.map((data) => (
        <div
          key={data.id}
          className="rounded-xl  m-auto h-[40vh] w-[70vw] sm:h-[40vh] sm:w-[20vw] overflow-hidden bg-primary relative"
        >
          <img
            src={data.image}
            alt="trainer"
            className="object-cover h-full transform translate-x-[30%]  float-right w-full rounded-lg"
          />
          <div>
            <div className="flex absolute top-5 left-5 gap-0 bg-secondary rounded-xl">
              <AiFillInstagram size={40} color="white" />
              <AiFillLinkedin size={40} color="white" />
              <AiFillFacebook size={40} color="white" />
            </div>
            <div className="mt-[1rem] font-extrabold items-center text-2xl font-sans text-white h-[20vh] absolute top-[70%] left-[5%]">
              {data.name}
              <div className=" font-extrabold items-center text-1xl font-sans text-paraColor h-[20vh] absolute top-[20%] left-[10%] ">
                {data.profession}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrainerCard;
