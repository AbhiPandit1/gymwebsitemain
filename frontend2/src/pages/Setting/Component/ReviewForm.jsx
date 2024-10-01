import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const ReviewForm = ({ trainerId, heading }) => {
  const [isReviewing, setIsReviewing] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [existingReview, setExistingReview] = useState(null);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => state.user);
  const token = user.token;
  const userId = user.user._id;
  const backendapi = import.meta.env.VITE_BACKEND_URL;

  // Fetch existing review when component mounts
  useEffect(() => {
    const fetchExistingReview = async () => {
      try {
        const response = await axios.get(
          `${backendapi}/api/review/${userId}/${trainerId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 200 && response.data.review) {
          const { rating, reviewText } = response.data.review;
          setRating(rating);
          setReview(reviewText);
          setExistingReview(true); // Marks that there is an existing review
        }
      } catch (error) {
        console.error('Error fetching existing review:', error);
        // Handle case where no existing review is found or error occurred
      }
    };

    fetchExistingReview();
  }, [backendapi, userId, trainerId, token]);

  const handleReviewButtonClick = () => {
    setIsReviewing(true);
    setReviewSubmitted(false);
  };

  const handleRatingChange = (event) => {
    setRating(Number(event.target.value));
  };

  const handleReviewChange = (event) => {
    setReview(event.target.value);
  };

  const handleReviewSubmit = async () => {
    if (!rating || !review) {
      toast.error('Please provide a rating and review');
      return;
    }

    setLoading(true);

    try {
      const endpoint = existingReview
        ? `${backendapi}/api/update/review/${userId}/${trainerId}`
        : `${backendapi}/api/create/review/${userId}`;

      const response = await axios.post(
        endpoint,
        { rating, reviewText: review, trainerId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        setReviewSubmitted(true);
        toast.success('Review Submitted Successfully');
        setRating(0);
        setReview('');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Network error or server unavailable');
      }
    } finally {
      setLoading(false);
      setTimeout(() => {
        setReviewSubmitted(false);
      }, 3000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start text-white p-6 rounded-lg shadow-md font-sans">
      <div className="flex flex-col space-y-6 mt-4 w-full max-w-md">
        <label className="text-xl font-semibold">
          {existingReview ? `Edit your review ` : `Rate us`}
        </label>
        <div className="flex justify-center space-x-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <label key={star} className="flex items-center">
              <input
                type="radio"
                name="rating"
                value={star}
                checked={rating === star}
                onChange={handleRatingChange}
                className="hidden"
              />
              <svg
                className={`w-10 h-10 ${
                  rating >= star ? 'text-yellow-400' : 'text-gray-400'
                } cursor-pointer`}
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z" />
              </svg>
            </label>
          ))}
        </div>
        <textarea
          value={review}
          onChange={handleReviewChange}
          className="px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Write your review here..."
          rows="5"
        />
        <button
          onClick={handleReviewSubmit}
          className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg shadow-lg"
          disabled={loading}
        >
          {loading
            ? 'Submitting...'
            : existingReview
            ? 'Update Review'
            : 'Submit Review'}
        </button>
      </div>

      {reviewSubmitted && (
        <p className="mt-4 text-lg text-green-400">
          {existingReview
            ? 'Your review has been updated successfully!'
            : 'Your review has been submitted. Thank you for your feedback!'}
        </p>
      )}
    </div>
  );
};

export default ReviewForm;
