import React from "react";

const weatherDescriptions = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Depositing rime fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  71: "Slight snow fall",
  73: "Moderate snow fall",
  75: "Heavy snow fall",
  95: "Thunderstorm",
};

const getWeatherIcon = (code) => {
  if (code === 0 || code === 1) return "☀️";
  if (code === 2 || code === 3) return "⛅";
  if (code === 45 || code === 48) return "🌫️";
  if (code >= 51 && code <= 65) return "🌧️";
  if (code >= 71 && code <= 75) return "❄️";
  if (code >= 95) return "⛈️";
  return "🌤️";
};

const Forecast = ({ daily }) => {
  if (!daily || !daily.time) return null;

  // Get the next 5 days (excluding today which could be index 0)
  const next5Days = [];
  for (let i = 1; i <= 5; i++) {
    if (daily.time[i]) {
      next5Days.push({
        date: new Date(daily.time[i]),
        maxTemp: daily.temperature_2m_max[i],
        minTemp: daily.temperature_2m_min[i],
        code: daily.weathercode[i],
      });
    }
  }

  return (
    <div className="mt-8 border-t border-gray-200 pt-6">
      <h3 className="text-xl font-semibold text-gray-700 mb-4 text-left">
        5-Day Forecast
      </h3>
      <div className="flex justify-between items-center overflow-x-auto gap-4 pb-2">
        {next5Days.map((day, index) => (
          <div
            key={index}
            className="flex flex-col items-center bg-gray-50 rounded-xl p-3 min-w-[80px] shadow-sm"
          >
            <span className="text-sm font-medium text-gray-500 uppercase">
              {day.date.toLocaleDateString("en-US", { weekday: "short" })}
            </span>
            <span className="text-xs text-gray-400 mb-2">
              {day.date.toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
              })}
            </span>
            <span className="text-3xl mb-2">{getWeatherIcon(day.code)}</span>
            <span className="text-sm font-bold text-gray-700 mb-1">
              {Math.round(day.maxTemp)}°
            </span>
            <span className="text-xs font-medium text-gray-400">
              {Math.round(day.minTemp)}°
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Forecast;
