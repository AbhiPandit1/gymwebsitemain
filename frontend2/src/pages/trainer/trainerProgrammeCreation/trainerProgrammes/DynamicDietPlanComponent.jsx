import { useState, useEffect } from 'react';
import { BiSolidRightArrow } from 'react-icons/bi';
import DashboardHeader from '../../../../component/DashboardHeader.jsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useParams } from 'react-router-dom';
import newLogo from '../../../../assets/NewLogo.png';
import { useSelector } from 'react-redux';

const DynamicDietPlanComponent = () => {
  const [hoverDashboard, setHoverDashboard] = useState(false);
  const [headingColor, setHeadingColor] = useState('#FFA500');
  const [textColor, setTextColor] = useState('#FFFFFF');
  const [textSize, setTextSize] = useState('1.5rem');
  const [dietPlanData, setDietPlanData] = useState([]);
  const { programmeId } = useParams();
  const { user } = useSelector((state) => state.user);

  // Load settings from localStorage
  useEffect(() => {
    const loadSettings = () => {
      setHeadingColor(localStorage.getItem('headingColor') || '#FFA500');
      setTextColor(localStorage.getItem('textColor') || '#FFFFFF');
      setTextSize(localStorage.getItem('textSize') || '1.5rem');
    };

    loadSettings();
  }, []);

  // Store settings in localStorage
  useEffect(() => {
    localStorage.setItem('headingColor', headingColor);
    localStorage.setItem('textColor', textColor);
    localStorage.setItem('textSize', textSize);
  }, [headingColor, textColor, textSize]);

  const backendapi = import.meta.env.VITE_BACKEND_URL;

  // Fetch diet plan data from backend
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

  // Toggle hover state for dashboard
  const handleClick = () => {
    setHoverDashboard((prevState) => !prevState);
  };

  // Handle PDF download
  const handleDownload = () => {
    const doc = new jsPDF();

    // Function to set the page background color
    const setPageBackground = () => {
      doc.setFillColor(17, 24, 39); // Equivalent to #111827 (gray-950)
      doc.rect(
        0,
        0,
        doc.internal.pageSize.getWidth(),
        doc.internal.pageSize.getHeight(),
        'F' // 'F' means fill
      );
    };

    // Function to add the logo to the bottom right corner
    const addBottomRightLogo = () => {
      const logoWidth = 30; // Smaller logo width
      const logoHeight = 12; // Smaller logo height
      const logoXPosition = doc.internal.pageSize.getWidth() - logoWidth - 10; // Positioned 10 units from the right
      const logoYPosition = doc.internal.pageSize.getHeight() - logoHeight - 10; // Positioned 10 units from the bottom

      // Add the logo in the bottom-right corner of the page
      doc.addImage(
        newLogo,
        'PNG',
        logoXPosition,
        logoYPosition,
        logoWidth,
        logoHeight
      );
    };

    // Set the background color for the first page
    setPageBackground();
    addBottomRightLogo();

    // Add content before the logo
    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255); // White text for title
    const pageWidth = doc.internal.pageSize.getWidth();
    doc.text('Weekly Diet Plan', pageWidth / 2, 40, {
      align: 'center',
    });

    let yPosition = 64; // Initial y position for content

    dietPlanData.forEach((plan, planIndex) => {
      doc.setFontSize(16);
      doc.setTextColor(255, 255, 255); // White text for creator
      doc.text(`Creator: ${plan.programme.trainer.name}`, 14, yPosition);
      yPosition += 10;

      plan.days.forEach((day, dayIndex) => {
        doc.setFontSize(14);
        doc.setTextColor(255, 255, 255); // White text for day
        doc.text(day.day || `Day ${dayIndex + 1}`, 14, yPosition);
        yPosition += 10;

        const mealData = day.meals.map((meal) => [meal.time, meal.meal]);

        // Create the meal table
        doc.autoTable({
          startY: yPosition,
          head: [['Time', 'Meal']],
          body: mealData.length > 0 ? mealData : [['No Data', 'No Data']],
          theme: 'striped',
          styles: {
            cellPadding: 2,
            fontSize: 12,
            textColor: 0, // Black text for table
          },
          columnStyles: { 0: { cellWidth: 'auto' }, 1: { cellWidth: 'auto' } },
          margin: { left: 14 },
        });

        yPosition = doc.autoTable.previous.finalY + 10; // Update yPosition after table
        yPosition += 16; // Add additional space

        // Check if new page is needed
        if (yPosition > 250) {
          doc.addPage();
          setPageBackground(); // Set the background on the new page
          yPosition = 20; // Reset y position for new page
        }
      });

      // Add logo to the bottom right after each plan
      addBottomRightLogo();
      yPosition += 32; // Add space before the next plan
    });

    // Add logo on the last page
    addBottomRightLogo(); // Ensures the logo is added to the last page as well

    doc.save('diet-plan.pdf'); // Save the document
  };

  // Reset settings to defaults
  const handleReset = () => {
    setHeadingColor('#FFA500');
    setTextColor('#FFFFFF');
    setTextSize('1.5rem');
  };

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-9 text-white font-sans "
      style={{
        background: 'linear-gradient(180deg, #050c1e 0%, #050c1e 100%)',
      }}
    >
      <div className="col-span-9 sticky top-0 z-50 ">
        <DashboardHeader />
      </div>

      <div className="min-h-screen  min-w-[100vw]">
        {hoverDashboard && (
          <div
            className="absolute left-0 z-10 top-[10%] animate-shake cursor-pointer hover:animate-none transition-transform duration-300"
            onClick={handleClick}
          >
            <BiSolidRightArrow size={40} color="orange" />
          </div>
        )}

        {user.user.role === 'trainer' && (
          <div className="bg-gray-800 p-6 rounded-md shadow-md mb-6">
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
          </div>
        )}
        <div className="p-4 overflow-scroll ">
          <div className="bg-gray-900 p-6 rounded-md shadow-md overflow-x-auto scrollbar-hide">
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
                          <tr className="bg-gray-800">
                            <th className="px-4 py-2 text-left">Time</th>
                            <th className="px-4 py-2 text-left">Meal</th>
                          </tr>
                        </thead>
                        <tbody className="bg-gray-900 divide-y divide-gray-700">
                          {day.meals.length > 0 ? (
                            day.meals.map((meal, mealIndex) => (
                              <tr key={mealIndex}>
                                <td className="px-4 py-2">{meal.time}</td>
                                <td className="px-4 py-2">{meal.meal}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="2" className="px-4 py-2 text-center">
                                No Meals
                              </td>
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

        <button
          onClick={handleDownload}
          className="bg-blue-500 text-white p-2 rounded mt-4 hover:bg-blue-700"
        >
          Download PDF
        </button>
        <button
          onClick={handleReset}
          className="bg-red-500 text-white p-2 rounded mt-4 ml-4 hover:bg-red-700"
        >
          Reset Settings
        </button>
      </div>
    </div>
  );
};

export default DynamicDietPlanComponent;
