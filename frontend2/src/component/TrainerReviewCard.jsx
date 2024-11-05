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
          className="absolute top-2 right-2 bg-orange-500 text-white rounded-full p-2 hover:bg-orange-400 transition-colors"
          onClick={onClose}
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

const TrainerReviewCard = ({ currentUser, trainerId }) => {
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
    const fetchTrainerReviews = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/review/trainer/${trainerId}`
        );
        if (!response.ok) throw new Error('Network response was not ok');
        const reviews = await response.json();
        setData(reviews);
      } catch (error) {
        console.error('Error fetching trainer reviews:', error);
      }
    };

    if (trainerId) {
      fetchTrainerReviews();
    }
  }, [trainerId]);

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
          currentUser._id
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
        <h2 className="flex justify-between text-center font-extrabold items-center text-2xl sm:text-4xl font-sans text-white">
          What People Say
        </h2>
        <div className="bg-orange-600 flex justify-center items-center w-[4rem] h-10 text-xs sm:text-xl sm:w-28 sm:h-14 rounded-[7px] sm:rounded-[10px] text-white">
          {data.length} Total
        </div>
      </div>
      {data?.length > 0 && (
        <div className="hidden sm:flex">
          <button
            onClick={scrollLeftFunc}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-orange-500 p-2 rounded-full hover:bg-orange-600 transition-colors z-20"style={{ zIndex: 5 }}
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
          className="flex gap-4 overflow-x-scroll scrollbar-hide scroll-smooth"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          ref={containerRef}
        >
          {data?.map((review) => (
            <div
              key={review._id}
              className="relative border-[3px] border-[#ff6e00] rounded-[20px] flex justify-between min-w-[80vw] sm:min-w-[40vw] min-h-[50vw] sm:min-h-[40vh] bg-gradient-to-b from-[#212121] to-[#111] shadow-lg"
            >
              <div className="absolute flex justify-center items-center text-gray-500 top-3 left-4 w-20 h-20 rounded-full bg-white">
                <CgProfile className="text-gray-500 w-16 h-16" />
              </div>
              <div className="flex flex-col justify-between p-4">
                <h3 className="text-xl font-bold text-gray-300">
                  {review.user?.name || 'Anonymous'}
                </h3>
                <p className="text-sm text-gray-300">
                  {review.reviewText.slice(0, 100)}
                  {review.reviewText.length > 100 && '...'}
                  <button
                    onClick={() => handleCardClick(review.reviewText)}
                    className="text-orange-500 ml-1"
                  >
                    Read more
                  </button>
                </p>
                <div className="flex items-center">
                  <ReactStars
                    count={5}
                    value={review.rating}
                    edit={false}
                    size={24}
                    activeColor="#ffd700"
                  />
                  <span className="ml-2 text-gray-400">{review.rating}</span>
                </div>
              </div>
              {currentUser && currentUser?._id === review.user?._id && (
                <div className="absolute top-3 right-4 flex space-x-2 text-gray-500">
                  <button onClick={() => handleEditModel(review)}>
                    <FaEdit className="w-5 h-5 hover:text-orange-500 transition-colors" />
                  </button>
                  <button onClick={() => openDeleteModal(review._id)}>
                    <FaTrash className="w-5 h-5 hover:text-orange-500 transition-colors" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {selectedReview && (
        <Modal onClose={closeModal}>
          <h3 className="text-lg font-semibold text-gray-300">Review Text</h3>
          <p className="text-sm text-gray-300 mt-2">{selectedReview}</p>
        </Modal>
      )}

      {isDeleteModalOpen && (
        <Modal onClose={closeDeleteModal}>
          <div>
            <h3 className="text-lg font-semibold text-gray-300">
              Are you sure you want to delete this review?
            </h3>
            <div className="flex space-x-4 mt-4">
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                onClick={handleDelete}
              >
                Delete
              </button>
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                onClick={closeDeleteModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}

      {isReviewFormOpen && <ReviewForm onClose={closeReviewForm} />}

      {isEdit && editReviewData && (
        <EditReviewForm
          initialReview={editReviewData}
          onClose={() => setIsEdit(false)}
          onSubmit={handleEdit}
        />
      )}

      <div className="text-center mt-10">
        <button
          onClick={openReviewForm}
          className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          Add Review
        </button>
      </div>
    </div>
  );
};

export default TrainerReviewCard;
