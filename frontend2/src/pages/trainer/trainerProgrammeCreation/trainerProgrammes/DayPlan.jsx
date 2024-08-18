import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useDashboardLinks from '../../../../../hook/CreateDahsboardLinks';
import DashboardComponent from '../../../../component/DashboardComponent';
import DashboardHeader from '../../../../component/DashboardHeader';
import { BiSolidRightArrow, BiArrowBack } from 'react-icons/bi';
import ReactPlayer from 'react-player';
import Modal from 'react-modal';
import { useDropzone } from 'react-dropzone';

const DayPlan = () => {
  const { days } = useParams();
  const navigate = useNavigate();
  const dashBoardLink = useDashboardLinks();
  const [hoverDashboard, setHoverDashboard] = useState(false);
  const [trainingPlan, setTrainingPlan] = useState([]);
  const [numDays, setNumDays] = useState(days ? parseInt(days, 10) : 1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState('');
  const [currentVideoName, setCurrentVideoName] = useState('');
  const [videoInputRefs, setVideoInputRefs] = useState({});
  const [uploadOption, setUploadOption] = useState('upload'); // 'upload' or 'link'
  const [videoLink, setVideoLink] = useState('');

  useEffect(() => {
    if (numDays > 0) {
      setTrainingPlan(
        Array.from({ length: numDays }, (_, i) => ({
          day: `Day ${i + 1}`,
          exercises: [
            { name: '', sets: '', reps: '', video: '', videoName: '' },
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
                { name: '', sets: '', reps: '', video: '', videoName: '' },
              ],
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
    setNumDays(newDays > 0 ? newDays : 1);
  };

  const onDrop = (acceptedFiles, dayIndex, exerciseIndex) => {
    const file = acceptedFiles[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      handleExerciseChange(dayIndex, exerciseIndex, 'video', fileUrl);
      handleExerciseChange(dayIndex, exerciseIndex, 'videoName', file.name);
    }
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

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      // Handle drop for all files at once (you can customize this)
      const file = acceptedFiles[0];
      if (file) {
        // Update video info for the first selected exercise (customize if needed)
        const dayIndex = 0;
        const exerciseIndex = 0;
        const fileUrl = URL.createObjectURL(file);
        handleExerciseChange(dayIndex, exerciseIndex, 'video', fileUrl);
        handleExerciseChange(dayIndex, exerciseIndex, 'videoName', file.name);
      }
    },
    accept: 'video/*',
    multiple: false,
  });

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

                    <div className="p-4">
                      <label className="block text-lg mb-2 font-semibold">
                        Video Option:
                      </label>
                      <select
                        value={uploadOption}
                        onChange={(e) => setUploadOption(e.target.value)}
                        className="border p-3 rounded w-full bg-white text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="upload">Upload Video</option>
                        <option value="link">Video Link</option>
                      </select>
                      {uploadOption === 'upload' ? (
                        <div
                          {...getRootProps()}
                          className="border p-3 rounded mt-4 bg-gray-700 cursor-pointer hover:bg-gray-600"
                        >
                          <input {...getInputProps()} />
                          <p className="text-center">
                            Drag & drop a video here, or click to select one
                          </p>
                        </div>
                      ) : (
                        <input
                          type="text"
                          value={videoLink}
                          onChange={(e) => setVideoLink(e.target.value)}
                          placeholder="Enter Video Link"
                          className="border p-3 rounded mt-4 w-full bg-white text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      )}
                      <button
                        onClick={() =>
                          openModal(exercise.video, exercise.videoName)
                        }
                        className="mt-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-400"
                      >
                        View Video
                      </button>
                    </div>

                    {exercise.video && (
                      <div className="relative mt-4">
                        <ReactPlayer
                          url={exercise.video}
                          controls
                          width="100%"
                          height="auto"
                        />
                      </div>
                    )}
                    <button
                      onClick={() => removeExercise(dayIndex, exerciseIndex)}
                      className="bg-red-500 text-white py-2 px-4 rounded mt-4 hover:bg-red-400"
                    >
                      Remove Exercise
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addExercise(dayIndex)}
                  className="bg-blue-500 text-white py-2 px-4 rounded mt-4 hover:bg-blue-400"
                >
                  Add Exercise
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Video Modal"
        className="modal"
        overlayClassName="overlay"
      >
        <h2 className="text-xl font-bold mb-4">{currentVideoName}</h2>
        <div className="flex justify-center items-center">
          <ReactPlayer
            url={currentVideoUrl}
            controls
            width="80%"
            height="auto"
          />
        </div>
        <button
          onClick={closeModal}
          className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-400"
        >
          Close
        </button>
      </Modal>

      <style jsx>{`
        .modal {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: #333;
          padding: 20px;
          border-radius: 10px;
          width: 80%;
          max-width: 900px;
          color: white;
        }
        .overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.75);
        }
      `}</style>
    </div>
  );
};

export default DayPlan;
