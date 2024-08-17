import { useState } from 'react';
import { Link } from 'react-router-dom';
import useDashboardLinks from '../../../../hook/CreateDahsboardLinks';
import DashboardComponent from '../../../component/DashboardComponent';
import DashboardHeader from '../../../component/DashboardHeader';
import { BiSolidRightArrow } from 'react-icons/bi';

const ProgrammeKind = () => {
  const dashBoardLink = useDashboardLinks();
  const [hoverDashboard, setHoverDashboard] = useState(false);
  const [checkBox, setCheckBox] = useState('');

  const handleCheckBox = (id) => {
    setCheckBox(id);
  };

  const handleClick = () => {
    setHoverDashboard((prevState) => !prevState);
  };

  const getLinkPath = () => {
    if (checkBox === 'diet') {
      return `/trainer/create/programme/diet`;
    } else if (checkBox === 'training') {
      return `/trainer/create/programme/customizeDays`; // Navigate to customizable days page
    } else if (checkBox === 'both') {
      return `/trainer/create/programme/both`;
    }
    return '#'; // Default or fallback link
  };

  return (
    <div className="grid grid-cols-7 h-screen max-w-[100vw] text-white font-sans overflow-y-scroll">
      <div
        className={`transition-transform duration-300 ${
          hoverDashboard ? 'hidden' : 'col-span-7'
        } sm:${hoverDashboard ? 'hidden' : 'col-span-2'}`}
        onClick={handleClick}
      >
        <DashboardComponent
          dashBoardLink={dashBoardLink}
          hoverDashboard={hoverDashboard}
        />
      </div>
      <div
        className={`transition-transform duration-300 ${
          hoverDashboard ? 'col-span-7' : 'col-span-7'
        } sm:${hoverDashboard ? 'col-span-7' : 'col-span-5'}`}
      >
        <DashboardHeader />
        {hoverDashboard && (
          <div
            className="absolute left-0 top-[10%] animate-shake cursor-pointer hover:animate-none transition-transform duration-300"
            onClick={handleClick}
          >
            <BiSolidRightArrow size={80} color="white" />
          </div>
        )}

        <div className="flex flex-col justify-center items-center gap-[5rem] text-[1.5rem] sm:text-[2rem] font-extrabold">
          Programme Type
          <h1 className="text-start text-[1.5rem] sm:text-[3rem]">
            “What kind of program is this?”
          </h1>
          <div className="flex m-4 gap-[2rem]">
            <label className="flex justify-center flex-col items-center">
              Diet
              <input
                type="checkbox"
                name="Diet"
                className="w-[5rem] h-[2rem]"
                id="diet"
                checked={checkBox === 'diet'}
                onChange={() => handleCheckBox('diet')}
              />
            </label>
            <label className="flex justify-center flex-col items-center">
              Training
              <input
                type="checkbox"
                name="Training"
                className="w-[5rem] h-[2rem]"
                id="training"
                checked={checkBox === 'training'}
                onChange={() => handleCheckBox('training')}
              />
            </label>
            <label className="flex justify-center flex-col items-center">
              Both
              <input
                type="checkbox"
                name="Both"
                id="both"
                className="w-[5rem] h-[2rem]"
                checked={checkBox === 'both'}
                onChange={() => handleCheckBox('both')}
              />
            </label>
          </div>
          <Link to={getLinkPath()}>
            <button className="w-[10rem] h-[4rem] bg-secondary text-[1.5rem] flex justify-center items-center rounded-lg">
              Next <BiSolidRightArrow />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProgrammeKind;
