import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useDashboardLinks from '../../../../../hook/CreateDahsboardLinks';
import DashboardComponent from '../../../../component/DashboardComponent';
import DashboardHeader from '../../../../component/DashboardHeader';
import { BiSolidRightArrow, BiArrowBack } from 'react-icons/bi';
import ReactPlayer from 'react-player';
import Modal from 'react-modal';
import { useSelector } from 'react-redux';
import usePostDayPlan from '../../../../../hook/usePostDayPlan';
import { toast } from 'react-toastify';
import { ImCross } from 'react-icons/im';

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
    const savedPlan = JSON.parse(localStorage.getItem('trainingPlan'));
    if (savedPlan) {
      setTrainingPlan(savedPlan);
      setNumDays(savedPlan.length);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('trainingPlan', JSON.stringify(trainingPlan));
  }, [trainingPlan]);

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

  const removeDay = (dayIndex) => {
    setTrainingPlan((prevPlan) => prevPlan.filter((_, i) => i !== dayIndex));
  };

  const handleBack = () => {
    navigate(`/trainer/programmes/${user.user._id}`);
  };

  const handleDaysChange = (e) => {
    const newDays = parseInt(e.target.value, 10);
    setNumDays(newDays > 0 ? newDays : 1);
  };

  const addDays = () => {
    const newDaysArray = Array.from({ length: numDays }, (_, i) => ({
      day: `Day ${trainingPlan.length + i + 1}`,
      exercises: [],
    }));

    setTrainingPlan((prevPlan) => [...prevPlan, ...newDaysArray]);
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
      const response = await postDayPlan(programmeId, trainingPlan);
      console.log(response);
      navigate(`/user/dashboard/${user.user._id}`);
    } catch (err) {
      toast.error('Failed to submit day plan.');
    }
  };

  return (
    <div
      className="grid grid-cols-9 max-w-[100vw] text-white font-sans"
      style={{
        background: 'linear-gradient(180deg, #050c1e 0%, #050c1e 100%)',
      }}
    >
      <div className="col-span-9 sticky top-0 z-50">
        <DashboardHeader />
      </div>

      <div className="min-h-screen min-w-[100vw]">
        {trainingPlan.length > 0 && (
          <div
            className="absolute top-4 left-4 cursor-pointer z-10"
            onClick={handleBack}
          >
            <BiArrowBack className="text-white" size={30} />
          </div>
        )}

        <h2 className="text-3xl font-bold mb-8 text-center">Day Plan</h2>

        {trainingPlan.length === 0 ? (
          <div className="flex flex-col justify-center items-center text-2xl font-semibold mt-16">
            No plan available. Please set the number of days in ProgrammeKind.
          </div>
        ) : (
          <div className="p-4 overflow-scroll">
            {trainingPlan.map((day, dayIndex) => (
              <div
                key={dayIndex}
                className="mb-8 border p-4 rounded-lg bg-gray-800"
              >
                <h3 className="text-2xl font-bold mb-4 flex justify-between items-center">
                  {day.day}
                  <button
                    onClick={() => removeDay(dayIndex)}
                    className="text-red-500"
                  >
                    <ImCross size={20} />
                  </button>
                </h3>
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
                      className="border p-3 rounded w-full bg-tertiary text-white mb-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
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
                      className="border p-3 rounded w-full bg-tertiary text-white mb-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
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
                      className="border p-3 rounded w-full bg-tertiary text-white mb-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
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
                            className="border p-3 rounded w-full bg-tertiary text-white mb-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
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
                            className="border p-3 rounded w-full bg-tertiary text-white mb-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                          />
                          <button
                            onClick={() =>
                              openModal(exercise.video, exercise.videoName)
                            }
                            className="bg-blue-500 text-white rounded px-4 py-2"
                          >
                            Preview Video
                          </button>
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
        <div className="flex flex-col items-center mb-8">
          <input
            type="number"
            value={numDays}
            onChange={handleDaysChange}
            className="border p-2 rounded w-1/4 bg-gray-700 text-white mb-4"
          />
          <button
            onClick={addDays}
            className="bg-blue-500 text-white rounded px-4 py-2 mb-2"
          >
            Add Days
          </button>
        </div>

        <div className="flex justify-center items-center mb-5">
          <button
            onClick={handleSubmit}
            className="bg-green-500 text-white rounded px-4 py-2 mt-4"
          >
            Submit Plan
          </button>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#1a202c', // Optional: Dark background for modal
            borderRadius: '10px',
            padding: '20px',
            width: '80%',
            maxWidth: '600px',
            height: '60%',
            minHeight: '50vh',
          },
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
          },
        }}
      >
        <div className="relative">
          <button
            onClick={closeModal}
            className="absolute top-2 right-2 text-white focus:outline-none"
          >
            <ImCross size={20} />
          </button>

          <h2 className="text-2xl font-bold text-center text-white mb-4">
            {currentVideoName}
          </h2>

          <ReactPlayer
            url={currentVideoUrl}
            controls
            width="100%"
            height="50vh"
            className="rounded-lg"
          />
        </div>
      </Modal>
    </div>
  );
};

export default DayPlan;
