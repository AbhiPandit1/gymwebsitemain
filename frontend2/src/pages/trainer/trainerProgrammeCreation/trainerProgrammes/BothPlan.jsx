import { useState } from 'react';
import { Link } from 'react-router-dom';
import useDashboardLinks from '../../../../../hook/CreateDahsboardLinks';
import DashboardComponent from '../../../../component/DashboardComponent';
import DashboardHeader from '../../../../component/DashboardHeader';
import { BiSolidRightArrow, BiSolidXCircle, BiArrowBack } from 'react-icons/bi';

const BothPlan = () => {
  const dashBoardLink = useDashboardLinks();
  const [hoverDashboard, setHoverDashboard] = useState(false);
  const [showDayPlan, setShowDayPlan] = useState(false); // State to toggle between DietPlan and DayPlan
  const [dietPlan, setDietPlan] = useState([
    { day: 'Monday', meals: { breakfast: '', lunch: '', dinner: '' } },
    { day: 'Tuesday', meals: { breakfast: '', lunch: '', dinner: '' } },
    { day: 'Wednesday', meals: { breakfast: '', lunch: '', dinner: '' } },
    { day: 'Thursday', meals: { breakfast: '', lunch: '', dinner: '' } },
    { day: 'Friday', meals: { breakfast: '', lunch: '', dinner: '' } },
    { day: 'Saturday', meals: { breakfast: '', lunch: '', dinner: '' } },
    { day: 'Sunday', meals: { breakfast: '', lunch: '', dinner: '' } },
  ]);

  const [planDays, setPlanDays] = useState(null);
  const [trainingPlan, setTrainingPlan] = useState([]);

  const handleInputChange = (day, mealType, value) => {
    setDietPlan((prevPlan) =>
      prevPlan.map((d) =>
        d.day === day ? { ...d, meals: { ...d.meals, [mealType]: value } } : d
      )
    );
  };

  const handleExerciseChange = (dayIndex, exerciseIndex, field, value) => {
    setTrainingPlan((prevPlan) =>
      prevPlan.map((day, i) =>
        i === dayIndex
          ? {
              ...day,
              exercises: day.exercises.map((exercise, j) =>
                j === exerciseIndex ? { ...exercise, [field]: value } : exercise
              ),
            }
          : day
      )
    );
  };

  const addExercise = (dayIndex) => {
    setTrainingPlan((prevPlan) =>
      prevPlan.map((day, i) =>
        i === dayIndex
          ? {
              ...day,
              exercises: [...day.exercises, { name: '', sets: '', reps: '' }],
            }
          : day
      )
    );
  };

  const removeExercise = (dayIndex, exerciseIndex) => {
    setTrainingPlan((prevPlan) =>
      prevPlan.map((day, i) =>
        i === dayIndex
          ? {
              ...day,
              exercises: day.exercises.filter((_, j) => j !== exerciseIndex),
            }
          : day
      )
    );
  };

  const handlePlanSelection = (days) => {
    setPlanDays(days);
    setTrainingPlan(
      Array.from({ length: days }, (_, i) => ({
        day: `Day ${i + 1}`,
        exercises: [{ name: '', sets: '', reps: '' }],
      }))
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
        {!showDayPlan ? (
          <div className="p-4">
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
              <button
                className="p-4 bg-blue-600 rounded"
                onClick={() => setShowDayPlan(true)}
              >
                Next
              </button>
            </div>
          </div>
        ) : (
          <div className="p-4 flex flex-col min-h-full">
            {planDays && (
              <div
                className="absolute top-4 left-4 cursor-pointer"
                onClick={() => setPlanDays(null)}
              >
                <BiArrowBack size={40} color="white" />
              </div>
            )}

            <h2 className="text-3xl font-bold mb-8 text-center">Day Plan</h2>
            {hoverDashboard && (
              <div
                className="absolute left-0 top-[10%] animate-shake cursor-pointer hover:animate-none transition-transform duration-300"
                onClick={handleClick}
              >
                <BiSolidRightArrow size={80} color="white" />
              </div>
            )}

            {!planDays ? (
              <div className="flex flex-col items-center justify-center h-full">
                <h2 className="text-3xl font-bold mb-8">Choose Your Plan</h2>
                <div className="flex gap-4">
                  <button
                    onClick={() => handlePlanSelection(4)}
                    className="p-4 bg-blue-600 rounded"
                  >
                    4-Day Plan
                  </button>
                  <button
                    onClick={() => handlePlanSelection(7)}
                    className="p-4 bg-blue-600 rounded"
                  >
                    7-Day Plan
                  </button>
                  <button
                    onClick={() => handlePlanSelection(30)}
                    className="p-4 bg-blue-600 rounded"
                  >
                    30-Day Plan
                  </button>
                </div>
              </div>
            ) : (
              <>
                {trainingPlan.map((dayPlan, dayIndex) => (
                  <div key={dayIndex} className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">{dayPlan.day}</h2>
                    {dayPlan.exercises.map((exercise, exerciseIndex) => (
                      <div key={exerciseIndex} className="mb-4 relative">
                        <label className="block mb-2">
                          Exercise {exerciseIndex + 1}
                        </label>
                        <div className="grid grid-cols-3 gap-4">
                          <input
                            type="text"
                            placeholder="Exercise Name"
                            value={exercise.name}
                            onChange={(e) =>
                              handleExerciseChange(
                                dayIndex,
                                exerciseIndex,
                                'name',
                                e.target.value
                              )
                            }
                            className="w-full p-2 rounded bg-gray-800"
                          />
                          <input
                            type="text"
                            placeholder="Sets"
                            value={exercise.sets}
                            onChange={(e) =>
                              handleExerciseChange(
                                dayIndex,
                                exerciseIndex,
                                'sets',
                                e.target.value
                              )
                            }
                            className="w-full p-2 rounded bg-gray-800"
                          />
                          <input
                            type="text"
                            placeholder="Reps"
                            value={exercise.reps}
                            onChange={(e) =>
                              handleExerciseChange(
                                dayIndex,
                                exerciseIndex,
                                'reps',
                                e.target.value
                              )
                            }
                            className="w-full p-2 rounded bg-gray-800"
                          />
                        </div>
                        {exerciseIndex > 0 && (
                          <div
                            className="absolute top-0 right-0 cursor-pointer"
                            onClick={() =>
                              removeExercise(dayIndex, exerciseIndex)
                            }
                          >
                            <BiSolidXCircle size={25} color="red" />
                          </div>
                        )}
                      </div>
                    ))}
                    <button
                      className="p-2 bg-green-600 rounded"
                      onClick={() => addExercise(dayIndex)}
                    >
                      Add Exercise
                    </button>
                  </div>
                ))}
                <div className="flex justify-end">
                  <Link to="/next-route">
                    <button className="p-4 bg-blue-600 rounded">Next</button>
                  </Link>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BothPlan;
