import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useDashboardLinks from '../../../../../hook/CreateDahsboardLinks';
import DashboardComponent from '../../../../component/DashboardComponent';
import DashboardHeader from '../../../../component/DashboardHeader';
import { BiSolidRightArrow, BiArrowBack } from 'react-icons/bi';

const DayPlan = () => {
  const { days } = useParams();
  const navigate = useNavigate();
  const dashBoardLink = useDashboardLinks();
  const [hoverDashboard, setHoverDashboard] = useState(false);
  const [trainingPlan, setTrainingPlan] = useState([]);
  const [numDays, setNumDays] = useState(days ? parseInt(days, 10) : 1); // Default to 1 if no `days` provided

  useEffect(() => {
    if (numDays > 0) {
      // Ensure numDays is positive
      setTrainingPlan(
        Array.from({ length: numDays }, (_, i) => ({
          day: `Day ${i + 1}`,
          exercises: [{ name: '', sets: '', reps: '' }],
        }))
      );
    }
  }, [numDays]);

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

  const handleBack = () => {
    navigate('/trainer/create/programme/customizeDays');
  };

  const handleDaysChange = (e) => {
    const newDays = parseInt(e.target.value, 10);
    setNumDays(newDays > 0 ? newDays : 1); // Default to 1 if newDays is less than or equal to 0
  };

  return (
    <div className="grid grid-cols-7 h-screen max-w-[100vw] text-white font-sans relative">
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

        {trainingPlan.length > 0 && (
          <div
            className="absolute top-4 left-4 cursor-pointer z-10"
            onClick={handleBack}
          >
            <BiArrowBack size={40} color="white" />
          </div>
        )}

        <h2 className="text-3xl font-bold mb-8 text-center">Day Plan</h2>

        {hoverDashboard && (
          <div
            className="absolute left-0 top-[10%] animate-shake cursor-pointer hover:animate-none transition-transform duration-300 z-10"
            onClick={handleClick}
          >
            <BiSolidRightArrow size={80} color="white" />
          </div>
        )}

        <div className="p-4 mb-6">
          <label className="block text-lg mb-2 font-semibold">
            Number of Days:
          </label>
          <input
            type="number"
            value={numDays}
            onChange={handleDaysChange}
            className="border p-3 rounded w-full bg-white text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            min="1"
          />
        </div>

        {trainingPlan.length === 0 ? (
          <div className="flex flex-col justify-center items-center text-2xl font-semibold mt-16">
            No plan available. Please set the number of days in ProgrammeKind.
          </div>
        ) : (
          <div className="p-4">
            {trainingPlan.map((day, dayIndex) => (
              <div
                key={dayIndex}
                className="mb-8 border p-4 rounded-lg bg-gray-800"
              >
                <h3 className="text-2xl font-bold mb-4">{day.day}</h3>
                {day.exercises.map((exercise, exerciseIndex) => (
                  <div key={exerciseIndex} className="mb-4">
                    <input
                      type="text"
                      value={exercise.name}
                      onChange={(e) =>
                        handleExerciseChange(
                          dayIndex,
                          exerciseIndex,
                          'name',
                          e.target.value
                        )
                      }
                      placeholder="Exercise Name"
                      className="border p-3 rounded w-full bg-white text-black mb-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <input
                      type="text"
                      value={exercise.sets}
                      onChange={(e) =>
                        handleExerciseChange(
                          dayIndex,
                          exerciseIndex,
                          'sets',
                          e.target.value
                        )
                      }
                      placeholder="Sets"
                      className="border p-3 rounded w-full bg-white text-black mb-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <input
                      type="text"
                      value={exercise.reps}
                      onChange={(e) =>
                        handleExerciseChange(
                          dayIndex,
                          exerciseIndex,
                          'reps',
                          e.target.value
                        )
                      }
                      placeholder="Reps"
                      className="border p-3 rounded w-full bg-white text-black mb-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <button
                      onClick={() => removeExercise(dayIndex, exerciseIndex)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                    >
                      Remove Exercise
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addExercise(dayIndex)}
                  className="bg-green-600 text-white p-3 rounded shadow-md hover:bg-green-700 transition-colors"
                >
                  Add Exercise
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DayPlan;
