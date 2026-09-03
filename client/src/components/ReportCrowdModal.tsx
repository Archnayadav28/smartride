import React, { useState } from 'react';
import { X, Check } from 'lucide-react';

interface ReportCrowdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (intensity: number) => void;
}

export default function ReportCrowdModal({ isOpen, onClose, onSubmit }: ReportCrowdModalProps) {
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);

  if (!isOpen) return null;

  const levels = [
    { value: 0.2, label: 'Low', color: 'bg-green-500', desc: 'Not crowded at all' },
    { value: 0.5, label: 'Medium', color: 'bg-yellow-500', desc: 'Some people, easy to walk' },
    { value: 0.7, label: 'High', color: 'bg-orange-500', desc: 'Crowded, slow movement' },
    { value: 0.9, label: 'Very High', color: 'bg-red-500', desc: 'Packed, difficult to move' },
  ];

  const handleSubmit = () => {
    if (selectedLevel !== null) {
      onSubmit(selectedLevel);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-sm shadow-xl overflow-hidden animate-fade-in">
        <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-gray-700">
          <h3 className="font-bold text-gray-900 dark:text-white">Report Crowd Level</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-5">
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            How crowded is your current location? Your report helps other tourists stay safe.
          </p>
          
          <div className="space-y-3 mb-6">
            {levels.map((level) => (
              <button
                key={level.label}
                onClick={() => setSelectedLevel(level.value)}
                className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-colors ${
                  selectedLevel === level.value 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                    : 'border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full ${level.color} mr-3 shadow-sm`}></div>
                  <div className="text-left">
                    <div className={`font-semibold ${selectedLevel === level.value ? 'text-blue-700 dark:text-blue-400' : 'text-gray-900 dark:text-white'}`}>
                      {level.label}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{level.desc}</div>
                  </div>
                </div>
                {selectedLevel === level.value && <Check size={20} className="text-blue-600" />}
              </button>
            ))}
          </div>

          <button 
            onClick={handleSubmit}
            disabled={selectedLevel === null}
            className={`w-full py-3 rounded-xl font-bold text-white transition-colors ${
              selectedLevel === null 
                ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            Submit Report
          </button>
        </div>
      </div>
    </div>
  );
}

