import React, { useState } from 'react';

const ProgrammeDetailUser = () => {
  // Sample data for programs (you can replace this with real data from props or state)
  const programmes = [
    { id: 1, name: 'Yoga Basics', date: '2024-08-01', cost: 50 },
    { id: 2, name: 'Advanced Cardio', date: '2024-08-05', cost: 75 },
    { id: 3, name: 'Strength Training', date: '2024-08-10', cost: 60 },
    { id: 4, name: 'Pilates Core', date: '2024-08-12', cost: 45 },
    { id: 5, name: 'HIIT Workout', date: '2024-08-15', cost: 85 },
    { id: 6, name: 'Flexibility Routine', date: '2024-08-18', cost: 30 },
    { id: 7, name: 'Meditation Basics', date: '2024-08-20', cost: 40 },
    { id: 8, name: 'Running 101', date: '2024-08-22', cost: 55 },
    { id: 9, name: 'Cycling Endurance', date: '2024-08-24', cost: 70 },
    { id: 10, name: 'Boxing Fundamentals', date: '2024-08-26', cost: 90 },
  ];

  // State to show total expenditure
  const [showTotalSpent, setShowTotalSpent] = useState(false);

  // Calculate total spent
  const totalSpent = programmes.reduce(
    (acc, programme) => acc + programme.cost,
    0
  );

  const handleShowTotalSpent = () => {
    setShowTotalSpent((prev) => !prev);
  };

  return (
    <div className="w-[95%] sm:w-[80%] h-full sm:h-[50%] bg-gradient-to-r from-red-600 to-red-400 rounded-lg m-auto border shadow-lg font-outfit shadow-red-300 p-2 flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold text-white">Programme Details</h2>

      {/* Container for scrolling content */}
      <div className="w-full h-72 overflow-y-scroll scrollbar-thin scrollbar-thumb-red-700 scrollbar-track-red-300">
        <ul className="divide-y divide-red-300">
          {programmes.map((programme) => (
            <li
              key={programme.id}
              className="py-4 px-4 text-white flex justify-between"
            >
              <span>{programme.name}</span>
              <span className="text-sm">{programme.date}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Button to show total spent */}
      <button
        className="mt-4 bg-white text-red-700 py-2 px-4 rounded-lg shadow-md hover:bg-red-500 hover:text-white transition duration-300"
        onClick={handleShowTotalSpent}
      >
        {showTotalSpent ? 'Hide Total Spent' : 'Show Total Spent'}
      </button>

      {/* Display total spent if button is clicked */}
      {showTotalSpent && (
        <div className="mt-4 text-white text-lg font-semibold">
          Total Spent: ${totalSpent}
        </div>
      )}
    </div>
  );
};

export default ProgrammeDetailUser;
