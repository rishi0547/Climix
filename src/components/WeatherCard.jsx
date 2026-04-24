import React from "react";

const WeatherCard = ({ weather }) => {
  if (!weather) return null;

  return (
    <div className="bg-gray-50 rounded-xl p-6 shadow-inner border border-gray-100 mt-2">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {weather.name}, {weather.country}
      </h2>
      <div className="flex justify-around items-center">
        <div className="flex flex-col gap-1 items-center">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Temperature
          </span>
          <span className="text-3xl font-black text-indigo-500">
            {weather.temperature}°C
          </span>
        </div>
        <div className="w-px h-12 bg-gray-200"></div>
        <div className="flex flex-col gap-1 items-center">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Wind Speed
          </span>
          <span className="text-3xl font-black text-teal-500">
            {weather.windspeed} <span className="text-lg">km/h</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
