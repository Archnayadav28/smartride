import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

export default function LoadingSpinner({ size = 'md', message }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 w-full h-full min-h-[150px]">
      <Loader2 className={`${sizeClasses[size]} text-primary-600 animate-spin`} />
      {message && (
        <p className="mt-3 text-sm font-medium text-gray-600 dark:text-gray-400">
          {message}
        </p>
      )}
    </div>
  );
}
