import HeroSection from '../../component/HeroSection';
import Programmes from '../Programmes';

const CreatorPage = () => {
  return (
    <div>
      <HeroSection
        category="Programs"
        para="Explore our wide range of programs"
        title="Programs"
        AdditionalComponent={<Programmes />}
      />
    </div>
  );
};

export default CreatorPage;
