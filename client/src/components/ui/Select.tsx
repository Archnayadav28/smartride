import React, { SelectHTMLAttributes, useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label: string;
  options: Option[];
  error?: string;
  searchable?: boolean;
  value?: string;
  onChange?: (e: any) => void;
  name?: string;
}

export default function Select({ 
  label, 
  options, 
  error, 
  searchable = false, 
  className = '', 
  id, 
  value,
  onChange,
  name,
  ...props 
}: SelectProps) {
  const selectId = id || label.toLowerCase().replace(/\s+/g, '-');
  
  const triggerChange = (newValue: string) => {
    if (onChange) {
      onChange({
        target: {
          name: name || '',
          value: newValue
        }
      });
    }
  };

  if (!searchable) {
    return (
      <div className="w-full">
        <label htmlFor={selectId} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
        <div className="relative">
          <select
            id={selectId}
            value={value}
            name={name}
            onChange={(e) => triggerChange(e.target.value)}
            className={`block w-full rounded-lg border appearance-none ${
              error 
                ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500 dark:border-red-700' 
                : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white'
            } pl-4 pr-10 py-3 sm:text-sm bg-white transition-colors ${className}`}
            {...props}
          >
            <option value="" disabled hidden>Select {label}</option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
            <ChevronDown size={16} />
          </div>
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>
    );
  }

  // Custom searchable dropdown
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  
  const selectedOption = options.find(opt => opt.value === value);

  const filteredOptions = options.filter(opt => 
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="w-full" ref={containerRef}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      <div className="relative">
        <div 
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center justify-between w-full rounded-lg border cursor-pointer ${
            error 
              ? 'border-red-300 focus:ring-red-500 focus:border-red-500 dark:border-red-700' 
              : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:border-gray-600 dark:bg-gray-800'
          } px-4 py-3 sm:text-sm bg-white transition-colors ${className}`}
        >
          <span className={`block truncate ${!selectedOption ? 'text-gray-500' : 'text-gray-900 dark:text-white'}`}>
            {selectedOption ? selectedOption.label : `Select ${label}`}
          </span>
          <ChevronDown size={16} className="text-gray-500" />
        </div>
        
        {/* We keep a hidden input to satisfy form required constraints if used in standard forms */}
        <input 
          type="hidden" 
          name={name} 
          value={value || ''} 
          {...(props as any)} 
        />

        {isOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto sm:text-sm">
            <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 px-3 py-2 border-b border-gray-100 dark:border-gray-700">
              <input
                type="text"
                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-2 text-gray-500 dark:text-gray-400 text-center">No results found</div>
            ) : (
              filteredOptions.map((opt) => (
                <div
                  key={opt.value}
                  className={`cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-primary-50 dark:hover:bg-primary-900/30 ${
                    value === opt.value ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/20 dark:text-primary-400 font-medium' : 'text-gray-900 dark:text-gray-200'
                  }`}
                  onClick={() => {
                    triggerChange(opt.value);
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                >
                  <span className="block truncate">{opt.label}</span>
                  {value === opt.value && (
                    <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-primary-600 dark:text-primary-400">
                      <Check size={16} />
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
