import { FaDollarSign, FaArrowUp, FaArrowDown } from 'react-icons/fa';

const TotalRevenueCard = () => {
  // Fake data for demonstration purposes
  const revenue = {
    total: 125000,
    change: 5.2, // percentage change
    trend: 'up', // or 'down'
  };

  const trendColor = revenue.trend === 'up' ? 'text-green-500' : 'text-red-500';
  const trendIcon = revenue.trend === 'up' ? <FaArrowUp /> : <FaArrowDown />;

  return (
    <div className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 p-6 shadow-lg shadow-blue-300 transform transition-transform hover:scale-105">
      {/* Title */}
      <h2 className="text-2xl font-semibold text-white">Total Revenue</h2>

      {/* Revenue Amount */}
      <div className="flex items-center mb-2">
        <FaDollarSign className="text-4xl text-white mr-2" />
        <p className="text-4xl font-bold text-white">
          ${revenue.total.toLocaleString()}
        </p>
      </div>

      {/* Revenue Trend */}
      <div className="flex items-center mt-4">
        <span className={`flex items-center ${trendColor} text-xl font-medium`}>
          {trendIcon} {revenue.change}%
        </span>
        <p className="text-white ml-2">since last month</p>
      </div>

      {/* Footer */}
      <div className="mt-4 text-white opacity-75 text-sm">
        Last updated: 2 hours ago
      </div>
    </div>
  );
};

export default TotalRevenueCard;
