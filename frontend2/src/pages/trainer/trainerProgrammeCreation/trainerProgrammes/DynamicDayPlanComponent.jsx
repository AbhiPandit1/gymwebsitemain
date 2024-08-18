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
          {
            name: 'Push-ups',
            sets: '3',
            reps: '15',
            video: {
              name: 'Push-up Tutorial',
              url: 'https://www.youtube.com/watch?v=kmy_YNhl0mw',
            },
          },
          {
            name: 'Squats',
            sets: '3',
            reps: '20',
            video: {
              name: 'Squat Technique',
              url: 'https://rr5---sn-qxaelney.googlevideo.com/videoplayback?expire=1724026720&ei=ADvCZvyaOvG4mLAPlcKeaQ&ip=41.133.216.51&id=o-AB1Fu9ACJPpl8L4Q-V8yev8Qcv1rfNwOdHIeOLpSlAQM&itag=18&source=youtube&requiressl=yes&xpc=EgVo2aDSNQ%3D%3D&bui=AQmm2ewNIFNnKAar1Jnh7lVSPo1AEt6oqn-_IX1TFOADKP7J-xb7x21_eEPVOKCdQ_OROb8tPLrJ31BK&spc=Mv1m9qkuUPe1NQ8aOJgqb0gh7UbCEpK-s7TjAyUPO_7uAzQcpoquQjI&vprv=1&svpuc=1&mime=video%2Fmp4&ns=1Xprev8RyUOcU5IDMFqin7IQ&rqh=1&gir=yes&clen=462489582&ratebypass=yes&dur=19928.015&lmt=1723846685038232&c=WEB_CREATOR&sefc=1&txp=6309224&n=KBug31AIXLHsmA&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cxpc%2Cbui%2Cspc%2Cvprv%2Csvpuc%2Cmime%2Cns%2Crqh%2Cgir%2Cclen%2Cratebypass%2Cdur%2Clmt&sig=AJfQdSswRQIgZx0gR2BZ0Lg_agg72tHCd9d6DPuaJc_W2qnurkNM_cMCIQDmUEf2VZ3z7ldpdPMXb5KACurqTqPtLUc2K7ahIcyefQ%3D%3D&title=Build%20a%20Full%20Stack%20React%20Native%20App%20with%20Payments%20%7C%20PostgreSQL%2C%20TypeScript%2C%20Stripe%2C%20Tailwind&rm=sn-wocee7z&rrc=104,80&fexp=24350516,24350517,24350557,24350561&req_id=7cc7958e1c8ba3ee&ipbypass=yes&redirect_counter=2&cm2rm=sn-xmjpuxa-qxal7d&cms_redirect=yes&cmsv=e&mh=Dz&mip=45.118.158.164&mm=29&mn=sn-qxaelney&ms=rdu&mt=1724010081&mv=m&mvi=5&pl=24&lsparams=ipbypass,mh,mip,mm,mn,ms,mv,mvi,pl&lsig=AGtxev0wRQIhAKYVcVd-yBvxEN2TQH4mcRgf21x9cGWku0xoSIZLu7v4AiAZzcw6oOZdDT4M46QUBb05v5WSDlE1rU8xR6x0nK1xyQ%3D%3D',
            },
          },
        ],
      },
      {
        day: 'Day 2',
        exercises: [
          {
            name: 'Pull-ups',
            sets: '3',
            reps: '10',
            video: {
              name: 'Pull-up Guide',
              url: 'https://www.youtube.com/watch?v=2yM4vJt5wa8',
            },
          },
          {
            name: 'Lunges',
            sets: '3',
            reps: '15',
            video: {
              name: 'Lunges Tutorial',
              url: 'https://www.youtube.com/watch?v=1j5vJgRjS5Q',
            },
          },
          {
            name: 'Lunges',
            sets: '3',
            reps: '15',
            video: {
              name: 'Lunges Tutorial',
              url: 'https://www.youtube.com/watch?v=1j5vJgRjS5Q',
            },
          },
          {
            name: 'Lunges',
            sets: '3',
            reps: '15',
            video: {
              name: 'Lunges Tutorial',
              url: 'https://www.youtube.com/watch?v=1j5vJgRjS5Q',
            },
          },
        ],
      },
      {
        day: 'Day 3',
        exercises: [
          {
            name: 'Bench Press',
            sets: '4',
            reps: '12',
            video: {
              name: 'Bench Press Form',
              url: 'https://www.youtube.com/watch?v=Bp1HkZg4F5s',
            },
          },
          {
            name: 'Deadlift',
            sets: '4',
            reps: '10',
            video: {
              name: 'Deadlift Technique',
              url: 'https://www.youtube.com/watch?v=ytCmoJ8E_WU',
            },
          },
        ],
      },
      {
        day: 'Day 4',
        exercises: [
          {
            name: 'Plank',
            sets: '3',
            reps: '60s',
            video: {
              name: 'Plank Position',
              url: 'https://www.youtube.com/watch?v=pSHjTRCQxIw',
            },
          },
          {
            name: 'Burpees',
            sets: '3',
            reps: '15',
            video: {
              name: 'Burpees Guide',
              url: 'https://www.youtube.com/watch?v=7lD6AjKr8g4',
            },
          },
        ],
      },
    ];

    const sevenDayPlan = [
      ...fourDayPlan,
      {
        day: 'Day 5',
        exercises: [
          {
            name: 'Mountain Climbers',
            sets: '3',
            reps: '20',
            video: {
              name: 'Mountain Climbers',
              url: 'https://www.youtube.com/watch?v=3_3xDFt6yt4',
            },
          },
          {
            name: 'Jumping Jacks',
            sets: '3',
            reps: '30',
            video: {
              name: 'Jumping Jacks',
              url: 'https://www.youtube.com/watch?v=c4D9I4zj9M4',
            },
          },
        ],
      },
      {
        day: 'Day 6',
        exercises: [
          {
            name: 'Bicep Curls',
            sets: '3',
            reps: '15',
            video: {
              name: 'Bicep Curls Tutorial',
              url: 'https://www.youtube.com/watch?v=ykJmrZ5v0F4',
            },
          },
          {
            name: 'Tricep Dips',
            sets: '3',
            reps: '15',
            video: {
              name: 'Tricep Dips',
              url: 'https://www.youtube.com/watch?v=6kALZikXxLc',
            },
          },
        ],
      },
      {
        day: 'Day 7',
        exercises: [{ name: 'Rest Day', sets: '', reps: '', video: null }],
      },
    ];

    const thirtyDayPlan = [
      ...sevenDayPlan,
      {
        day: 'Day 8',
        exercises: [
          {
            name: 'Running',
            sets: '1',
            reps: '30m',
            video: {
              name: 'Running Tips',
              url: 'https://www.youtube.com/watch?v=0Oln0U-LzOs',
            },
          },
          {
            name: 'Cycling',
            sets: '1',
            reps: '45m',
            video: {
              name: 'Cycling Basics',
              url: 'https://www.youtube.com/watch?v=RHhBIL4L0D4',
            },
          },
        ],
      },
      // Continue adding plans for the remaining days with video details
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
