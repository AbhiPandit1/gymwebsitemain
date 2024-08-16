// src/components/DynamicDayPlanComponent.js
import { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Ensure this package is installed
import useDashboardLinks from '../../../../../hook/CreateDahsboardLinks';
import DashboardHeader from '../../../../component/DashboardHeader';
import PlanTable from './PlanTable';
import DashboardComponent from '../../../../component/DashboardComponent'; // Ensure correct import
import { BiSolidRightArrow } from 'react-icons/bi'; // Import the icon if needed

const DynamicDayPlanComponent = () => {
  const dashBoardLink = useDashboardLinks();
  const [hoverDashboard, setHoverDashboard] = useState(false);
  const [headingColor, setHeadingColor] = useState(
    localStorage.getItem('headingColor') || '#000000'
  );
  const [textColor, setTextColor] = useState(
    localStorage.getItem('textColor') || '#0000000'
  );
  const [textSize, setTextSize] = useState(
    localStorage.getItem('textSize') || '18px'
  );
  const [bgColor, setBgColor] = useState(
    localStorage.getItem('bgColor') || '#1a202c'
  );
  const [planType, setPlanType] = useState('four');
  const [planData, setPlanData] = useState([]);

  useEffect(() => {
    localStorage.setItem('headingColor', headingColor);
    localStorage.setItem('textColor', textColor);
    localStorage.setItem('textSize', textSize);
    localStorage.setItem('bgColor', bgColor);
  }, [headingColor, textColor, textSize, bgColor]);

  useEffect(() => {
    setPlanData(getPlanData(planType));
  }, [planType]);

  const handleClick = () => {
    setHoverDashboard((prevState) => !prevState);
  };

  const handleDownload = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.setTextColor(headingColor);
    doc.text('Training Plan', 14, 22);

    let startY = 32;

    planData.forEach((dayPlan) => {
      doc.setFontSize(18);
      doc.setTextColor(headingColor);
      doc.text(dayPlan.day, 14, startY);

      const tableStartY = startY + 10;

      doc.setFontSize(14);
      doc.setTextColor(textColor);
      doc.autoTable({
        startY: tableStartY,
        head: [['Exercise', 'Sets', 'Reps']],
        body: dayPlan.exercises.map((exercise) => [
          exercise.name,
          exercise.sets,
          exercise.reps,
        ]),
        theme: 'striped',
        styles: { fontSize: 12 },
      });

      startY = doc.previousAutoTable.finalY + 20;
    });

    doc.save('training-plan.pdf');
  };

  const handleReset = () => {
    setHeadingColor('#ffffff');
    setTextColor('#ffffff');
    setTextSize('18px');
    setBgColor('#1a202c');
    setPlanType('four');

    localStorage.removeItem('headingColor');
    localStorage.removeItem('textColor');
    localStorage.removeItem('textSize');
    localStorage.removeItem('bgColor');
  };

  const getPlanData = (type) => {
    const fourDayPlan = [
      {
        day: 'Day 1',
        exercises: [
          { name: 'Push-ups', sets: '3', reps: '15' },
          { name: 'Squats', sets: '3', reps: '20' },
        ],
      },
      {
        day: 'Day 2',
        exercises: [
          { name: 'Pull-ups', sets: '3', reps: '10' },
          { name: 'Lunges', sets: '3', reps: '15' },
        ],
      },
      {
        day: 'Day 3',
        exercises: [
          { name: 'Bench Press', sets: '4', reps: '12' },
          { name: 'Deadlift', sets: '4', reps: '10' },
        ],
      },
      {
        day: 'Day 4',
        exercises: [
          { name: 'Plank', sets: '3', reps: '60s' },
          { name: 'Burpees', sets: '3', reps: '15' },
        ],
      },
    ];

    const sevenDayPlan = [
      ...fourDayPlan,
      {
        day: 'Day 5',
        exercises: [
          { name: 'Mountain Climbers', sets: '3', reps: '20' },
          { name: 'Jumping Jacks', sets: '3', reps: '30' },
        ],
      },
      {
        day: 'Day 6',
        exercises: [
          { name: 'Bicep Curls', sets: '3', reps: '15' },
          { name: 'Tricep Dips', sets: '3', reps: '15' },
        ],
      },
      { day: 'Day 7', exercises: [{ name: 'Rest Day', sets: '', reps: '' }] },
    ];

    const thirtyDayPlan = [
      ...sevenDayPlan,
      {
        day: 'Day 8',
        exercises: [
          { name: 'Running', sets: '1', reps: '30m' },
          { name: 'Cycling', sets: '1', reps: '45m' },
        ],
      },
      // Continue adding plans for the remaining days
    ];

    return type === 'four'
      ? fourDayPlan
      : type === 'seven'
      ? sevenDayPlan
      : thirtyDayPlan;
  };

  return (
    <div className="grid grid-cols-7 h-screen max-w-[100vw] bg-primary text-white font-sans">
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
        } sm:${
          hoverDashboard ? 'col-span-7' : 'col-span-5'
        } bg-primary overflow-y-scroll`}
      >
        <DashboardHeader />
        <div className="p-4">
          <h1 className="text-2xl mb-4" style={{ color: headingColor }}>
            Dynamic Day Plan
          </h1>
          <div className="mb-4 flex flex-col space-y-4 gap-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <div className="flex mb-4">
              <label>Heading Color:</label>
              <input
                type="color"
                value={headingColor}
                onChange={(e) => setHeadingColor(e.target.value)}
                className="ml-2 w-16"
              />
            </div>
            <div className="flex mb-4">
              <label>Text Color:</label>
              <input
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="ml-2 w-16"
              />
            </div>
            <div className="flex  mb-4">
              <label className="flex items-center space-x-2">
                <span className="text-lg">Text Size:</span>
                <input
                  type="number"
                  value={parseInt(textSize)}
                  onChange={(e) => setTextSize(`${e.target.value}px`)}
                  className="w-24 p-2 border border-gray-400 rounded bg-gray-100 text-gray-800"
                  placeholder="Enter size"
                />
              </label>
            </div>
          </div>
          <div className="mb-4 flex space-x-4">
            <select
              value={planType}
              onChange={(e) => setPlanType(e.target.value)}
              className="p-2 rounded border border-gray-600 bg-gray-700"
            >
              <option value="four">4-Day Plan</option>
              <option value="seven">7-Day Plan</option>
              <option value="thirty">30-Day Plan</option>
            </select>
            <button
              onClick={handleDownload}
              className="p-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Download PDF
            </button>
            <button
              onClick={handleReset}
              className="p-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Reset Settings
            </button>
          </div>
          <PlanTable
            planData={planData}
            headingColor={headingColor}
            textColor={textColor}
            textSize={textSize}
          />
        </div>
        {hoverDashboard && (
          <div
            className="absolute left-0 top-[10%] animate-shake cursor-pointer hover:animate-none transition-transform duration-300"
            onClick={handleClick}
          >
            <BiSolidRightArrow size={80} color="white" />
          </div>
        )}
        <div className="flex justify-center items-center mb-4">
          {' '}
          <button
            className="mt-4 p-4 w-[8rem] flex justify-center items-center bg-secondary text-white rounded hover:bg-blue-700"
            onClick={() => console.log('Next button clicked')}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default DynamicDayPlanComponent;
