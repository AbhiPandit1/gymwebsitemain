import { useState } from 'react';
import DashboardComponent from '../../../../component/DashboardComponent';
import useDashboardLinks from '../../../../../hook/CreateDahsboardLinks';
import DashboardHeader from '../../../../component/DashboardHeader';
import { BiSolidRightArrow } from 'react-icons/bi';
import { Link } from 'react-router-dom';

const DietPlan = () => {
  const dashBoardLink = useDashboardLinks();
  const [hoverDashboard, setHoverDashboard] = useState(false);
  const [dietPlan, setDietPlan] = useState([
    { day: 'Monday', meals: { breakfast: '', lunch: '', dinner: '' } },
    { day: 'Tuesday', meals: { breakfast: '', lunch: '', dinner: '' } },
    { day: 'Wednesday', meals: { breakfast: '', lunch: '', dinner: '' } },
    { day: 'Thursday', meals: { breakfast: '', lunch: '', dinner: '' } },
    { day: 'Friday', meals: { breakfast: '', lunch: '', dinner: '' } },
    { day: 'Saturday', meals: { breakfast: '', lunch: '', dinner: '' } },
    { day: 'Sunday', meals: { breakfast: '', lunch: '', dinner: '' } },
  ]);

  const handleInputChange = (day, mealType, value) => {
    setDietPlan((prevPlan) =>
      prevPlan.map((d) =>
        d.day === day ? { ...d, meals: { ...d.meals, [mealType]: value } } : d
      )
    );
  };

  const handleClick = () => {
    setHoverDashboard((prevState) => !prevState);
  };

  return (
    <div className="grid grid-cols-7 h-screen max-w-[100vw] text-white font-sans">
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
        } sm:${hoverDashboard ? 'col-span-7' : 'col-span-5'} overflow-y-scroll`}
      >
        <DashboardHeader />
        <h2 className="text-3xl font-bold mb-8 text-center">
          Weekly Diet Plan
        </h2>
        {hoverDashboard && (
          <div
            className="absolute left-0 top-[10%] animate-shake cursor-pointer hover:animate-none transition-transform duration-300"
            onClick={handleClick}
          >
            <BiSolidRightArrow size={80} color="white" />
          </div>
        )}
        <div className="p-4">
          {dietPlan.map((dayPlan, index) => (
            <div key={index} className="mb-4">
              <h2 className="text-2xl font-bold">{dayPlan.day}</h2>
              <div className="grid grid-cols-3 gap-4 mt-2">
                <div>
                  <label className="block">Breakfast</label>
                  <input
                    type="text"
                    value={dayPlan.meals.breakfast}
                    onChange={(e) =>
                      handleInputChange(
                        dayPlan.day,
                        'breakfast',
                        e.target.value
                      )
                    }
                    className="w-full p-2 rounded bg-gray-800"
                  />
                </div>
                <div>
                  <label className="block">Lunch</label>
                  <input
                    type="text"
                    value={dayPlan.meals.lunch}
                    onChange={(e) =>
                      handleInputChange(dayPlan.day, 'lunch', e.target.value)
                    }
                    className="w-full p-2 rounded bg-gray-800"
                  />
                </div>
                <div>
                  <label className="block">Dinner</label>
                  <input
                    type="text"
                    value={dayPlan.meals.dinner}
                    onChange={(e) =>
                      handleInputChange(dayPlan.day, 'dinner', e.target.value)
                    }
                    className="w-full p-2 rounded bg-gray-800"
                  />
                </div>
              </div>
            </div>
          ))}
          <div className="flex justify-end mt-8">
            <Link to="/next-step">
              <button className="p-4 bg-blue-600 rounded">Next</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DietPlan;
