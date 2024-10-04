import { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import useDashboardLinks from '../../../../../hook/CreateDahsboardLinks';
import DashboardHeader from '../../../../component/DashboardHeader';
import PlanTable from './PlanTable';
import DashboardComponent from '../../../../component/DashboardComponent';
import { BiSolidRightArrow } from 'react-icons/bi';
import usePostDayPlan from '../../../../../hook/usePostDayPlan';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import newLogo from '../../../../assets/NewLogo.png'; // Importing the logo

const DynamicDayPlanComponent = () => {
  const { programmeId, id } = useParams();
  const dashBoardLink = useDashboardLinks();
  const [hoverDashboard, setHoverDashboard] = useState(false);
  const [headingColor, setHeadingColor] = useState(
    localStorage.getItem('headingColor') || '#FFFFFF'
  );
  const [textColor, setTextColor] = useState(
    localStorage.getItem('textColor') || '#FFFFFF'
  );
  const [textSize, setTextSize] = useState(
    localStorage.getItem('textSize') || '18px'
  );

  const [planData, setPlanData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user } = useSelector((state) => state.user);
  const { getDayPlan, updateDayPlan } = usePostDayPlan();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getDayPlan(programmeId);
        let trainerName = data[0].programme.trainer.name;

        // Sort the fetched data based on the day number
        const sortedData = data.sort((a, b) => {
          const dayA = parseInt(a.day.replace('Day ', '')); // Extract number from "Day 1"
          const dayB = parseInt(b.day.replace('Day ', ''));
          return dayA - dayB; // Ascending order
        });

        setPlanData(sortedData);
      } catch (err) {
        setError(err.message || 'An error occurred while fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Added `programmeId` as dependency

  const handleUpdate = async (dayIndex, exerciseIndex, field, value) => {
    const updatedPlanData = [...planData];
    updatedPlanData[dayIndex].exercises[exerciseIndex][field] = value;

    const dayPlanId = updatedPlanData[dayIndex].id;
    try {
      await updateDayPlan(
        programmeId,
        dayPlanId,
        updatedPlanData[dayIndex],
        setLoading,
        setError,
        setSuccess
      );
      setPlanData(updatedPlanData);
    } catch (error) {
      console.error('Error updating day plan:', error);
    }
  };

  useEffect(() => {
    localStorage.setItem('headingColor', headingColor);
    localStorage.setItem('textColor', textColor);
    localStorage.setItem('textSize', textSize);
  }, [headingColor, textColor, textSize]);

  const handleClick = () => {
    setHoverDashboard((prevState) => !prevState);
  };

  const handleDownload = () => {
    const doc = new jsPDF();

    // Function to set the background color on each page
    const setPageBackground = () => {
      doc.setFillColor(17, 24, 39); // Equivalent to #111827 (gray-950)
      doc.rect(
        0,
        0,
        doc.internal.pageSize.getWidth(),
        doc.internal.pageSize.getHeight(),
        'F'
      ); // 'F' means fill
    };

    // Function to add the logo at the bottom-right corner on each page
    const addBottomRightLogo = () => {
      const logoWidth = 30; // Define a smaller logo width
      const logoHeight = 12; // Define a smaller logo height
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

    // Set the title "Training Plan" at the center of the first page
    const contentYPosition = 30; // Define position for the title
    doc.setFontSize(20);
    doc.setTextColor(255, 255, 255); // Set text color to white
    doc.text(
      'Training Plan',
      doc.internal.pageSize.getWidth() / 2,
      contentYPosition,
      { align: 'center' }
    ); // Centered title

    // Define starting Y position for the content
    let startY = contentYPosition + 20; // Start content a bit lower than the title

    // Loop through each day's plan and add it to the PDF
    planData.forEach((dayPlan) => {
      // Set the day title with white text
      doc.setFontSize(18);
      doc.setTextColor(255, 255, 255); // White text color for day titles
      doc.text(
        `Creator: ${dayPlan.programme.trainer.name}`, // Add trainer's name directly here
        14,
        contentYPosition + 10
      );
      doc.text(dayPlan.day, 14, startY); // Display the day (like "Day 1")

      // Calculate the Y position for the table
      const tableStartY = startY + 10;

      // Set the text color for table content (changed to black)
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0); // Black text for table content

      // Draw the table for exercises
      doc.autoTable({
        startY: tableStartY,
        head: [['Exercise', 'Sets', 'Reps']],
        body: dayPlan.exercises.map((exercise) => [
          exercise.name,
          exercise.sets,
          exercise.reps,
        ]),
        theme: 'striped',
        styles: { fontSize: 12, textColor: 0 }, // Black text in the table
      });

      // Update startY after the table
      startY = doc.previousAutoTable.finalY + 20; // Space after the table for the next section

      // Add the logo at the bottom-right of the current page
      addBottomRightLogo();

      // Add a new page if the content is too long
      if (startY > 250) {
        doc.addPage();
        setPageBackground(); // Set the background on the new page
        startY = 20; // Reset Y position for the new page
      }
    });

    // Ensure the logo is added to the last page as well
    addBottomRightLogo();

    // Save the generated PDF
    doc.save('training-plan.pdf');
  };

  const handleReset = () => {
    setHeadingColor('#000000');
    setTextColor('#000000');
    setTextSize('18px');
    localStorage.removeItem('headingColor');
    localStorage.removeItem('textColor');
    localStorage.removeItem('textSize');
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

        <div className="p-4 overflow-scroll">
          <h1 className="text-2xl mb-4" style={{ color: headingColor }}>
            Dynamic Day Plan
          </h1>
          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading && !error && planData?.length === 0 && (
            <p>No day plans available for the selected programme.</p>
          )}
          {!loading && !error && planData?.length > 0 && (
            <>
              {/* Only allow customization if the user is a trainer */}
              {user.user.role === 'trainer' && (
                <div className="mb-4 flex flex-col space-y-4 gap-4 sm:flex-row sm:space-x-4 sm:space-y-0 overflow-scroll scrollbar-hide">
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
                  <div className="flex mb-4">
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
              )}
              <PlanTable
                planData={planData}
                headingColor={headingColor}
                textColor={textColor}
                textSize={textSize}
                isEditable={user.user._id === id}
                onEditClick={(dayIndex, exerciseIndex, field, value) => {
                  console.log(
                    `Editing Day ${dayIndex}, Exercise ${exerciseIndex}: ${field} = ${value}`
                  );
                }}
              />
            </>
          )}
          <button
            onClick={handleDownload}
            className="mt-4 px-4 py-2 bg-orange-500 text-white rounded"
          >
            Download PDF
          </button>
          {user.user.role === 'trainer' && (
            <button
              onClick={handleReset}
              className="mt-4 ml-4 px-4 py-2 bg-gray-500 text-white rounded"
            >
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DynamicDayPlanComponent;
