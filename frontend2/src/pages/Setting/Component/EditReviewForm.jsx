import { useState } from 'react';

const EditReviewForm = ({ existingReview, trainerId, onReviewUpdated }) => {
  const [rating, setRating] = useState(existingReview.rating || 0);
  const [reviewText, setReviewText] = useState(existingReview.reviewText || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle rating change for the star rating system
  const handleRatingChange = (e) => {
    setRating(Number(e.target.value));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const updatedReview = {
      rating,
      reviewText,
      trainerId,
    };

    // Call the callback with the updated review data
    onReviewUpdated(existingReview._id, updatedReview);

    setIsSubmitting(false);
  };

  return (
    <div className="text-white">
      <h3 className="text-lg font-bold mb-4">Edit Review</h3>
      <form onSubmit={handleSubmit}>
        {/* Star Rating System */}
        <div className="mb-4">
          <label htmlFor="rating" className="block mb-2">
            Rating
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
        </div>

        {/* Review Text */}
        <div className="mb-4">
          <label htmlFor="reviewText" className="block mb-2">
            Review Text
          </label>
          <textarea
            id="reviewText"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            rows={4}
            className="w-full p-2 border text-black border-gray-300 rounded"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-green-600 text-white p-2 rounded"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditReviewForm;
