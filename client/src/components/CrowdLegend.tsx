import React from 'react';

export default function CrowdLegend() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-3 border border-gray-100 dark:border-gray-700 pointer-events-auto">
      <h4 className="text-xs font-bold text-gray-900 dark:text-white mb-2 uppercase tracking-wide">Crowd Density</h4>
      <div className="space-y-1.5">
        <div className="flex items-center">
          <span className="w-3 h-3 rounded-full bg-green-500 mr-2 shadow-sm"></span>
          <span className="text-xs text-gray-700 dark:text-gray-300">Low</span>
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 rounded-full bg-yellow-500 mr-2 shadow-sm"></span>
          <span className="text-xs text-gray-700 dark:text-gray-300">Medium</span>
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 rounded-full bg-orange-500 mr-2 shadow-sm"></span>
          <span className="text-xs text-gray-700 dark:text-gray-300">High</span>
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 rounded-full bg-red-500 mr-2 shadow-sm"></span>
          <span className="text-xs text-gray-700 dark:text-gray-300">Very High</span>
        </div>
      </div>
    </div>
  );
}

