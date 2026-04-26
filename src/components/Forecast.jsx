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
    <div className="w-full mt-10 md:mt-24 opacity-100 transition-all duration-300 drop-shadow-md">
      <div className="flex flex-col border-b border-current/30 pb-4 mb-4">
        <div className="flex justify-between items-center px-4 w-full">
          <div className="flex items-center gap-6">
            <span className="text-[#FACC15] text-xs font-semibold tracking-widest uppercase border-b-2 border-[#FACC15] pb-2 cursor-pointer transition-colors hover:text-[#e5b206] px-1 drop-shadow-sm">
              TODAY
            </span>
          </div>
          <span className="text-xs font-medium uppercase tracking-widest cursor-pointer border-b border-transparent hover:border-current transition-colors opacity-90">
            SHOW FOR 10 DAYS
          </span>
        </div>
      </div>

      <div className="flex justify-between items-center overflow-x-auto gap-4 pt-6 px-4 md:px-12 w-full pb-4">
        {next5Days.map((day, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-between text-center min-w-[80px] hover:scale-105 transition-transform duration-300"
          >
            <div className="flex flex-col text-center uppercase tracking-wider mb-6">
              <span className="text-sm font-bold opacity-100 mb-1">
                {day.date.toLocaleDateString("en-US", { weekday: "short" })}
              </span>
              <span className="text-xs font-medium opacity-80">
                {day.date.toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                })}
              </span>
            </div>

            <div className="flex flex-col text-xs font-semibold tracking-wide mb-8 opacity-90">
              <span>
                min{" "}
                <span className="opacity-100">{Math.round(day.minTemp)}°</span>
              </span>
              <span>
                max{" "}
                <span className="opacity-100">{Math.round(day.maxTemp)}°</span>
              </span>
            </div>

            <span className="text-4xl mb-4 drop-shadow-lg">
              {getWeatherIcon(day.code)}
            </span>

            <span className="text-xs font-medium opacity-80 capitalize max-w-[70px] text-center leading-tight">
              {weatherDescriptions[day.code] || "Clear"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Forecast;
