import { useState } from 'react';
import { Link } from 'react-router-dom';
import useDashboardLinks from '../../../../../hook/CreateDahsboardLinks';
import DashboardComponent from '../../../../component/DashboardComponent';
import DashboardHeader from '../../../../component/DashboardHeader';
import { BiSolidRightArrow, BiSolidXCircle, BiArrowBack } from 'react-icons/bi';

const DayPlan = () => {
  const dashBoardLink = useDashboardLinks();
  const [hoverDashboard, setHoverDashboard] = useState(false);
  const [planDays, setPlanDays] = useState(null);
  const [trainingPlan, setTrainingPlan] = useState([]);

  const handlePlanSelection = (days) => {
    setPlanDays(days);
    setTrainingPlan(
      Array.from({ length: days }, (_, i) => ({
        day: `Day ${i + 1}`,
        exercises: [{ name: '', sets: '', reps: '' }],
      }))
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
        } sm:${hoverDashboard ? 'col-span-7' : 'col-span-5'} overflow-y-auto`}
      >
        <DashboardHeader />

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
          <div className="p-4 flex flex-col min-h-full">
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
                    <button
                      onClick={() => removeExercise(dayIndex, exerciseIndex)}
                      className="absolute top-0 right-0 mt-2 mr-2"
                    >
                      <BiSolidXCircle size={24} color="red" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addExercise(dayIndex)}
                  className="mt-2 p-2 bg-blue-600 rounded"
                >
                  Add Exercise
                </button>
              </div>
            ))}
            <div className="mt-auto text-center">
              <Link
                to="/nextPage" // Update this path as per your routing
                className="p-4 bg-green-600 rounded"
              >
                Next
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DayPlan;
