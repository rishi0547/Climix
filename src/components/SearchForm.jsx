import React from "react";

const SearchForm = ({ city, setCity, fetchWeather, loading }) => {
  return (
    <form onSubmit={fetchWeather} className="flex gap-3 mb-8">
      <input
        type="text"
        placeholder="Enter city name..."
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 hover:bg-cyan-400 disabled:bg-blue-300 text-white font-semibold py-3 px-6 rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed shadow-md hover:shadow-lg"
      >
        {loading ? "Searching..." : "Search"}
      </button>
    </form>
  );
};

export default SearchForm;
