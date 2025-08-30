import React, { useState, useRef, useEffect } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = 'Search...',
  className = '',
}) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleClear = () => {
    setQuery('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div 
      className={`relative flex items-center w-full max-w-md mx-auto bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 ${isFocused ? 'ring-2 ring-brand-500' : ''} ${className}`}
    >
      <div 
        className="flex items-center justify-center p-2 text-gray-400 hover:text-brand-500 hover:scale-110 transition-all duration-200"
      >
        <MagnifyingGlassIcon className="h-5 w-5" />
      </div>
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className="w-full py-2 px-1 text-gray-700 bg-transparent outline-none placeholder:text-gray-400 placeholder:transition-all placeholder:duration-300 focus:placeholder:text-gray-300"
      />
      {query && (
        <span 
          className="animate-scaleIn"
        >
          <button
            onClick={handleClear}
            className="p-1 mr-1 text-gray-400 hover:text-gray-600 hover:scale-110 active:scale-90 transition-all duration-200"
            aria-label="Clear search"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </span>
      )}
      <button
        onClick={handleSearch}
        className="py-2 px-4 bg-gradient-to-r from-brand-500 to-violet-500 text-white rounded-r-full hover:from-brand-600 hover:to-violet-600 hover:scale-105 active:scale-95 hover:shadow-xl transition-all duration-300"
        aria-label="Search"
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;
