const SkeletonProgrammeCard = () => (
  <div className="relative rounded-xl overflow-hidden bg-gray-300 animate-pulse m-auto h-[40vh] w-[70vw] sm:h-[40vh] sm:w-[30vw]">
    <div className="w-full h-full bg-gray-400 rounded-lg"></div>
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="font-extrabold text-2xl sm:text-4xl text-gray-500 text-center">
        Loading...
      </div>
    </div>
  </div>
);
export default SkeletonProgrammeCard;
