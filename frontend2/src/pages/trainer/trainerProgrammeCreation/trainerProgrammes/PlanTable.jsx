import React from 'react';

const PlanTable = ({ planData, headingColor, textColor, textSize }) => {
  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-lg overflow-x-auto">
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
              <th
                scope="col"
                className="border-b-2 border-gray-600 py-2"
                style={{ color: headingColor, fontSize: textSize }}
              >
                Day
              </th>
              <th
                scope="col"
                className="border-b-2 border-gray-600 py-2"
                style={{ color: headingColor, fontSize: textSize }}
              >
                Exercise
              </th>
              <th
                scope="col"
                className="border-b-2 border-gray-600 py-2"
                style={{ color: headingColor, fontSize: textSize }}
              >
                Sets
              </th>
              <th
                scope="col"
                className="border-b-2 border-gray-600 py-2"
                style={{ color: headingColor, fontSize: textSize }}
              >
                Reps
              </th>
            </tr>
          </thead>
          <tbody>
            {planData.map((dayPlan, dayIndex) =>
              dayPlan.exercises.map((exercise, exerciseIndex) => (
                <tr key={`${dayIndex}-${exerciseIndex}`}>
                  {exerciseIndex === 0 && (
                    <td
                      rowSpan={dayPlan.exercises.length}
                      className="border-b border-gray-600 py-2"
                      style={{ color: textColor, fontSize: textSize }}
                    >
                      <div className="font-semibold">{dayPlan.day}</div>
                    </td>
                  )}
                  <td
                    className="border-b border-gray-600 py-2"
                    style={{ color: textColor, fontSize: textSize }}
                  >
                    <div className="font-medium">{exercise.name}</div>
                  </td>
                  <td
                    className="border-b border-gray-600 py-2"
                    style={{ color: textColor, fontSize: textSize }}
                  >
                    {exercise.sets}
                  </td>
                  <td
                    className="border-b border-gray-600 py-2"
                    style={{ color: textColor, fontSize: textSize }}
                  >
                    {exercise.reps}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      ) : (
        <p className="text-center text-gray-400">No data available</p>
      )}
    </div>
  );
};

export default PlanTable;
