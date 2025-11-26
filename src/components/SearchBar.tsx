import React, { useRef } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface SearchBarProps {
  searchVal: string;
  setSearchVal: (val: string) => void;
  handleSearch: () => void;
  totalRecipes: number;
  placeholder?: string;
  className?: string;
}


const SearchBar: React.FC<SearchBarProps> = ({
  searchVal,
  setSearchVal,
  handleSearch,
  totalRecipes,
  placeholder = 'Search...',
  className = '',
}) => {
  const [isFocused, setIsFocused] = React.useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = () => {
    setSearchVal('');
    handleSearch();
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
      className={`relative flex items-center w-full max-w-xl mx-auto bg-white/90 backdrop-blur-sm rounded-2xl shadow-md hover:shadow-lg border border-gray-300 transition-all duration-300 ${className}`}
      style={{ fontFamily: 'Poppins, Nunito, Quicksand, sans-serif' }}
    >
      <div
        className="flex items-center justify-center p-2 text-gray-500 hover:text-gray-700 transition-all duration-200"
      >
        <MagnifyingGlassIcon className="h-4 w-4" />
      </div>
      <input
        ref={inputRef}
        type="text"
        value={searchVal}
        onChange={(e) => {
          setSearchVal(e.target.value);
          handleSearch();
        }}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className="w-full py-2 px-2 text-coquette-rose bg-transparent outline-none placeholder:text-coquette-lavender/60 placeholder:transition-all placeholder:duration-300 focus:placeholder:text-coquette-lavender font-medium text-lg focus:outline-none focus:ring-0"
        style={{ fontFamily: 'Poppins, Nunito, Quicksand, sans-serif' }}
        autoComplete="off"
      />
      {searchVal && (
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
    </div>
  );
};

export default SearchBar;
