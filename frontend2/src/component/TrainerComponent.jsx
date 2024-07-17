import Trainers from './Trainers';
import EquipCard from './EquipCard';
import HeroSection from './HeroSection';

const TrainerComponent = () => {
  return (
    <>
      <div>
        <HeroSection
          category="Search Trainers"
          para="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae distinctio laborum ex veritatis saepe iste? In iure animi commodi rem, vel asperiores."
          searchCategory="See all Trainers"
        />
      </div>
      {/*Trainers */}
      <div className="h-auto top-[20%]">
        <Trainers />
      </div>

      {/*equipCompinent */}
      <div className="h-auto top-[20%]">
        <EquipCard />
      </div>
    </>
  );
};

export default TrainerComponent;
