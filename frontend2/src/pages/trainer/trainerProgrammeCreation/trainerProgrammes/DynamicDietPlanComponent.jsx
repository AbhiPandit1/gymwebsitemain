import { useState, useEffect } from 'react';
import { BiSolidRightArrow } from 'react-icons/bi';
import useDashboardLinks from '../../../../../hook/CreateDahsboardLinks.jsx';
import DashboardComponent from '../../../../component/DashboardComponent.jsx';
import DashboardHeader from '../../../../component/DashboardHeader.jsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Link, useParams } from 'react-router-dom'; // Import Link for navigation

const DynamicDietPlanComponent = () => {
  const dashBoardLink = useDashboardLinks();
  const [hoverDashboard, setHoverDashboard] = useState(false);
  const [headingColor, setHeadingColor] = useState('#ffffff');
  const [textColor, setTextColor] = useState('#ffffff');
  const [textSize, setTextSize] = useState('16px');
  const [rowColor, setRowColor] = useState('#ffffff');
  const [columnColor, setColumnColor] = useState('#ffffff');
  const [tableHeadingColor, setTableHeadingColor] = useState('#333333');
  const [dietPlanData, setDietPlanData] = useState([]);
  const { programmeId } = useParams();

  // Load settings from local storage
  useEffect(() => {
    const savedHeadingColor = localStorage.getItem('headingColor') || '#ffffff';
    const savedTextColor = localStorage.getItem('textColor') || '#ffffff';
    const savedTextSize = localStorage.getItem('textSize') || '16px';
    const savedRowColor = localStorage.getItem('rowColor') || '#ffffff';
    const savedColumnColor = localStorage.getItem('columnColor') || '#ffffff';
    const savedTableHeadingColor =
      localStorage.getItem('tableHeadingColor') || '#333333';

    setHeadingColor(savedHeadingColor);
    setTextColor(savedTextColor);
    setTextSize(savedTextSize);
    setRowColor(savedRowColor);
    setColumnColor(savedColumnColor);
    setTableHeadingColor(savedTableHeadingColor);
  }, []);

  // Save settings to local storage
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

  // Fetch diet plan data from API
  useEffect(() => {
    const fetchDietPlanData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/trainer/diet/plan/${programmeId}`
        );
        const data = await response.json();
        console.log(data);
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
      doc.text(`Plan ${index + 1}`, 14, 32 + index * 40); // Only display Plan heading once per plan
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
    <div className="grid grid-cols-7 h-screen max-w-[100vw] text-white font-sans">
      {/* Dashboard Component */}
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

      {/* Main Content */}
      <div
        className={`transition-transform duration-300 ${
          hoverDashboard ? 'col-span-7' : 'col-span-5'
        } overflow-auto`}
      >
        <DashboardHeader />
        <div className="p-6 space-y-6">
          {/* Settings Panel */}
          <div className="space-y-4 bg-gray-800 p-4 rounded-md shadow-md">
            <h3 className="text-lg font-semibold">Settings</h3>
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
            {hoverDashboard && (
              <div
                className="absolute left-0 top-[10%] animate-shake cursor-pointer hover:animate-none transition-transform duration-300 z-10"
                onClick={handleClick}
              >
                <BiSolidRightArrow size={80} color="white" />
              </div>
            )}

            <div>
              <label className="block mb-1 flex items-center space-x-2">
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
            <div className="space-y-6">
              {dietPlanData.map((plan, index) => (
                <div
                  key={index}
                  className="bg-gray-800 p-4 rounded-md shadow-md"
                >
                  {plan.days.map((day, dayIndex) => (
                    <div key={dayIndex} className="mb-6">
                      <h4
                        className="text-xl font-semibold mb-2"
                        style={{ color: headingColor, fontSize: textSize }}
                      >
                        {day.day || `Day ${dayIndex + 1}`}
                      </h4>
                      <table className="w-full border border-gray-700">
                        <thead>
                          <tr>
                            <th
                              className="border border-gray-600 p-2"
                              style={{ backgroundColor: tableHeadingColor }}
                            >
                              Time
                            </th>
                            <th
                              className="border border-gray-600 p-2"
                              style={{ backgroundColor: tableHeadingColor }}
                            >
                              Meal
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {day.meals.length > 0 ? (
                            day.meals.map((meal, mealIndex) => (
                              <tr key={mealIndex}>
                                <td
                                  className="border border-gray-600 p-2"
                                  style={{ color: textColor }}
                                >
                                  {meal.time}
                                </td>
                                <td
                                  className="border border-gray-600 p-2"
                                  style={{ color: textColor }}
                                >
                                  {meal.meal}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td
                                className="border border-gray-600 p-2"
                                colSpan="2"
                                style={{ color: textColor }}
                              >
                                No Data
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
            <p className="text-center">No diet plan data available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DynamicDietPlanComponent;
