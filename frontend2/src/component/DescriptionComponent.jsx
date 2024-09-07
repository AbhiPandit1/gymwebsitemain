const DescriptionComponent = () => {
  return (
    <div className="min-h-[80vh] bg-gray-900 flex flex-col gap-5 font-outfit relative rounded-[10px] p-5">
      <h1 className="text-white text-[2rem] sm:text-[3rem] text-center hover:underline-offset-1 hover:underline hover:decoration-orange-500 transition-all ">
        Fit for your Lifestyle
      </h1>
      <p className="text-[1rem] sm:text-[1.5rem] text-white text-auto w-[95%] m-auto hover:underline-offset-1 hover:underline ">
        Wake up with a sunrise meditation, sweat it out with lunchtime HIIT, or
        unwind with an evening flow. You’ll find movement for every mood with
        classes sorted by time, style, and skill level. Discover new challenges
        and push your limits with our curated programs, or take it slow with
        gentle stretches and restorative yoga. Join our vibrant community and
        start your journey to a healthier, happier you today.
      </p>
      <div className=" flex justify-center items-center hover:animate-shake">
        <img
          src="https://res.cloudinary.com/dzy51cqxa/image/upload/v1724290224/profile_photos/jge8zbfg9q6aaklsw1ot.jpg"
          className="w-[80%] sm:w-[30vw] h-[40vh] object-cover rounded-[10px] border-b-4 border-r-2 border-r-orange-600 border-b-orange-600 m-5 hover:shadow-2xl hover:shadow-orange-700 z-10"
        />
      </div>
      <div className="bg-orange-300 w-[60vw] h-[10vh] absolute right-0 top-[85%] opacity-15"></div>
      <div className="bg-orange-300 w-[30vw] h-[10vh] absolute right-0 top-[65%] opacity-15"></div>
    </div>
  );
};

export default DescriptionComponent;
