import { useEffect, useRef, useState } from 'react';
import ReactStars from 'react-rating-stars-component';
import { CgProfile } from 'react-icons/cg';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { FaEdit, FaTrash } from 'react-icons/fa';
import ReviewForm from '../pages/Setting/Component/ReviewForm'; // Ensure this is the correct import
import EditReviewForm from '../pages/Setting/Component/EditReviewForm';

// Modal Component for displaying review text or confirmation
const Modal = ({ children, onClose }) => {
  if (!children) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div
        className="p-8 rounded-lg shadow-lg max-w-lg w-full relative transition-transform transform scale-100 animate-fadeIn"
        style={{
          background:
            'linear-gradient(180deg, #050c1e 0%, #050c1e 40%, #050c1e 70%, #050c1e 100%)',
        }}
      >
        <button
          className="absolute top-2 right-2 bg-orange-500 text-white pl-2 pr-2 rounded-full hover:bg-orange-400 transition-colors"
          onClick={onClose}
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

const ReviewCard = ({ currentUser }) => {
  const [data, setData] = useState([]);
  const [isScrolling, setIsScrolling] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [selectedReview, setSelectedReview] = useState(null);
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [editReviewData, setEditReviewData] = useState(null); // Store the review being edited
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/get/review`
        );
        if (!response.ok) throw new Error('Network response was not ok');
        const reviews = await response.json();
        setData(reviews);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchData();
  }, []);

  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 640);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 640);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Scroll functions
  const scrollLeftFunc = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        left:
          containerRef.current.scrollLeft -
          containerRef.current.offsetWidth / 2,
        behavior: 'smooth',
      });
    }
  };

  const scrollRightFunc = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        left:
          containerRef.current.scrollLeft +
          containerRef.current.offsetWidth / 2,
        behavior: 'smooth',
      });
    }
  };

  const handleEditModel = (review) => {
    setEditReviewData(review); // Set the selected review for editing
    setIsEdit(true);
  };

  // Drag to scroll functionality
  const handleMouseDown = (e) => {
    setIsScrolling(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isScrolling) return;
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = x - startX;
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsScrolling(false);
  };

  // Open/close modals
  const handleCardClick = (reviewText) => {
    setSelectedReview(reviewText);
  };

  const closeModal = () => {
    setSelectedReview(null);
  };

  const openReviewForm = () => {
    setIsReviewFormOpen(true);
  };

  const closeReviewForm = () => {
    setIsReviewFormOpen(false);
  };

  const openDeleteModal = (reviewId) => {
    setReviewToDelete(reviewId);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setReviewToDelete(null);
  };

  const handleEdit = async (reviewId, updatedReviewData) => {
    try {
      const trainerId = currentUser?.trainerId;

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/update/review/${reviewId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...updatedReviewData,
            trainerId: trainerId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update the review');
      }

      const result = await response.json();
      console.log('Review updated successfully:', result);

      // Update the review in the local state
      setData((prevData) =>
        prevData.map((review) =>
          review._id === reviewId ? { ...review, ...updatedReviewData } : review
        )
      );

      setIsEdit(false); // Close the form after successful update
    } catch (error) {
      console.error('Error updating review:', error);
    }
  };

  const handleDelete = async () => {
    try {
      const trainerId = currentUser?.trainerId;

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/delete/review/${
          currentUser?._id
        }`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            trainerId: trainerId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete the review');
      }

      const result = await response.json();
      console.log(result.message); // Success message from the backend

      setData((prevData) =>
        prevData.filter((review) => review._id !== reviewToDelete)
      );
      closeDeleteModal(); // Close the delete modal after deletion
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  return (
    <div className="rounded-[40px]  relative h-full m-auto w-full sm:rounded-[10px] p-4 ">
      <div className="flex justify-between items-center m-3">
        <h2 className="text-white flex justify-center items-center font-light font-bebes text-[28px] sm:text-[32px] text-center mb-4">
          What People Say
        </h2>
        <div className="bg-orange-600 flex justify-center items-center w-[4rem] h-10 text-xs sm:text-xl sm:w-28 sm:h-14 rounded-[7px] sm:rounded-[10px] text-white">
          {data.length} Total
        </div>
      </div>
      <div className='relative'>
      {data?.length > 0 && (
        <div className="hidden sm:flex">
          <button
            onClick={scrollLeftFunc}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-orange-500 p-2 rounded-full hover:bg-orange-600 transition-colors z-20" style={{ zIndex: 5 }}
            aria-label="Scroll Left"
          >
            <IoIosArrowBack color="white" className="w-6 h-6 sm:w-10 sm:h-10" />
          </button>
          <button
            onClick={scrollRightFunc}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-orange-500 p-2 rounded-full hover:bg-orange-600 transition-colors z-20" style={{ zIndex: 5 }}
            aria-label="Scroll Right"
          >
            <IoIosArrowForward
              color="white"
              className="w-6 h-6 sm:w-10 sm:h-10"
            />
          </button>
        </div>
      )}
      <div className="flex items-center justify-between mt-3 mb-10">
        <div
          className="flex  overflow-x-scroll scrollbar-hide scroll-smooth"
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
        >
          {data.map((item) => (
            <div
              key={item._id}
              className="min-w-[70vw] p-4 sm:min-w-[30vw] flex flex-col justify-between bg-gray-800 m-[20px] min-h-[40vh] sm:min-h-[60vh] text-white border-b-2 border-b-orange-500 overflow-hidden shadow-lg hover:shadow-xl transition-all cursor-pointer transform hover:scale-105"
            >
              <div
                className="font-sans min-h-[60%] max-h-[10%] text-[18px] sm:text-[24px] mt-4 leading-snug tracking-wide overflow-scroll scrollbar-hide"
                onClick={() => handleCardClick(item.reviewText)}
              >
                {item.reviewText || 'No review text available.'}
              </div>

              <div className="mt-4 font-extrabold text-2xl flex justify-between items-center">
                {item.user?.profilePhoto?.url ? (
                  <img
                    src={item.user?.profilePhoto?.url}
                    alt={item?.user?.name || 'Anonymous'}
                    className="w-[4rem] h-[4rem] rounded-full object-cover object-center"
                  />
                ) : (
                  <CgProfile className="text-5xl" />
                )}
                <div className="flex flex-col items-end">
                  <div className="text-sm sm:text-lg">
                    {item.user?.name || 'Anonymous'}
                  </div>
                  <ReactStars
                    count={5}
                    value={item.rating}
                    edit={false}
                    size={24}
                    activeColor="#ffd700"
                  />
                  {(item.user?._id === currentUser?._id ||
                    currentUser?.role === 'admin') && (
                    <div className="flex gap-2 mt-2">
                      <button
                        className="bg-green-600 p-2 rounded-full hover:bg-green-500 transition-colors"
                        onClick={() => handleEditModel(item)}
                      >
                        <FaEdit className="text-white" />
                      </button>
                      <button
                        className="bg-red-600 p-2 rounded-full hover:bg-red-500 transition-colors"
                        onClick={() => openDeleteModal(item._id)}
                      >
                        <FaTrash className="text-white" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>
      {currentUser && (
        <div className="flex justify-center mt-4">
          <button
            className="px-4 py-2 bg-gradient-to-r from-orange-400 to-orange-600  text-white rounded-full flex items-center"
            onClick={openReviewForm}
          >
            Add a Review
          </button>
        </div>
      )}
      {selectedReview && (
        <Modal onClose={closeModal}>
          <div className="text-white">
            <h3 className="text-lg font-bold">Review Detail</h3>
            <p>{selectedReview}</p>
          </div>
        </Modal>
      )}
      {isDeleteModalOpen && (
        <Modal onClose={closeDeleteModal}>
          <div className="text-white">
            <h3 className="text-lg font-bold">Confirm Deletion</h3>
            <p>Are you sure you want to delete this review?</p>
            <button
              className="bg-red-600 text-white p-2 rounded mt-4"
              onClick={handleDelete}
            >
              Delete
            </button>
            <button
              className="bg-gray-600 text-white p-2 rounded mt-4 ml-4"
              onClick={closeDeleteModal}
            >
              Cancel
            </button>
          </div>
        </Modal>
      )}
      {isEdit &&
        editReviewData && ( // Only show edit modal if editReviewData is available
          <Modal onClose={() => setIsEdit(false)}>
            <EditReviewForm
              existingReview={editReviewData} // Pass the existing review to be edited
              trainerId={currentUser?.trainerId} // Pass trainerId if needed
              onReviewUpdated={handleEdit} // Callback after review is edited
            />
          </Modal>
        )}
      {isReviewFormOpen && (
        <Modal onClose={closeReviewForm}>
          <ReviewForm onClose={closeReviewForm} />
        </Modal>
      )}
    </div>
  );
};

export default ReviewCard;
