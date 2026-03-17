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
      className={`relative flex items-center w-full max-w-xl mx-auto bg-minimalist-sky/60 backdrop-blur-sm rounded-2xl shadow-delicate ${className}`}
    >
      <div
        className="flex items-center justify-center p-2 text-minimalist-slate/60"
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
        className="w-full py-2 px-2 text-minimalist-slate bg-transparent outline-none border-0 focus:border-0 focus:ring-0 placeholder:text-minimalist-slate/50 placeholder:transition-colors placeholder:duration-200 focus:placeholder:text-minimalist-slate/40 font-medium text-base focus:outline-none"
        autoComplete="off"
      />
      {searchVal && (
        <span
          className="animate-scaleIn"
        >
          <button
            onClick={handleClear}
            className="p-1 mr-1 text-minimalist-slate/50 active:opacity-80 transition-opacity duration-150"
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
