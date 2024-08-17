import { useState, useEffect } from 'react';
import { BiSolidRightArrow } from 'react-icons/bi';
import useDashboardLinks from '../../../../../hook/CreateDahsboardLinks.jsx';
import DashboardComponent from '../../../../component/DashboardComponent.jsx';
import DashboardHeader from '../../../../component/DashboardHeader.jsx';
import dietPlan from '../../../../data/dietPlan.js'; // Import the diet plan data
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Link } from 'react-router-dom'; // Import Link for navigation

const DynamicDietPlanComponent = () => {
  const dashBoardLink = useDashboardLinks();
  const [hoverDashboard, setHoverDashboard] = useState(false);
  const [headingColor, setHeadingColor] = useState('#ffffff');
  const [textColor, setTextColor] = useState('#ffffff');
  const [textSize, setTextSize] = useState('16px');
  const [rowColor, setRowColor] = useState('#ffffff');
  const [columnColor, setColumnColor] = useState('#ffffff');
  const [tableHeadingColor, setTableHeadingColor] = useState('#333333');

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

  const handleClick = () => {
    setHoverDashboard((prevState) => !prevState);
  };

  const handleDownload = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Weekly Diet Plan', 14, 22);
    dietPlan.forEach((dayPlan, index) => {
      doc.setFontSize(16);
      doc.text(dayPlan.day, 14, 32 + index * 40);
      doc.setFontSize(12);
      doc.autoTable({
        startY: 34 + index * 40,
        head: [['Meal', 'Description']],
        body: [
          ['Breakfast', dayPlan.meals.breakfast],
          ['Lunch', dayPlan.meals.lunch],
          ['Dinner', dayPlan.meals.dinner],
        ],
        theme: 'striped',
        headStyles: { fillColor: tableHeadingColor },
        bodyStyles: { fillColor: rowColor, textColor: columnColor },
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
        } sm:${hoverDashboard ? 'col-span-7' : 'col-span-5'} overflow-scroll`}
      >
        <DashboardHeader />
        <div className="p-4">
          <div className="mb-4">
            <label>Heading Color: </label>
            <input
              type="color"
              value={headingColor}
              onChange={(e) => setHeadingColor(e.target.value)}
              className="ml-2"
            />
          </div>
          <div className="mb-4">
            <label>Text Color: </label>
            <input
              type="color"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className="ml-2"
            />
          </div>
          <div className="mb-4">
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
          <div className="mb-4">
            <label>Row Color: </label>
            <input
              type="color"
              value={rowColor}
              onChange={(e) => setRowColor(e.target.value)}
              className="ml-2"
            />
          </div>
          <div className="mb-4">
            <label>Column Text Color: </label>
            <input
              type="color"
              value={columnColor}
              onChange={(e) => setColumnColor(e.target.value)}
              className="ml-2"
            />
          </div>
          <div className="mb-4">
            <label>Table Heading Color: </label>
            <input
              type="color"
              value={tableHeadingColor}
              onChange={(e) => setTableHeadingColor(e.target.value)}
              className="ml-2"
            />
          </div>
          <div className="mb-4">
            <button
              onClick={handleReset}
              className="p-2 bg-red-600 rounded mr-2"
            >
              Reset
            </button>
            <button
              onClick={handleDownload}
              className="p-2 bg-green-600 rounded"
            >
              Download PDF
            </button>
          </div>
          <h2
            className="text-3xl font-bold mb-8 text-center"
            style={{ color: headingColor }}
          >
            Weekly Diet Plan
          </h2>
          {dietPlan.map((dayPlan, index) => (
            <div key={index} className="mb-4">
              <h3
                className="text-2xl font-bold"
                style={{ color: headingColor, fontSize: textSize }}
              >
                {dayPlan.day}
              </h3>
              <div className="overflow-x-auto">
                <table className="table-auto w-full mt-2 border border-gray-700 bg-gray-800">
                  <thead>
                    <tr
                      className="bg-gray-700"
                      style={{ backgroundColor: tableHeadingColor }}
                    >
                      <th className="p-2 border-b border-gray-600">Meal</th>
                      <th className="p-2 border-b border-gray-600">
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      style={{ backgroundColor: rowColor, color: columnColor }}
                    >
                      <td className="p-2">Breakfast</td>
                      <td className="p-2">{dayPlan.meals.breakfast}</td>
                    </tr>
                    <tr
                      style={{ backgroundColor: rowColor, color: columnColor }}
                    >
                      <td className="p-2">Lunch</td>
                      <td className="p-2">{dayPlan.meals.lunch}</td>
                    </tr>
                    <tr
                      style={{ backgroundColor: rowColor, color: columnColor }}
                    >
                      <td className="p-2">Dinner</td>
                      <td className="p-2">{dayPlan.meals.dinner}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ))}
          <div className="flex justify-between mt-8">
            <Link to="/next-page">
              <button className="p-4 bg-green-600 rounded">Next</button>
            </Link>
            {hoverDashboard && (
              <div
                className="absolute left-0 top-[10%] animate-shake cursor-pointer hover:animate-none transition-transform duration-300"
                onClick={handleClick}
              >
                <BiSolidRightArrow size={30} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicDietPlanComponent;
