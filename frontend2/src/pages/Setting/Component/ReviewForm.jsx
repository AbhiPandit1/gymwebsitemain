import { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const ReviewForm = () => {
  const [isReviewing, setIsReviewing] = useState(false);
  const [rating, setRating] = useState(0);
  const [name, setName] = useState('');
  const [review, setReview] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [loading, setLoading] = useState(false); // State to manage loading
  const { user } = useSelector((state) => state.user);
  const token = user.token;
  const userId = user.user._id;
  const backendapi = import.meta.env.VITE_BACKEND_URL;

  const handleReviewButtonClick = () => {
    setIsReviewing(true);
    setReviewSubmitted(false);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleRatingChange = (event) => {
    setRating(Number(event.target.value));
  };

  const handleReviewChange = (event) => {
    setReview(event.target.value);
  };

  const handleReviewSubmit = async () => {
    setLoading(true); // Start loading
    setReviewSubmitted(false); // Reset submission state

    try {
      // Submit review to backend
      const response = await axios.post(
        `${backendapi}/api/setting/review/${userId}`, // Adjust the endpoint according to your backend route
        { rating, reviewText: review }, // Correct payload structure
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add the token to headers
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 201) {
        setReviewSubmitted(true);
        toast.success('Reviewed Succcessfully');
        setRating(0); // Clear rating
        setReview(''); // Clear the review field
        setName(''); // Clear the name field
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setLoading(false); // End loading
      setTimeout(() => {
        setReviewSubmitted(false);
      }, 3000); // 30 seconds
    }
  };

  return (
    <div className="flex flex-col items-center justify-start bg-black text-white p-4 font-sans">
      {!isReviewing ? (
        <button
          onClick={handleReviewButtonClick}
          className="px-4 py-2 mb-4 w-[50%] bg-blue-500 hover:bg-blue-700 rounded"
        >
          Submit a Review
        </button>
      ) : (
        <div className="flex flex-col space-y-4 mt-4 w-full max-w-md">
          <label className="text-lg font-semibold">
            Give stars to the website:
          </label>
          <div className="flex space-x-2">
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
                  className={`w-8 h-8 ${
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
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            className="px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Your name"
          />
          <textarea
            value={review}
            onChange={handleReviewChange}
            className="px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Write your review here..."
            rows="4"
          />
          <button
            onClick={handleReviewSubmit}
            className="px-4 py-2 bg-green-500 hover:bg-green-700 rounded"
            disabled={loading} // Disable button while loading
          >
            {loading ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      )}

      {reviewSubmitted && (
        <p className="mt-4 text-white">
          Your review has been submitted. Thank you for your feedback!
        </p>
      )}
    </div>
  );
};

export default ReviewForm;
