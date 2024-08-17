import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import HeroSection from './HeroSection';
import ProgrammeComponentCard from './ProgrammeComponentCard';
import ProgrammeComponentCardMobile from './ProgrammeComponentCardMobile';
import { getProgramme } from '../action/programmeActions';

const ProgrammeComponent = () => {
  const [programmeData, setProgrammeData] = useState([]);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [searchBox, setSearchBox] = useState('');
  const [filter, setFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState(''); // New state for category filter
  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch programme data on component mount
    const fetchData = async () => {
      try {
        const action = await dispatch(getProgramme());
        if (action && action.categories) {
          setProgrammeData(action.categories);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setProgrammeData([]); // Clear programmeData on error
      }
    };

    fetchData();
  }, [dispatch]);

  useEffect(() => {
    // Check screen size on component mount and resize
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 640); // Adjust breakpoint as needed
    };

    checkScreenSize(); // Check initially
    window.addEventListener('resize', checkScreenSize); // Add listener for resizing

    return () => {
      window.removeEventListener('resize', checkScreenSize); // Cleanup listener
    };
  }, []);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCategoryFilter(e.target.value);
  };

  // Filter programmes based on search box input and selected category
  const filteredProgrammes = programmeData.filter((programme) => {
    const matchesSearch = programme.category
      ?.toLowerCase()
      .includes(searchBox.toLowerCase());
    const matchesCategory = categoryFilter
      ? programme.category === categoryFilter
      : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <HeroSection
        category="Programs"
        para="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae distinctio laborum ex veritatis saepe iste? In iure animi commodi rem, vel asperiores."
        searchCategory="See all Programmes"
      />
      <div className="w-full bg-footerColor flex flex-col items-center text-white pl-5 sm:p-5 min-h-screen max-w-[90%] mx-auto rounded-xl p-10">
        <div className="flex flex-col sm:flex-row items-center gap-2 justify-start">
          <div className="sm:pl-[10%] p-2">
            Search
            <div className="flex justify-between items-center w-full">
              <input
                type="text"
                placeholder="Search ..."
                className="w-full sm:w-[30rem] h-12 px-4 rounded-l-[1rem] rounded-r-[1rem] bg-tertiary border border-secondary focus:outline-none focus:ring-2 focus:ring-secondary"
                onChange={(e) => setSearchBox(e.target.value)}
              />
            </div>
          </div>
          <div className="mt-3 p-4">
            <select
              value={filter}
              onChange={handleFilterChange}
              className="p-2 border bg-tertiary rounded-lg border-gray-300 ml-2"
            >
              <option value="">Select Filter</option>
              <option value="priceLowToHigh">Price Low to High</option>
              <option value="priceHighToLow">Price High to Low</option>
              <option value="bestsellers">Bestsellers</option>
            </select>
          </div>
          <div className="mt-3 p-4">
            <select
              value={categoryFilter}
              onChange={handleCategoryChange}
              className="p-2 border bg-tertiary rounded-lg border-gray-300 ml-2"
            >
              <option value="">All Categories</option>
              <option value="Nutrition">Nutrition</option>
              <option value="Bodybuilding">Bodybuilding</option>
              <option value="Sports">Sports</option>
              <option value="Women">Women</option>
              <option value="WeightLoss">Weight Loss</option>
              <option value="PowerLifting">Power Lifting</option>
              <option value="General">General</option>
              <option value="Recovery">Recovery</option>
            </select>
          </div>
        </div>

        {isSmallScreen ? (
          <div className="mt-4">
            <ProgrammeComponentCardMobile
              programmeData={filteredProgrammes}
              filter={filter}
            />
          </div>
        ) : (
          <div className="mt-4">
            <ProgrammeComponentCard
              programmeData={filteredProgrammes}
              filter={filter}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgrammeComponent;
