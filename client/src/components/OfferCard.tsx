import React from 'react';

export interface Offer {
  _id: string;
  title: string;
  description: string;
  discount: string;
  validUntil: string;
  category: string;
}

interface OfferCardProps {
  offer: Offer;
  onApply?: () => void;
}

export default function OfferCard({ offer, onApply }: OfferCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-dashed border-primary-300 dark:border-primary-700 relative overflow-hidden">
      <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
        {offer.discount}
      </div>
      
      <div className="mb-2">
        <span className="text-xs font-semibold px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-md uppercase">
          {offer.category}
        </span>
      </div>
      
      <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1 pr-12">{offer.title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{offer.description}</p>
      
      <div className="flex items-center justify-between mt-4">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Valid until: <span className="font-medium text-gray-700 dark:text-gray-300">{offer.validUntil}</span>
        </div>
        <button 
          onClick={onApply}
          className="text-primary-600 dark:text-primary-400 text-sm font-semibold hover:underline"
        >
          View Offer
        </button>
      </div>
    </div>
  );
}
