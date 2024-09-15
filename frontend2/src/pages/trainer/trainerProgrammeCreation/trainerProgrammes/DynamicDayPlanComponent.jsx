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
    doc.setFontSize(20);
    doc.setTextColor(headingColor);
    doc.text('Training Plan', 14, 40);

    let startY = 50;

    planData.forEach((dayPlan) => {
      doc.setFontSize(18);

      doc.setFillColor(240, 240, 240);
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
    setHeadingColor('#000000');
    setTextColor('#000000');
    setTextSize('18px');
    localStorage.removeItem('headingColor');
    localStorage.removeItem('textColor');
    localStorage.removeItem('textSize');
  };

  return (
    <div className="grid grid-cols-9 h-screen max-w-[100vw]  text-white font-sans bg-gray-900">
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
        <div className="p-4">
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
