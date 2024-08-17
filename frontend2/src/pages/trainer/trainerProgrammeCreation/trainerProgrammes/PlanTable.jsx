import React from 'react';

const PlanTable = ({
  planData,
  headingColor,
  textColor,
  textSize,
  tableHeadingColor,
  tableRowColor,
  tableColumnColor,
}) => {
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
                className="border-b-2 py-2"
                style={{
                  color: tableHeadingColor || headingColor,
                  fontSize: textSize,
                  backgroundColor: tableRowColor || 'transparent',
                  borderColor: tableHeadingColor || headingColor,
                }}
              >
                Day
              </th>
              <th
                scope="col"
                className="border-b-2 py-2"
                style={{
                  color: tableHeadingColor || headingColor,
                  fontSize: textSize,
                  backgroundColor: tableRowColor || 'transparent',
                  borderColor: tableHeadingColor || headingColor,
                }}
              >
                Exercise
              </th>
              <th
                scope="col"
                className="border-b-2 py-2"
                style={{
                  color: tableHeadingColor || headingColor,
                  fontSize: textSize,
                  backgroundColor: tableRowColor || 'transparent',
                  borderColor: tableHeadingColor || headingColor,
                }}
              >
                Sets
              </th>
              <th
                scope="col"
                className="border-b-2 py-2"
                style={{
                  color: tableHeadingColor || headingColor,
                  fontSize: textSize,
                  backgroundColor: tableRowColor || 'transparent',
                  borderColor: tableHeadingColor || headingColor,
                }}
              >
                Reps
              </th>
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
                        ? tableRowColor || 'transparent'
                        : tableColumnColor || 'transparent',
                  }}
                >
                  {exerciseIndex === 0 && (
                    <td
                      rowSpan={dayPlan.exercises.length}
                      className="border-b py-2"
                      style={{
                        color: textColor,
                        fontSize: textSize,
                        borderColor: tableHeadingColor || headingColor,
                      }}
                    >
                      <div className="font-semibold">{dayPlan.day}</div>
                    </td>
                  )}
                  <td
                    className="border-b py-2"
                    style={{
                      color: textColor,
                      fontSize: textSize,
                      borderColor: tableHeadingColor || headingColor,
                    }}
                  >
                    <div className="font-medium">{exercise.name}</div>
                  </td>
                  <td
                    className="border-b py-2"
                    style={{
                      color: textColor,
                      fontSize: textSize,
                      borderColor: tableHeadingColor || headingColor,
                    }}
                  >
                    {exercise.sets}
                  </td>
                  <td
                    className="border-b py-2"
                    style={{
                      color: textColor,
                      fontSize: textSize,
                      borderColor: tableHeadingColor || headingColor,
                    }}
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
