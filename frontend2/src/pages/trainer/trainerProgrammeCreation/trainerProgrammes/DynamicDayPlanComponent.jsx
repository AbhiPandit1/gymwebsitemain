import { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import useDashboardLinks from '../../../../../hook/CreateDahsboardLinks';
import DashboardHeader from '../../../../component/DashboardHeader';
import PlanTable from './PlanTable';
import DashboardComponent from '../../../../component/DashboardComponent';
import { BiSolidRightArrow } from 'react-icons/bi';
import { FaArrowRight } from 'react-icons/fa';

const DynamicDayPlanComponent = () => {
  const dashBoardLink = useDashboardLinks();
  const [hoverDashboard, setHoverDashboard] = useState(false);
  const [headingColor, setHeadingColor] = useState(
    localStorage.getItem('headingColor') || '#000000'
  );
  const [textColor, setTextColor] = useState(
    localStorage.getItem('textColor') || '#000000'
  );
  const [textSize, setTextSize] = useState(
    localStorage.getItem('textSize') || '18px'
  );
  const [bgColor, setBgColor] = useState(
    localStorage.getItem('bgColor') || '#000000'
  );

  // New state variables for table styling
  const [tableHeadingColor, setTableHeadingColor] = useState(
    localStorage.getItem('tableHeadingColor') || '#FFFFFF'
  );
  const [tableRowColor, setTableRowColor] = useState(
    localStorage.getItem('tableRowColor') || '#000000'
  );
  const [tableColumnColor, setTableColumnColor] = useState(
    localStorage.getItem('tableColumnColor') || '#000000'
  );

  const [planType, setPlanType] = useState('four');
  const [planData, setPlanData] = useState([]);

  useEffect(() => {
    localStorage.setItem('headingColor', headingColor);
    localStorage.setItem('textColor', textColor);
    localStorage.setItem('textSize', textSize);
    localStorage.setItem('bgColor', bgColor);
    localStorage.setItem('tableHeadingColor', tableHeadingColor);
    localStorage.setItem('tableRowColor', tableRowColor);
    localStorage.setItem('tableColumnColor', tableColumnColor);
  }, [
    headingColor,
    textColor,
    textSize,
    bgColor,
    tableHeadingColor,
    tableRowColor,
    tableColumnColor,
  ]);

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
      doc.setTextColor(tableHeadingColor);
      doc.autoTable({
        startY: tableStartY,
        head: [['Exercise', 'Sets', 'Reps']],
        body: dayPlan.exercises.map((exercise) => [
          { content: exercise.name, styles: { textColor: tableColumnColor } },
          { content: exercise.sets, styles: { textColor: tableRowColor } },
          { content: exercise.reps, styles: { textColor: tableRowColor } },
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
    setTableHeadingColor('#000000');
    setTableRowColor('#000000');
    setTableColumnColor('#000000');
    setPlanType('four');

    localStorage.removeItem('headingColor');
    localStorage.removeItem('textColor');
    localStorage.removeItem('textSize');
    localStorage.removeItem('bgColor');
    localStorage.removeItem('tableHeadingColor');
    localStorage.removeItem('tableRowColor');
    localStorage.removeItem('tableColumnColor');
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
          { name: 'Lunges', sets: '3', reps: '15' },
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
            <div className="flex  mb-4">
              <label className="flex items-center space-x-2">
                <span className="text-lg">Background Color:</span>
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="ml-2 w-16"
                />
              </label>
            </div>
            <div className="flex  mb-4">
              <label className="flex items-center space-x-2">
                <span className="text-lg">Table Heading Color:</span>
                <input
                  type="color"
                  value={tableHeadingColor}
                  onChange={(e) => setTableHeadingColor(e.target.value)}
                  className="ml-2 w-16"
                />
              </label>
            </div>
            <div className="flex  mb-4">
              <label className="flex items-center space-x-2">
                <span className="text-lg">Table Row Color:</span>
                <input
                  type="color"
                  value={tableRowColor}
                  onChange={(e) => setTableRowColor(e.target.value)}
                  className="ml-2 w-16"
                />
              </label>
            </div>
            <div className="flex  mb-4">
              <label className="flex items-center space-x-2">
                <span className="text-lg">Table Column Color:</span>
                <input
                  type="color"
                  value={tableColumnColor}
                  onChange={(e) => setTableColumnColor(e.target.value)}
                  className="ml-2 w-16"
                />
              </label>
            </div>
          </div>
          <div className="mb-4 flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <div>
              <label className="flex items-center space-x-2">
                <span className="text-lg">Plan Type:</span>
                <select
                  value={planType}
                  onChange={(e) => setPlanType(e.target.value)}
                  className="ml-2 p-2"
                >
                  <option value="four">4-Day Plan</option>
                  <option value="seven">7-Day Plan</option>
                  <option value="thirty">30-Day Plan</option>
                </select>
              </label>
            </div>
            <button
              onClick={handleDownload}
              className="bg-green-600 p-2 text-white rounded-lg"
            >
              Download PDF
            </button>
            <button
              onClick={handleReset}
              className="bg-red-600 p-2 text-white rounded-lg"
            >
              Reset
            </button>
            <button
              onClick={() =>
                setPlanType(planType === 'four' ? 'seven' : 'four')
              }
              className="bg-blue-600 p-2 text-white rounded-lg"
            >
              Toggle Plan
            </button>
          </div>
          <div className="overflow-x-auto">
            <PlanTable
              planData={planData}
              textColor={textColor}
              textSize={textSize}
              headingColor={headingColor}
              tableHeadingColor={tableHeadingColor}
              tableRowColor={tableRowColor}
              tableColumnColor={tableColumnColor}
            />
          </div>
        </div>
      </div>
      <div className="absolute bottom-4 right-4">
        <button
          className="bg-primary text-white p-2 rounded-full"
          onClick={() => setHoverDashboard(!hoverDashboard)}
        >
          {hoverDashboard ? <FaArrowRight /> : <BiSolidRightArrow />}
        </button>
      </div>
    </div>
  );
};

export default DynamicDayPlanComponent;
