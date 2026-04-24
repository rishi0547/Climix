import React from "react";

const RecentSearches = ({ searchHistory, getWeather }) => {
  if (searchHistory.length === 0) return null;

  return (
    <div className="mb-6 text-left">
      <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
        Recent Searches
      </h3>
      <div className="flex flex-wrap gap-2">
        {searchHistory.map((historyCity, index) => (
          <button
            key={index}
            type="button"
            onClick={() => getWeather(historyCity)}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm py-1.5 px-3 rounded-full transition-colors cursor-pointer border border-gray-200 shadow-sm"
          >
            {historyCity}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RecentSearches;
