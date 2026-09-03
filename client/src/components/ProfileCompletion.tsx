import React from 'react';
import { Check } from 'lucide-react';

interface ProfileCompletionProps {
  completion: number;
  onComplete?: () => void;
}

export default function ProfileCompletion({ completion, onComplete }: ProfileCompletionProps) {
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (completion / 100) * circumference;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 border-l-4 border-accent shadow-sm flex items-center justify-between group transition-all duration-300 hover:shadow-diffused">
      <div className="flex items-center space-x-5">
        <div className="relative w-14 h-14 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
            <circle
              cx="40"
              cy="40"
              r={radius}
              className="text-primary-100 dark:text-primary-800"
              strokeWidth="4"
              fill="transparent"
              stroke="currentColor"
            />
            <circle
              cx="40"
              cy="40"
              r={radius}
              className="text-accent-dark dark:text-accent transition-all duration-1000 ease-bespoke"
              strokeWidth="4"
              fill="transparent"
              stroke="currentColor"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>
          <span className="absolute text-sm font-bold dark:text-white">{completion}%</span>
        </div>
        <div>
          <h3 className="font-semibold text-primary-950 dark:text-white">Profile Completion</h3>
          <p className="text-sm text-primary-500 dark:text-primary-400 mt-1">
            {completion >= 100 ? 'All details completed' : 'Unlock tailored experiences'}
          </p>
        </div>
      </div>
      {completion < 100 ? (
        <button
          type="button"
          onClick={onComplete}
          className="px-5 py-2 border border-primary-200 dark:border-primary-700 text-primary-700 dark:text-primary-200 text-xs tracking-wider uppercase font-medium rounded-full hover:bg-primary-950 hover:text-white dark:hover:bg-white dark:hover:text-primary-950 transition-colors duration-300"
        >
          Complete
        </button>
      ) : (
        <div className="flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-3.5 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800">
          <Check size={14} className="mr-1 text-emerald-600 dark:text-emerald-400" />
          100% Complete
        </div>
      )}
    </div>
  );
}
