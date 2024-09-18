import React, { useState } from 'react';

// Modal Component
const VideoModal = ({ isOpen, videoUrl, onClose }) => {
  if (!isOpen) return null;

  // Determine if the videoUrl is a YouTube link
  const isYouTube =
    videoUrl &&
    (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be'));

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg relative max-w-4xl w-full">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 px-4 py-2 text-white bg-red-500 hover:bg-red-700 rounded-lg z-10"
          aria-label="Close"
        >
          Close
        </button>
        {isYouTube ? (
          <iframe
            className="w-full h-96 rounded-lg border border-gray-300"
            src={`https://www.youtube.com/embed/${new URL(
              videoUrl
            ).searchParams.get('v')}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Video"
          ></iframe>
        ) : (
          <video
            className="w-full h-auto rounded-lg border border-gray-300"
            controls
            src={videoUrl}
          />
        )}
      </div>
    </div>
  );
};

// PlanTable Component
const PlanTable = ({
  planData = [],
  headingColor = 'indigo-600',
  textColor = 'gray-800',
  textSize = '1rem',
  tableHeadingColor = 'purple-600',
  tableRowColor = 'gray-50',
  tableColumnColor = 'gray-100',
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState('');

  const handleVideoClick = (videoUrl) => {
    setCurrentVideoUrl(videoUrl);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentVideoUrl('');
  };

  const defaultStyles = {
    heading: {
      color: tableHeadingColor || headingColor,
      fontSize: textSize,
      backgroundColor: tableRowColor || 'purple',
      borderColor: tableHeadingColor || headingColor,
    },
    cell: {
      color: textColor,
      fontSize: textSize,
      borderColor: tableHeadingColor || headingColor,
    },
    row: {
      backgroundColor: tableRowColor || 'transparent',
    },
    alternateRow: {
      backgroundColor: tableColumnColor || 'transparent',
    },
  };

  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-lg overflow-x-auto scrollbar-hide">
      <h3
        className="text-xl font-semibold mb-4 text-center"
        style={{ color: headingColor }}
      >
        {planData.length > 0
          ? planData[0].planTitle || 'Training Plan'
          : 'No Plan Available'}
      </h3>
      {planData.length > 0 ? (
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              {['Day', 'Exercise', 'Sets', 'Reps', 'Videos'].map((heading) => (
                <th
                  key={heading}
                  scope="col"
                  className="border-b-2 py-2"
                  style={defaultStyles.heading}
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {planData.map((dayPlan, dayIndex) =>
              dayPlan.exercises.map((exercise, exerciseIndex) => (
                <tr
                  key={`${dayIndex}-${exerciseIndex}`}
                  style={{
                    backgroundColor:
                      exerciseIndex % 2 === 0
                        ? defaultStyles.row.backgroundColor
                        : defaultStyles.alternateRow.backgroundColor,
                  }}
                >
                  {exerciseIndex === 0 && (
                    <td
                      rowSpan={dayPlan.exercises.length}
                      className="border-b py-2"
                      style={defaultStyles.cell}
                    >
                      <div className="font-semibold">{dayPlan.day}</div>
                    </td>
                  )}
                  <td className="border-b py-2" style={defaultStyles.cell}>
                    <div className="font-medium">{exercise.name}</div>
                  </td>
                  <td className="border-b py-2" style={defaultStyles.cell}>
                    {exercise.sets}
                  </td>
                  <td className="border-b py-2" style={defaultStyles.cell}>
                    {exercise.reps}
                  </td>
                  <td className="border-b py-2" style={defaultStyles.cell}>
                    {exercise.videoUrl ? (
                      <button
                        onClick={() => handleVideoClick(exercise.videoUrl)}
                        className="text-blue-400 hover:underline"
                        aria-label="Watch video"
                      >
                        Watch Video
                      </button>
                    ) : (
                      'No Video'
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      ) : (
        <p className="text-center text-gray-400">No plans available.</p>
      )}
      <VideoModal
        isOpen={isModalOpen}
        videoUrl={currentVideoUrl}
        onClose={closeModal}
      />
    </div>
  );
};

export default PlanTable;
