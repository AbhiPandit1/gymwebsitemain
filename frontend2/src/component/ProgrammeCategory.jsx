import HeroSection from './HeroSection';
import ProgrammeCard from './ProgrammeCard';

const ProgrammeCategory = () => {
  return (
    <div>
      <HeroSection
        category="Programs Category"
        para="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae distinctio laborum ex veritatis saepe iste? In iure animi commodi rem, vel asperiores."
        searchCategory="See all Categories"
      />
      <div>
        <ProgrammeCard />
      </div>
    </div>
  );
};

export default ProgrammeCategory;
