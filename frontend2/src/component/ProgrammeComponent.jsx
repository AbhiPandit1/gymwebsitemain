import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import HeroSection from './HeroSection';
import ProgrammeComponentCard from './ProgrammeComponentCard';
import EquipCard from './EquipCard';
import Footer from './Footer';
import { getProgramme } from '../action/programmeActions';

const ProgrammeComponent = () => {
  const [programmeData, setProgrammeData] = useState([]);
  const [searchBox, setSearchBox] = useState('');
  const [filter, setFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3); // Number of items per page
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const action = await dispatch(getProgramme());
        if (action && action.categories) {
          setProgrammeData(action.categories);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setProgrammeData([]);
      }
    };

    fetchData();
  }, [dispatch]);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCategoryFilter(e.target.value);
  };

  // Filter Programmes
  const filteredProgrammes = programmeData.filter((programme) => {
    const matchesSearch = programme.title
      ?.toLowerCase()
      .includes(searchBox.toLowerCase());
    const matchesCategory = categoryFilter
      ? programme.category.some((cat) => cat === categoryFilter)
      : true;
    return matchesSearch && matchesCategory;
  });

  console.log('Filtered Programmes Length:', filteredProgrammes.length); // Debugging

  // Sort Programmes
  const sortedProgrammes = [...filteredProgrammes].sort((a, b) => {
    if (filter === 'priceLowToHigh') {
      return a.price - b.price;
    }
    if (filter === 'priceHighToLow') {
      return b.price - a.price;
    }
    if (filter === 'bestsellers') {
      return b.sales - a.sales; // Assuming `sales` or a similar field for bestseller logic
    }
    return 0;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredProgrammes.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedProgrammes.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  console.log('Current Items:', currentItems); // Debugging

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Render page numbers with a limit
  const renderPageNumbers = () => {
    const pageNumbers = [];
    const pageLimit = 5; // Limit visible page numbers

    let startPage = Math.max(currentPage - Math.floor(pageLimit / 2), 1);
    let endPage = Math.min(startPage + pageLimit - 1, totalPages);

    if (endPage - startPage < pageLimit) {
      startPage = Math.max(endPage - pageLimit + 1, 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-4 py-2 rounded-lg ${
            currentPage === i
              ? 'bg-orange-600 text-white'
              : 'bg-gray-200 text-black'
          }`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex items-center space-x-2">
        {startPage > 1 && <span className="px-3">...</span>}
        {pageNumbers}
        {endPage < totalPages && <span className="px-3">...</span>}
      </div>
    );
  };

  return (
    <div
      style={{
        background:
          'linear-gradient(180deg, #050c1e 0%, #050c1e 40%, #050c1e 70%, #050c1e 100%)',
      }}
    >
      <HeroSection
        category="Programs"
        para="Explore our wide range of programs"
        title="Programs"
      />
      <div className="w-full flex flex-col  items-center text-white p-5 min-h-screen max-w-full mx-auto  relative z-40">
        <h1 className="text-2xl font-bold mb-6">Our Programs</h1>
        <div className="flex flex-col sm:flex-row items-center gap-2 justify-start mb-6">
          <div className="mt-3 px-8 py-2">
            <select
              id="filter"
              value={filter}
              onChange={handleFilterChange}
              className="p-2 border bg-tertiary rounded-sm border-gray-300"
            >
              <option value="">Sort</option>
              <option value="priceLowToHigh">Price Low to High</option>
              <option value="priceHighToLow">Price High to Low</option>
              <option value="bestsellers">Bestsellers</option>
            </select>
          </div>
          <div className="p-2">
            <input
              type="text"
              id="search"
              placeholder="Search for programs..."
              className="w-full sm:w-[35rem] h-12 px-4 rounded-sm bg-tertiary border border-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400"
              onChange={(e) => setSearchBox(e.target.value)}
            />
          </div>
          <div className="p-2">
            <select
              id="category"
              className="px-8 py-2 border bg-tertiary rounded-lg border-gray-300"
              value={categoryFilter}
              onChange={handleCategoryChange}
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
              <option value="Calisthenics">Calisthenics</option>
            </select>
          </div>
        </div>
        <div className="mt-4">
          <ProgrammeComponentCard
            programmeData={currentItems} // Pass paginated data
            filter={filter}
          />
        </div>
        {/* Pagination Controls */}
        <div className="flex justify-center mt-6 space-x-4">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg bg-gray-200 text-black disabled:bg-gray-300"
          >
            Previous
          </button>

          {renderPageNumbers()}

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-lg bg-gray-200 text-black disabled:bg-gray-300"
          >
            Next
          </button>
        </div>
        <div className="text-center mt-2">
          Page {currentPage} of {totalPages}
        </div>
      </div>
      <div>
        <EquipCard />
      </div>
      <Footer />
    </div>
  );
};

export default ProgrammeComponent;
