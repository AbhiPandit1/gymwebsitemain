

const TrainerSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
      {[...Array(3)].map((_, index) => (
        <div
          key={index}
          className="relative max-h-[400px] min-w-[30vw] min-h-[400px] rounded-xl overflow-hidden bg-gray-200 animate-pulse"
        >
          <div className="w-full h-[80%] bg-gray-300"></div>
          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between p-4 bg-gradient-to-t from-black via-transparent to-transparent">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            </div>
            <div className="w-32 h-8 bg-gray-300 rounded-lg"></div>
          </div>
          <div className="absolute bottom-24 left-4 right-4 text-white">
            <div className="w-24 h-6 bg-gray-300 rounded-lg mb-2"></div>
            <div className="w-16 h-4 bg-gray-300 rounded-lg"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrainerSkeleton;
