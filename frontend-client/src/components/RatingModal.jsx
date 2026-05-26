import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star } from 'lucide-react';

export default function RatingModal({ isOpen, onClose, item, onSubmit }) {
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !item) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    // Mock API call
    setTimeout(() => {
      onSubmit({ productId: item.id, rating, comment });
      setSubmitting(false);
      onClose();
    }, 800);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 transition-colors bg-stone-100 p-1.5 rounded-full"
          >
            <X size={20} />
          </button>

          <div className="p-6">
            <h2 className="font-heading text-2xl font-bold text-stone-900 mb-2">Rate Product</h2>
            <div className="flex items-center gap-4 mb-6 p-4 bg-stone-50 rounded-xl">
              <img src={item.image || item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
              <div>
                <p className="font-semibold text-stone-900 line-clamp-2">{item.name}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-6 flex flex-col items-center">
                <p className="text-sm font-medium text-stone-600 mb-3">How would you rate this?</p>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="transition-transform hover:scale-110 focus:outline-none"
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      onClick={() => setRating(star)}
                    >
                      <Star
                        size={32}
                        className={`${
                          star <= (hoveredRating || rating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-stone-300'
                        } transition-colors`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Share your experience (optional)
                </label>
                <textarea
                  className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none"
                  rows="4"
                  placeholder="What did you like or dislike?"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                ></textarea>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn bg-stone-100 text-stone-700 hover:bg-stone-200 flex-1 justify-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary flex-1 justify-center"
                >
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
