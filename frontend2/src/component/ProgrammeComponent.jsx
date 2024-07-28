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

  // Filter programmes based on search box input
  const filteredProgrammes = programmeData.filter((programme) =>
    programme.category?.toLowerCase().includes(searchBox.toLowerCase())
  );

  return (
    <div>
      <HeroSection
        category="Programs"
        para="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae distinctio laborum ex veritatis saepe iste? In iure animi commodi rem, vel asperiores."
        searchCategory="See all Programmes"
      />
      <div className="bg-footerColor flex flex-col items-center text-white min-h-screen w-[90%] max-w-screen-lg mx-auto rounded-[32px] p-5">
        <div className="flex flex-col sm:flex-row items-center  gap-2 justify-start w-[80%] sm:w-[70%]">
          <div className="sm:pl-[10%] p-2">
            Search
            <div className="flex justify-between items-center w-full">
              <input
                type="text"
                placeholder="Search by category..."
                className="w-full sm:w-[30rem] h-12 px-4 rounded-l-[1rem] rounded-r-[1rem] bg-tertiary border border-secondary focus:outline-none focus:ring-2 focus:ring-secondary"
                onChange={(e) => setSearchBox(e.target.value)}
              />
            </div>
          </div>
          <div className="mt-3 p-4 ">
            <select
              value={filter}
              onChange={handleFilterChange}
              className="p-2   border bg-tertiary rounded-lg border-gray-300 ml-2"
            >
              <option value="">Select Filter</option>
              <option value="priceLowToHigh">Price Low to High</option>
              <option value="priceHighToLow">Price High to Low</option>
              <option value="bestsellers">Bestsellers</option>
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
