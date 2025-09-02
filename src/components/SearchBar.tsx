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
      className={`relative flex items-center w-full max-w-md mx-auto bg-cream-100 rounded-full shadow-pastel hover:shadow-xl border-2 border-peach-100 transition-all duration-300 kawaii-searchbar ${className}`}
      style={{ fontFamily: 'Poppins, Nunito, Quicksand, sans-serif' }}
    >
      {/* Kawaii sparkles accent */}
      <span className="absolute -top-4 left-4 text-xl opacity-60 animate-bounceSparkle select-none pointer-events-none">✨</span>
      <div 
        className="flex items-center justify-center p-2 text-peach-500 hover:text-brand-500 hover:scale-110 transition-all duration-200"
      >
        <span className="text-lg mr-1">🔍</span>
        <MagnifyingGlassIcon className="h-5 w-5" />
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
  className="w-full py-2 px-2 text-brand-700 bg-transparent outline-none placeholder:text-peach-400 placeholder:transition-all placeholder:duration-300 focus:placeholder:text-peach-300 font-medium text-lg focus:outline-none focus:ring-0"
        style={{ fontFamily: 'Poppins, Nunito, Quicksand, sans-serif' }}
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
      <button
        onClick={handleSearch}
        className="py-2 px-5 bg-gradient-to-r from-peach-300 via-brand-400 to-violet-400 text-white rounded-r-full font-bold text-lg shadow-pastel hover:from-peach-400 hover:to-violet-500 hover:scale-110 active:scale-95 hover:shadow-xl transition-all duration-300 accent-script"
        aria-label="Search"
        style={{ fontFamily: 'Pacifico, cursive' }}
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;
