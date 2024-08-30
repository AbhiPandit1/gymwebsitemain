import { useState, useEffect } from 'react';
import { BiSolidRightArrow } from 'react-icons/bi';
import useDashboardLinks from '../../../../../hook/CreateDahsboardLinks.jsx';
import DashboardComponent from '../../../../component/DashboardComponent.jsx';
import DashboardHeader from '../../../../component/DashboardHeader.jsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useParams } from 'react-router-dom';

const DynamicDietPlanComponent = () => {
  const dashBoardLink = useDashboardLinks();
  const [hoverDashboard, setHoverDashboard] = useState(false);
  const [headingColor, setHeadingColor] = useState('#FFA500'); // Orange in hex
  const [textColor, setTextColor] = useState('#FFFFFF'); // White in hex
  const [textSize, setTextSize] = useState('1.5rem'); // Size remains as '1.5rem'
  const [rowColor, setRowColor] = useState('#1F1F1F'); // Gray-900 in hex
  const [columnColor, setColumnColor] = useState('#4B4B4B'); // Gray-600 in hex
  const [tableHeadingColor, setTableHeadingColor] = useState('#333333');
  const [dietPlanData, setDietPlanData] = useState([]);
  const { programmeId } = useParams();

  // Load and save settings to local storage
  useEffect(() => {
    const loadSettings = () => {
      setHeadingColor(localStorage.getItem('headingColor') || '#FFA500');
      setTextColor(localStorage.getItem('textColor') || '##FFFFFF');
      setTextSize(localStorage.getItem('textSize') || '1.5rem');
      setRowColor(localStorage.getItem('rowColor') || '#1F1F1F');
      setColumnColor(localStorage.getItem('columnColor') || '#4B4B4B');
      setTableHeadingColor(
        localStorage.getItem('tableHeadingColor') || '#333333'
      );
    };

    loadSettings();
  }, []);

  useEffect(() => {
    localStorage.setItem('headingColor', headingColor);
    localStorage.setItem('textColor', textColor);
    localStorage.setItem('textSize', textSize);
    localStorage.setItem('rowColor', rowColor);
    localStorage.setItem('columnColor', columnColor);
    localStorage.setItem('tableHeadingColor', tableHeadingColor);
  }, [
    headingColor,
    textColor,
    textSize,
    rowColor,
    columnColor,
    tableHeadingColor,
  ]);
  const backendapi = import.meta.env.VITE_BACKEND_URL;
  // Fetch diet plan data from API
  useEffect(() => {
    const fetchDietPlanData = async () => {
      try {
        const response = await fetch(
          `${backendapi}/api/trainer/diet/plan/${programmeId}`
        );
        const data = await response.json();
        setDietPlanData(data.dietPlans || []);
      } catch (error) {
        console.error('Error fetching diet plan data:', error);
      }
    };

    fetchDietPlanData();
  }, [programmeId]);

  const handleClick = () => {
    setHoverDashboard((prevState) => !prevState);
  };

  const handleDownload = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Weekly Diet Plan', 14, 22);

    dietPlanData.forEach((plan, index) => {
      doc.setFontSize(16);
      doc.text(`Plan ${index + 1}`, 14, 32 + index * 40);
      plan.days.forEach((day, dayIndex) => {
        doc.setFontSize(14);
        doc.text(
          day.day || `Day ${dayIndex + 1}`,
          14,
          42 + index * 40 + dayIndex * 30
        );
        doc.setFontSize(12);
        const mealData = day.meals.map((meal) => [meal.time, meal.meal]);
        doc.autoTable({
          startY: 46 + index * 40 + dayIndex * 30,
          head: [['Time', 'Meal']],
          body: mealData.length > 0 ? mealData : [['No Data', 'No Data']],
          theme: 'striped',
          headStyles: { fillColor: tableHeadingColor },
          bodyStyles: { fillColor: rowColor, textColor: columnColor },
        });
      });
    });
    doc.save('diet-plan.pdf');
  };

  const handleReset = () => {
    setHeadingColor('#ffffff');
    setTextColor('#ffffff');
    setTextSize('16px');
    setRowColor('#ffffff');
    setColumnColor('#ffffff');
    setTableHeadingColor('#333333');
  };

  return (
    <div className="grid grid-cols-9 h-screen max-w-[100vw] text-white font-sans bg-gray-900">
      <div
        className={`transition-transform duration-300 bg-gray-900 ${
          hoverDashboard ? 'hidden sm:hidden' : 'col-span-3 sm:col-span-1'
        }`}
      >
        <DashboardComponent
          dashBoardLink={dashBoardLink}
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

        <div className="overflow-scroll w-[240vw] sm:w-[90vw] m-auto scrollbar-hide">
          {/* Settings Panel */}
          <div className=" bg-gray-800 p-4 rounded-md shadow-md ">
            <h3 className="text-lg font-semibold">Settings</h3>
            <div className="flex justify-around items-center ">
              <div>
                <label className="block mb-1">Heading Color:</label>
                <input
                  type="color"
                  value={headingColor}
                  onChange={(e) => setHeadingColor(e.target.value)}
                  className="w-24 h-8 border rounded"
                />
              </div>
              <div>
                <label className="block mb-1">Text Color:</label>
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-24 h-8 border rounded"
                />
              </div>

              <div>
                <label className="flex flex-col mb-1  items-center space-x-2">
                  <span>Text Size:</span>
                  <input
                    type="number"
                    value={parseInt(textSize)}
                    onChange={(e) => setTextSize(`${e.target.value}px`)}
                    className="w-24 p-2 border border-gray-400 rounded bg-gray-100 text-gray-800"
                    placeholder="Enter size"
                  />
                </label>
              </div>
              <div>
                <label className="block mb-1">Row Color:</label>
                <input
                  type="color"
                  value={rowColor}
                  onChange={(e) => setRowColor(e.target.value)}
                  className="w-24 h-8 border rounded"
                />
              </div>
              <div>
                <label className="block mb-1">Column Text Color:</label>
                <input
                  type="color"
                  value={columnColor}
                  onChange={(e) => setColumnColor(e.target.value)}
                  className="w-24 h-8 border rounded"
                />
              </div>
              <div>
                <label className="block mb-1">Table Heading Color:</label>
                <input
                  type="color"
                  value={tableHeadingColor}
                  onChange={(e) => setTableHeadingColor(e.target.value)}
                  className="w-24 h-8 border rounded"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-red-600 text-white rounded-md shadow-md hover:bg-red-700 transition duration-300"
              >
                Reset
              </button>
              <button
                onClick={handleDownload}
                className="px-4 py-2 bg-green-600 text-white rounded-md shadow-md hover:bg-green-700 transition duration-300"
              >
                Download PDF
              </button>
            </div>
          </div>

          {/* Diet Plan */}
          <h2
            className="text-4xl font-bold mb-6 text-center"
            style={{ color: headingColor, fontSize: textSize }}
          >
            Weekly Diet Plan
          </h2>
          {dietPlanData.length > 0 ? (
            <div className="space-y-4">
              {dietPlanData.map((plan, index) => (
                <div
                  key={index}
                  className="bg-gray-800 p-4 rounded-md shadow-md"
                >
                  <h3
                    className="text-2xl font-semibold mb-4"
                    style={{ color: headingColor }}
                  >
                    Plan {index + 1}
                  </h3>
                  {plan.days.map((day, dayIndex) => (
                    <div key={dayIndex} className="mb-4">
                      <h4
                        className="text-xl font-semibold mb-2"
                        style={{ color: headingColor }}
                      >
                        {day.day || `Day ${dayIndex + 1}`}
                      </h4>
                      <table className="w-full border-collapse">
                        <thead>
                          <tr style={{ backgroundColor: tableHeadingColor }}>
                            <th
                              className="border px-4 py-2"
                              style={{ color: headingColor }}
                            >
                              Time
                            </th>
                            <th
                              className="border px-4 py-2"
                              style={{ color: headingColor }}
                            >
                              Meal
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {day.meals.length > 0 ? (
                            day.meals.map((meal, mealIndex) => (
                              <tr
                                key={mealIndex}
                                style={{ backgroundColor: rowColor }}
                              >
                                <td className="border px-4 py-2">
                                  {meal.time}
                                </td>
                                <td className="border px-4 py-2">
                                  {meal.meal}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td
                                colSpan="2"
                                className="border px-4 py-2 text-center"
                                style={{ color: columnColor }}
                              >
                                No Meals
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400">
              No diet plans available.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DynamicDietPlanComponent;
