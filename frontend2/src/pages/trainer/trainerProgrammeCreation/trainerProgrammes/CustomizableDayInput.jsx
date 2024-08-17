import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BiSolidRightArrow } from 'react-icons/bi';

const CustomizableDayInput = () => {
  const [days, setDays] = useState('');
  const navigate = useNavigate();

  const handleDaysChange = (event) => {
    setDays(event.target.value);
  };

  const handleSubmit = () => {
    if (days && !isNaN(days) && parseInt(days, 10) > 0) {
      navigate(`/trainer/create/programme/dayPlan/${days}`);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-800 text-white">
      <h2 className="text-3xl font-bold mb-8">Set Number of Days</h2>
      <input
        type="number"
        value={days}
        onChange={handleDaysChange}
        min="1"
        className="border p-2 rounded w-1/2 mb-4 text-black"
        placeholder="Enter number of days"
      />
      <button
        onClick={handleSubmit}
        className="bg-green-600 text-white p-2 rounded flex items-center"
      >
        Continue <BiSolidRightArrow className="ml-2" />
      </button>
    </div>
  );
};

export default CustomizableDayInput;
