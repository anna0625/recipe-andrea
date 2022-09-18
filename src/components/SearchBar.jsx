import React from "react";

export const SearchBar = () => {
  return (
    <>
      <div className="my-6 flex rounded-md shadow-sm">
        <div className="relative flex flex-grow items-stretch focus-within:z-10">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            {/* <!-- Heroicon name: mini/users --> */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="#f5cac3"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </div>
          <input
            type="email"
            name="email"
            id="email"
            className="block w-full rounded-none rounded-l-md focus:outline-none focus:ring-2 border-theme-3 pl-10 focus:border-theme-1 focus:ring-theme-1 sm:text-sm text-theme-4 placeholder:text-theme-4 bg-theme-2 shadow-sm"
            placeholder="John Smith"
          />
        </div>
        <button
          type="button"
          className="relative -ml-px inline-flex items-center space-x-2 rounded-r-md border border-theme-4 bg-theme-3/50 px-4 py-2 text-sm font-medium text-theme-4 hover:bg-theme-2 focus:border-theme-4 focus:outline-none focus:ring-2 focus:ring-theme-4 shadow-sm"
        >
          {/* <!-- Heroicon name: mini/bars-arrow-up --> */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>

          <span>Search</span>
        </button>
      </div>
    </>
  );
};
