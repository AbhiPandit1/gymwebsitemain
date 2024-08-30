import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useDashboardLinks from '../../../../../hook/CreateDahsboardLinks';
import DashboardComponent from '../../../../component/DashboardComponent';
import DashboardHeader from '../../../../component/DashboardHeader';
import { BiSolidRightArrow, BiArrowBack, BiCross } from 'react-icons/bi';
import ReactPlayer from 'react-player';
import Modal from 'react-modal';
import { useSelector } from 'react-redux';
import usePostDayPlan from '../../../../../hook/usePostDayPlan';
import { toast } from 'react-toastify';

const DayPlan = () => {
  const { programmeId } = useParams();
  const navigate = useNavigate();
  const dashBoardLink = useDashboardLinks();
  const [hoverDashboard, setHoverDashboard] = useState(false);
  const [trainingPlan, setTrainingPlan] = useState([]);
  const [numDays, setNumDays] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState('');
  const [currentVideoName, setCurrentVideoName] = useState('');

  const { user } = useSelector((state) => state.user);
  const { loading, error, success, postDayPlan } = usePostDayPlan();

  useEffect(() => {
    if (numDays > 0) {
      setTrainingPlan(
        Array.from({ length: numDays }, (_, i) => ({
          day: `Day ${i + 1}`,
          exercises: [
            {
              name: '',
              sets: '',
              reps: '',
              video: '',
              videoName: '',
              showVideo: true,
            },
          ],
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
              exercises: [
                ...day.exercises,
                {
                  name: '',
                  sets: '',
                  reps: '',
                  video: '',
                  videoName: '',
                  showVideo: true,
                },
              ],
            }
          : day
      )
    );
  };

  const toggleShowVideo = (dayIndex, exerciseIndex) => {
    setTrainingPlan((prevPlan) =>
      prevPlan.map((day, i) =>
        i === dayIndex
          ? {
              ...day,
              exercises: day.exercises.map((exercise, j) =>
                j === exerciseIndex
                  ? { ...exercise, showVideo: !exercise.showVideo }
                  : exercise
              ),
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
    navigate(`/trainer/create/programme/${user.user._id}`);
  };
  const backendapi = import.meta.env.VITE_BACKEND_URL;

  const handleDaysChange = (e) => {
    const newDays = parseInt(e.target.value, 10);
    setNumDays(newDays > 0 ? newDays : 1);
  };

  const openModal = (videoUrl, videoName) => {
    setCurrentVideoUrl(videoUrl);
    setCurrentVideoName(videoName);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentVideoUrl('');
    setCurrentVideoName('');
  };

  const handleRemoveVideo = (dayIndex, exerciseIndex) => {
    handleExerciseChange(dayIndex, exerciseIndex, 'video', '');
    handleExerciseChange(dayIndex, exerciseIndex, 'videoName', '');
  };

  const handleSubmit = async () => {
    try {
      await postDayPlan(programmeId, trainingPlan);
      navigate(
        `${backendapi}/trainer/programme/day/plan/${user.user._id}/${programmeId}`
      );
    } catch (err) {
      // Handle error (e.g., show an error message)
      toast.error('Failed to submit day plan.');
    }
  };

  return (
    <div className="grid grid-cols-9 h-screen max-w-[100vw]  text-white font-sans bg-gray-900">
      <div
        className={`transition-transform duration-300 bg-gray-900   ${
          hoverDashboard ? 'hidden sm:hidden' : 'col-span-3 sm:col-span-1'
        }`}
        onClick={handleClick}
      >
        <DashboardComponent
          dashBoardLink={dashBoardLink} // Fixed variable name
          hoverDashboard={hoverDashboard}
          setHoverDashboard={setHoverDashboard}
        />
      </div>
      <div
        className={`transition-transform duration-300 ${
          hoverDashboard
            ? 'col-span-9 sm:col-span-9'
            : 'col-span-6 sm:col-span-8'
        } overflow-scroll`}
      >
        <DashboardHeader />
        {hoverDashboard && (
          <div className="absolute left-0 z-10 top-[10%] animate-shake cursor-pointer hover:animate-none transition-transform duration-300">
            <BiSolidRightArrow size={40} color="orange" onClick={handleClick} />
          </div>
        )}
        {trainingPlan.length > 0 && (
          <div
            className="absolute top-4 left-4 cursor-pointer z-10"
            onClick={handleBack}
          ></div>
        )}

        <h2 className="text-3xl font-bold mb-8 text-center">Day Plan</h2>

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

                    <div className="p-4">
                      <button
                        onClick={() => toggleShowVideo(dayIndex, exerciseIndex)}
                        className="bg-blue-500 text-white rounded px-4 py-2 mb-2"
                      >
                        {exercise.showVideo ? 'Remove Video' : 'Show Video'}
                      </button>
                      {exercise.showVideo && (
                        <>
                          <input
                            type="text"
                            value={exercise.videoName}
                            onChange={(e) =>
                              handleExerciseChange(
                                dayIndex,
                                exerciseIndex,
                                'videoName',
                                e.target.value
                              )
                            }
                            placeholder="Video Name"
                            className="border p-3 rounded w-full bg-white text-black mb-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                          />
                          <input
                            type="text"
                            value={exercise.video}
                            onChange={(e) =>
                              handleExerciseChange(
                                dayIndex,
                                exerciseIndex,
                                'video',
                                e.target.value
                              )
                            }
                            placeholder="Video URL"
                            className="border p-3 rounded w-full bg-white text-black mb-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                          />
                          {exercise.video && (
                            <button
                              onClick={() =>
                                openModal(exercise.video, exercise.videoName)
                              }
                              className="bg-blue-500 text-white rounded px-4 py-2"
                            >
                              Play Video
                            </button>
                          )}
                        </>
                      )}
                      <button
                        onClick={() => removeExercise(dayIndex, exerciseIndex)}
                        className="bg-red-500 text-white rounded px-4 py-2 mt-2"
                      >
                        Remove Exercise
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => addExercise(dayIndex)}
                  className="bg-green-500 text-white rounded px-4 py-2"
                >
                  Add Exercise
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={handleSubmit}
          className="bg-green-500 text-white rounded px-4 py-2 mt-8 mb-4"
        >
          Submit Day Plan
        </button>

        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          contentLabel="Video Modal"
          className="fixed inset-0 bg-black text-white p-4 rounded-lg mx-auto max-w-4xl w-full max-h-full flex items-center justify-center"
          overlayClassName="fixed inset-0 bg-black bg-opacity-75"
        >
          <button
            onClick={closeModal}
            className="absolute top-2 right-2 text-2xl text-white"
          >
            <BiCross />
          </button>
          <h2 className="text-3xl mb-4">{currentVideoName}</h2>
          <ReactPlayer
            url={currentVideoUrl}
            controls
            width="100%"
            height="auto"
          />
        </Modal>
      </div>
    </div>
  );
};

export default DayPlan;
