import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, User, Calendar, Plus } from 'lucide-react';
import { Review } from '../../types';
import { useLocalization } from '../../hooks/useLocalization';
import { useAddReview } from '../../hooks/useProducts';

interface ProductReviewsProps {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
  productId: string;
  onReviewAdded: () => void;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({
  reviews,
  averageRating,
  totalReviews,
  productId,
  onReviewAdded
}) => {
  const { getLocalizedText } = useLocalization();
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: "",
    user: "",
  });

  const { mutate: addReview, isPending } = useAddReview({
    onSuccess: () => {
      setNewReview({ rating: 5, comment: "", user: "" });
      onReviewAdded();
    }
  });

  const handleAddReview = async () => {
    if (!newReview.comment.trim() || !newReview.user.trim()) {
      return;
    }
    addReview({ productId, reviewData: { user: newReview.user, rating: newReview.rating, comment: newReview.comment } });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9 }}
      className='space-y-2 sm:space-y-3 lg:space-y-4'
    >
      <h3 className='text-base sm:text-lg font-semibold text-gray-900'>
        Customer Reviews ({totalReviews})
      </h3>
      {reviews.length === 0 ? (
        <p className='text-gray-600 text-sm'>
          No reviews yet. Be the first to leave one!
        </p>
      ) : (
        <div className='space-y-3'>
          {reviews.slice(0, 3).map((review, index) => (
            <div key={index} className='bg-gray-50 p-3 rounded-lg'>
              <div className='flex items-center space-x-2 mb-2'>
                <User className='w-4 h-4 text-gray-600' />
                <span className='font-semibold text-gray-800 text-sm'>
                  {review.user}
                </span>
                <span className='text-gray-500 text-xs'>
                  <Calendar className='w-3 h-3 inline-block mr-1' />
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className='flex items-center space-x-2 mb-2'>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${
                      i < review.rating
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                <span className='text-gray-600 text-xs'>
                  {review.rating}
                </span>
              </div>
              <p className='text-gray-700 text-sm leading-relaxed'>
                {review.comment}
              </p>
            </div>
          ))}
          {reviews.length > 3 && (
            <p className='text-center text-sm text-gray-600'>
              Showing 3 of {reviews.length} reviews
            </p>
          )}
        </div>
      )}

      {/* Add Review Form */}
      <div className='pt-4 border-t border-gray-200'>
        <h4 className='text-base font-semibold text-gray-900 mb-3'>
          Leave a Review
        </h4>
        
        {/* User Name Input */}
        <div className='mb-3'>
          <label htmlFor="review-user" className="block text-sm font-medium text-gray-700 mb-1">
            Your Name *
          </label>
          <input
            id="review-user"
            name="review-user"
            type='text'
            placeholder='Your Name'
            value={newReview.user}
            onChange={(e) =>
              setNewReview({ ...newReview, user: e.target.value })
            }
            className='w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm'
            required
            aria-required="true"
          />
        </div>
        
        {/* Rating Selection */}
        <div className='mb-3'>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating *
          </label>
          <div className='flex items-center space-x-2' role="radiogroup" aria-labelledby="rating-label">
            {[...Array(5)].map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() =>
                  setNewReview({ ...newReview, rating: i + 1 })
                }
                className="focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
                aria-label={`Rate ${i + 1} star${i === 0 ? '' : 's'}`}
                title={`Rate ${i + 1} star${i === 0 ? '' : 's'}`}
                aria-pressed={newReview.rating === i + 1}
              >
                <Star
                  className={`w-5 h-5 cursor-pointer ${
                    newReview.rating > i
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
        
        {/* Comment Input */}
        <div className='mb-3'>
          <label htmlFor="review-comment" className="block text-sm font-medium text-gray-700 mb-1">
            Review Comment *
          </label>
          <textarea
            id="review-comment"
            name="review-comment"
            rows={3}
            className='w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm'
            placeholder='Write your review here...'
            value={newReview.comment}
            onChange={(e) =>
              setNewReview({ ...newReview, comment: e.target.value })
            }
            required
            aria-required="true"
          />
        </div>
        
        <button
          type="button"
          onClick={handleAddReview}
          className='mt-3 inline-flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors text-sm holographic-card disabled:opacity-50'
          disabled={isPending}
          aria-label="Submit review"
          title="Submit review"
        >
          <Plus className='w-4 h-4' />
          <span>{isPending ? 'Submitting...' : 'Submit Review'}</span>
        </button>
      </div>
    </motion.div>
  );
};

export default ProductReviews;
