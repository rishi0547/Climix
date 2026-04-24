import React from "react";

const LocationButton = ({ getLocationWeather, loading }) => {
  return (
    <button
      type="button"
      onClick={getLocationWeather}
      disabled={loading}
      className="w-full mb-8 bg-indigo-500 hover:bg-indigo-400 disabled:bg-indigo-300 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md hover:shadow-lg flex justify-center items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
    >
      📍 Use Current Location
    </button>
  );
};

export default LocationButton;
