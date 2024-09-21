import { useState, useEffect } from 'react';
import { BiSolidRightArrow } from 'react-icons/bi';
import useDashboardLinks from '../../../../../hook/CreateDahsboardLinks.jsx';
import DashboardComponent from '../../../../component/DashboardComponent.jsx';
import DashboardHeader from '../../../../component/DashboardHeader.jsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useParams } from 'react-router-dom';
import newLogo from '../../../../assets/NewLogo.png'; // Importing the logo
import { useSelector } from 'react-redux';

const DynamicDietPlanComponent = () => {
  const dashBoardLink = useDashboardLinks();
  const [hoverDashboard, setHoverDashboard] = useState(false);
  const [headingColor, setHeadingColor] = useState('#FFA500'); // Orange in hex
  const [textColor, setTextColor] = useState('#FFFFFF'); // White in hex
  const [textSize, setTextSize] = useState('1.5rem'); // Size remains as '1.5rem'
  const [dietPlanData, setDietPlanData] = useState([]);
  const { programmeId } = useParams();
  const { user } = useSelector((state) => state.user);

  // Load and save settings to local storage
  useEffect(() => {
    const loadSettings = () => {
      setHeadingColor(localStorage.getItem('headingColor') || '#FFA500');
      setTextColor(localStorage.getItem('textColor') || '#FFFFFF');
      setTextSize(localStorage.getItem('textSize') || '1.5rem');
    };

    loadSettings();
  }, []);

  useEffect(() => {
    localStorage.setItem('headingColor', headingColor);
    localStorage.setItem('textColor', textColor);
    localStorage.setItem('textSize', textSize);
  }, [headingColor, textColor, textSize]);

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
    doc.setFillColor(240, 240, 240); // Light grey background
    doc.rect(
      0,
      0,
      doc.internal.pageSize.getWidth(),
      doc.internal.pageSize.getHeight(),
      'F'
    );
    const logoWidth = 50; // Define desired logo width
    const logoHeight = 20; // Define desired logo height
    const logoXPosition = 80; // Centering the logo horizontally
    const logoYPosition = 10; // Y position at the top

    doc.addImage(
      newLogo,
      'PNG',
      logoXPosition,
      logoYPosition,
      logoWidth,
      logoHeight
    ); // Add logo

    // Set title
    doc.setFontSize(18);
    doc.text('Weekly Diet Plan', 14, 22);

    // Define starting Y position for content
    let yPosition = 32;

    dietPlanData.forEach((plan, index) => {
      doc.setFontSize(16);
      doc.text(`Plan ${index + 1}`, 14, yPosition);
      yPosition += 10; // Add space after the plan title

      plan.days.forEach((day, dayIndex) => {
        doc.setFontSize(14);
        doc.text(day.day || `Day ${dayIndex + 1}`, 14, yPosition);
        yPosition += 10; // Add space before the table

        doc.setFontSize(12);
        const mealData = day.meals.map((meal) => [meal.time, meal.meal]);

        // Draw table
        doc.autoTable({
          startY: yPosition,
          head: [['Time', 'Meal']],
          body: mealData.length > 0 ? mealData : [['No Data', 'No Data']],
          theme: 'striped',
          styles: { cellPadding: 2, fontSize: 12 },
          columnStyles: { 0: { cellWidth: 'auto' }, 1: { cellWidth: 'auto' } },
          margin: { left: 14 },
        });

        // Update yPosition to be after the table
        yPosition = doc.autoTable.previous.finalY + 10; // Add space after the table

        // Add extra space between days
        yPosition += 16; // 2rem of space (16px)
      });

      // Add extra space between plans
      yPosition += 32; // 2rem of space (32px) between plans

      // Check if we need to add a new page
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20; // Reset yPosition to the top of the new page
      }
    });

    doc.save('diet-plan.pdf');
  };

  const handleReset = () => {
    setHeadingColor('#FFA500');
    setTextColor('#FFFFFF');
    setTextSize('1.5rem');
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
        {/* Toggle Dashboard Visibility on Small Screens */}
        {hoverDashboard && (
          <div
            className="absolute left-0 z-10 top-[10%] animate-shake cursor-pointer hover:animate-none transition-transform duration-300"
            onClick={() => setHoverDashboard(false)}
          >
            <BiSolidRightArrow size={40} color="orange" />
          </div>
        )}

        <div className="overflow-scroll w-[240vw] sm:w-[90vw] m-auto scrollbar-hide">
          {/* Settings Panel */}
          {user.user.role === 'trainer' && (
            <div className="bg-gray-800 p-6 rounded-md shadow-md mb-6 overflow-scroll ">
              <h3 className="text-lg font-semibold mb-4">Settings</h3>
              <div className="flex flex-col sm:flex-row justify-start items-start gap-4">
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
                  <label className="flex flex-col items-center space-y-2">
                    <span>Text Size:</span>
                    <input
                      type="number"
                      value={parseInt(textSize, 10)}
                      onChange={(e) => setTextSize(`${e.target.value}px`)}
                      className="w-24 p-2 border border-gray-400 rounded bg-gray-100 text-gray-800"
                      placeholder="Enter size"
                    />
                  </label>
                </div>
              </div>
              <div className="mt-4 flex gap-4">
                <button
                  onClick={handleReset}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Reset
                </button>
                <button
                  onClick={handleDownload}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Download PDF
                </button>
              </div>
            </div>
          )}

          <div className="bg-gray-900 p-6 rounded-md shadow-md ">
            <h1
              className="text-center text-4xl font-bold mb-4"
              style={{ color: headingColor, fontSize: textSize }}
            >
              Weekly Diet Plan
            </h1>
            {dietPlanData.length === 0 ? (
              <p className="text-center">No diet plans available.</p>
            ) : (
              dietPlanData.map((plan, index) => (
                <div key={index} className="mb-6">
                  <h2
                    className="text-2xl font-semibold"
                    style={{ color: headingColor }}
                  >
                    Plan {index + 1}
                  </h2>
                  {plan.days.map((day, dayIndex) => (
                    <div key={dayIndex} className="mt-4">
                      <h3
                        className="text-xl font-semibold"
                        style={{ color: headingColor }}
                      >
                        {day.day || `Day ${dayIndex + 1}`}
                      </h3>
                      <table className="min-w-full divide-y divide-gray-700 mt-2">
                        <thead>
                          <tr>
                            <th className="px-4 py-2 text-left">Time</th>
                            <th className="px-4 py-2 text-left">Meal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {day.meals.length > 0 ? (
                            day.meals.map((meal, mealIndex) => (
                              <tr key={mealIndex}>
                                <td className="px-4 py-2">{meal.time}</td>
                                <td className="px-4 py-2">{meal.meal}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td className="px-4 py-2">No Data</td>
                              <td className="px-4 py-2">No Data</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicDietPlanComponent;
