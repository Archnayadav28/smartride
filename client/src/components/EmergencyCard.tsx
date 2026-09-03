import React from 'react';
import { Phone, AlertTriangle } from 'lucide-react';

interface EmergencyCardProps {
  service: string;
  number: string;
  description: string;
}

export default function EmergencyCard({ service, number, description }: EmergencyCardProps) {
  return (
    <div className="bg-red-50 dark:bg-red-900/10 rounded-xl p-5 border border-red-100 dark:border-red-900/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-start space-x-3">
        <div className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg shrink-0 mt-1 sm:mt-0">
          <AlertTriangle size={24} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-red-700 dark:text-red-400">{service}</h3>
          <p className="text-sm text-red-600/80 dark:text-red-300/80 mb-1">{description}</p>
          <div className="text-xs text-red-500/70 dark:text-red-400/60 flex items-center">
            * Calling requires device support
          </div>
        </div>
      </div>
      
      <a 
        href={`tel:${number}`}
        className="flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg font-bold transition-colors w-full sm:w-auto shrink-0"
      >
        <Phone size={18} />
        <span>{number}</span>
      </a>
    </div>
  );
}
