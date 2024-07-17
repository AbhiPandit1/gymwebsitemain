import { useSelector } from 'react-redux';

const ProgrammeCardMobile = () => {
  const { programme } = useSelector((state) => state.user);
  console.log(programme);
  const trainerVisible = programme.slice(0, 3);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 mt-4 bg-trainerColor  ">
      {trainerVisible.map((data) => (
        <div
          key={data.id}
          className="rounded-xl  m-auto h-[40vh] w-[70vw] sm:h-[40vh] sm:w-[30vw] overflow-hidden bg-primary relative"
        >
          <img
            src={data.image}
            alt="trainer"
            className="object-cover h-full  float-right w-full rounded-lg opacity-100"
          />
          <div>
            <div className="mt-[1rem] font-extrabold items-center text-4xl font-sans text-white h-[20vh] absolute top-[50%] left-[5%]">
              {data.category}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProgrammeCardMobile;
