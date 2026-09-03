import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, StarHalf, CheckCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';

export default function ReviewPage() {
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [category, setCategory] = useState('overall');
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    // mock api call
    setTimeout(() => {
      setSubmitted(true);
    }, 500);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
        <CheckCircle className="w-20 h-20 text-green-500 mb-6" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">Thank you for your feedback!</h2>
        <p className="text-gray-500 dark:text-gray-400 text-center mb-8">Your review helps us improve SmartRide for everyone.</p>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm w-full max-w-sm mb-8 border border-gray-100 dark:border-gray-700">
          <div className="flex mb-2 text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={i < rating ? "fill-current" : ""} />
            ))}
          </div>
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">{category}</p>
          <p className="text-gray-800 dark:text-gray-200 italic">"{comment}"</p>
        </div>
        <Button onClick={() => navigate('/home')} className="w-full max-w-sm">Back to Home</Button>
      </div>
    );
  }

  return (
    <div className="pb-20 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="bg-white dark:bg-gray-800 p-4 pt-8 sticky top-0 z-10 shadow-sm flex items-center border-b border-gray-200 dark:border-gray-700">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full mr-2 text-gray-900 dark:text-white">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold dark:text-white">Share Your Feedback</h1>
      </div>

      <div className="p-4 max-w-lg mx-auto mt-4">
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
          
          <div className="text-center mb-8">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">How was your experience?</h2>
            <div className="flex justify-center space-x-2">
              {[...Array(5)].map((_, index) => {
                index += 1;
                return (
                  <button
                    type="button"
                    key={index}
                    className={`bg-transparent border-0 outline-none cursor-pointer p-1 transition-transform hover:scale-110`}
                    onClick={() => setRating(index)}
                    onMouseEnter={() => setHover(index)}
                    onMouseLeave={() => setHover(rating)}
                  >
                    <Star 
                      className={`w-10 h-10 ${index <= (hover || rating) ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600'}`} 
                    />
                  </button>
                );
              })}
            </div>
            {rating === 0 && <p className="text-sm text-red-500 mt-2">Please select a rating</p>}
          </div>

          <div className="space-y-4">
            <Select 
              label="Category"
              name="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              options={[
                { value: 'overall', label: 'Overall Experience' },
                { value: 'booking', label: 'Booking Services' },
                { value: 'map', label: 'Offline Maps' },
                { value: 'support', label: 'Customer Support' },
                { value: 'app', label: 'App Performance' }
              ]}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tell us more</label>
              <textarea 
                rows={5}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="What did you like or dislike?"
                className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 resize-none"
                required
              />
            </div>
            
            <Button type="submit" className="w-full py-3" disabled={rating === 0}>Submit Review</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
