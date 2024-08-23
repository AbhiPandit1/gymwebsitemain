import { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';

const ReviewForm = () => {
  const [isReviewing, setIsReviewing] = useState(false);
  const [rating, setRating] = useState(0);
  const [name, setName] = useState('');
  const [review, setReview] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => state.user);
  const token = user.token;
  const userId = user.user._id;
  const backendapi = import.meta.env.VITE_BACKEND_URL;
  const { trainerId } = useParams();

  console.log(trainerId, userId);
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
    if (!rating || !review || !trainerId) {
      toast.error('Please provide a rating and review');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${backendapi}/api/create/review/669df00229d53325c09bc8d7/668b5052d6b9cd86f334ca2c`,
        { rating, reviewText: review },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 201) {
        setReviewSubmitted(true);
        toast.success('Reviewed Successfully');
        setRating(0);
        setReview('');
        setName('');
      }
    } catch (error) {
      // Log the entire error object to inspect it
      console.error('Error submitting review:', error);
      // Extract and log specific information if available
      if (error.response) {
        console.error('Response error data:', error.response.data.message);
        console.error('Response error status:', error.response.status);
      }
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
      setTimeout(() => {
        setReviewSubmitted(false);
      }, 3000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start bg-gray-800 text-white p-6 rounded-lg shadow-md font-sans">
      {!isReviewing ? (
        <button
          onClick={handleReviewButtonClick}
          className="px-6 py-3 mb-4 bg-blue-600 hover:bg-blue-700 rounded-lg shadow-lg"
        >
          Submit a Review
        </button>
      ) : (
        <div className="flex flex-col space-y-6 mt-4 w-full max-w-md">
          <label className="text-xl font-semibold">
            Give stars to the website:
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
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            className="px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Your name"
          />
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
            {loading ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      )}

      {reviewSubmitted && (
        <p className="mt-4 text-lg text-green-400">
          Your review has been submitted. Thank you for your feedback!
        </p>
      )}
    </div>
  );
};

export default ReviewForm;
