import { useState } from 'react';
import DashboardComponent from '../../../../component/DashboardComponent';
import useDashboardLinks from '../../../../../hook/CreateDahsboardLinks';
import DashboardHeader from '../../../../component/DashboardHeader';
import { BiSolidRightArrow } from 'react-icons/bi';
import { AiOutlineClose, AiOutlineDelete } from 'react-icons/ai';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

const DietPlan = () => {
  const dashBoardLink = useDashboardLinks();
  const { id, programmeId } = useParams(); // Get the IDs from the URL params
  const [hoverDashboard, setHoverDashboard] = useState(false);
  const [dietPlan, setDietPlan] = useState([
    {
      id: 1,
      day: 'Day 1',
      meals: [{ id: 1, time: '', meal: '' }],
    },
  ]);
  const [removedDays, setRemovedDays] = useState([]);
  const navigate = useNavigate();

  const { programme } = useSelector((state) => state.programme);

  const handleInputChange = (dayId, mealId, field, value) => {
    setDietPlan((prevPlan) =>
      prevPlan.map((d) =>
        d.id === dayId
          ? {
              ...d,
              meals: d.meals.map((meal) =>
                meal.id === mealId ? { ...meal, [field]: value } : meal
              ),
            }
          : d
      )
    );
  };

  const handleRemoveDay = (dayId) => {
    setRemovedDays((prevRemovedDays) => [
      ...prevRemovedDays,
      dietPlan.find((d) => d.id === dayId),
    ]);
    setDietPlan((prevPlan) => prevPlan.filter((d) => d.id !== dayId));
  };

  const handleAddDay = () => {
    const newDayId = dietPlan.length + 1;
    setDietPlan((prevPlan) => [
      ...prevPlan,
      {
        id: newDayId,
        day: `Day ${newDayId}`,
        meals: [{ id: 1, time: '', meal: '' }],
      },
    ]);
  };

  const handleAddMeal = (dayId) => {
    setDietPlan((prevPlan) =>
      prevPlan.map((d) =>
        d.id === dayId
          ? {
              ...d,
              meals: [
                ...d.meals,
                { id: d.meals.length + 1, time: '', meal: '' },
              ],
            }
          : d
      )
    );
  };

  const handleClick = () => {
    setHoverDashboard((prevState) => !prevState);
  };
  const backendapi = import.meta.env.VITE_BACKEND_URL;
  const handleSubmit = async () => {
    try {
      const response = await fetch(
        `${backendapi}/api/trainer/diet/plan/${programmeId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ days: dietPlan }), // Wrap dietPlan in an object with a 'days' key
        }
      );

      if (response.ok) {
        const data = await response.json();
        toast.success('Diet plan created');
        if (programme.planType === 'Both') {
          navigate(`/trainer/create/programme/day/plan/${id}/${programmeId}`);
        } else {
          navigate(`/trainer/programme/diet/plan/${id}`);
        }
      }
    } catch (error) {
      console.error('Error:', error.message);
      toast.error('An error occurred while creating the diet plan.');
    }
  };

  return (
    <div className="grid grid-cols-9 h-screen max-w-[100vw] text-white font-sans bg-gray-900">
      <div
        className={`transition-transform duration-300 bg-gray-900 ${
          hoverDashboard ? 'hidden sm:hidden' : 'col-span-2 sm:col-span-1'
        }`}
        onClick={handleClick}
      >
        <DashboardComponent
          dashBoardLink={dashBoardLink} // Fixed variable name
          hoverDashboard={hoverDashboard}
        />
      </div>
      <div
        className={`transition-transform duration-300 ${
          hoverDashboard
            ? 'col-span-9 sm:col-span-9'
            : 'col-span-7 sm:col-span-8'
        } overflow-scroll`}
      >
        <DashboardHeader />
        {hoverDashboard && (
          <div
            className="absolute left-0 z-10 top-[10%] animate-shake cursor-pointer hover:animate-none transition-transform duration-300"
            onClick={handleClick}
          >
            <BiSolidRightArrow size={40} color="orange" />
          </div>
        )}

        <h2 className="text-3xl font-bold mb-8 text-center">
          Weekly Diet Plan
        </h2>

        <div className="p-4">
          {dietPlan.map((dayPlan) => (
            <div key={dayPlan.id} className="mb-8 relative">
              <button
                onClick={() => handleRemoveDay(dayPlan.id)}
                className="absolute top-2 right-2 text-red-600 hover:text-red-800"
              >
                <AiOutlineDelete size={24} />
              </button>
              <h2 className="text-2xl font-bold mb-4">{dayPlan.day}</h2>
              {dayPlan.meals.map((meal) => (
                <div key={meal.id} className="mb-4">
                  <h3 className="text-xl font-semibold mb-2">Meal {meal.id}</h3>
                  <div className="flex space-x-4">
                    <input
                      type="time"
                      value={meal.time}
                      onChange={(e) =>
                        handleInputChange(
                          dayPlan.id,
                          meal.id,
                          'time',
                          e.target.value
                        )
                      }
                      className="p-2 rounded bg-gray-800"
                    />
                    <input
                      type="text"
                      value={meal.meal}
                      onChange={(e) =>
                        handleInputChange(
                          dayPlan.id,
                          meal.id,
                          'meal',
                          e.target.value
                        )
                      }
                      placeholder="Enter meal details"
                      className="p-2 w-full rounded bg-gray-800"
                    />
                  </div>
                </div>
              ))}
              <button
                onClick={() => handleAddMeal(dayPlan.id)}
                className="p-2 bg-orange-900 rounded mb-4"
              >
                Add Another Meal
              </button>
            </div>
          ))}
          <button
            onClick={handleAddDay}
            className="p-4 bg-orange-900 rounded mb-4"
          >
            Add Another Day
          </button>
          <div className="flex justify-end mt-8">
            <button onClick={handleSubmit} className="p-4 bg-blue-600 rounded">
              Submit Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DietPlan;
