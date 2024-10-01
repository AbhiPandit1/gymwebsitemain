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
    localStorage.getItem('headingColor') || '#000000'
  );
  const [textColor, setTextColor] = useState(
    localStorage.getItem('textColor') || '#000000'
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
        setPlanData(data);
      } catch (err) {
        setError(err.message || 'An error occurred while fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

    // Set the background color for the entire page
    doc.setTextColor(headingColor);
    doc.rect(
      0,
      0,
      doc.internal.pageSize.getWidth(),
      doc.internal.pageSize.getHeight(),
      'F'
    ); // 'F' means fill

    // Adding the logo at the top
    const logoWidth = 50; // Define desired logo width
    const logoHeight = 20; // Define desired logo height
    const logoXPosition = (doc.internal.pageSize.getWidth() - logoWidth) / 2; // Centering the logo horizontally
    const logoYPosition = 10; // Y position at the top

    doc.addImage(
      newLogo,
      'PNG',
      logoXPosition,
      logoYPosition,
      logoWidth,
      logoHeight
    ); // Add logo

    // Set the title "Training Plan" below the logo, 4 rem down (64 pixels from the logo)
    const contentYPosition = logoYPosition + logoHeight + 64; // 4 rem down from logo
    doc.setFontSize(20);
    doc.setTextColor(255, 255, 255); // Set text color to white
    doc.text(
      'Training Plan',
      doc.internal.pageSize.getWidth() / 2,
      contentYPosition,
      { align: 'center' }
    ); // Centered title

    // Define starting Y position for the content
    let startY = contentYPosition + 10; // Start content a bit lower than the title

    planData.forEach((dayPlan) => {
      // Set the day title with white text
      doc.setFontSize(18);
      doc.setTextColor(255, 255, 255); // White text color for day titles
      doc.text(dayPlan.day, 14, startY); // Display the day (like "Day 1")

      // Calculate the Y position for the table
      const tableStartY = startY + 10;

      // Set the text color for table content
      doc.setFontSize(14);
      doc.setTextColor(255, 255, 255); // White text for table content

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
        styles: { fontSize: 12 }, // White text in the table
      });

      // Update startY after the table
      startY = doc.previousAutoTable.finalY + 20; // Space after the table for the next section

      // Add a new page if the content is too long
      if (startY > 250) {
        doc.addPage();
        startY = 20; // Reset Y position for the new page
      }
    });

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
