import React, { useState } from "react";
import { Sun, Cloud, CloudSun, CloudRain, CloudSnow, CloudLightning, CloudFog } from "lucide-react";

const weatherDescriptions = {
  0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
  45: "Fog", 48: "Rime fog", 51: "Light drizzle", 53: "Moderate drizzle",
  55: "Dense drizzle", 61: "Slight rain", 63: "Moderate rain", 65: "Heavy rain",
  71: "Slight snow", 73: "Moderate snow", 75: "Heavy snow", 95: "Thunderstorm",
};

const getWeatherIcon = (code) => {
  const size = 28;
  const strokeWidth = 1.3;
  if (code === 0 || code === 1) return <Sun size={size} strokeWidth={strokeWidth} className="text-yellow-400" />;
  if (code === 2) return <CloudSun size={size} strokeWidth={strokeWidth} className="text-yellow-300/80" />;
  if (code === 3) return <Cloud size={size} strokeWidth={strokeWidth} className="text-white/70" />;
  if (code === 45 || code === 48) return <CloudFog size={size} strokeWidth={strokeWidth} className="text-white/60" />;
  if (code >= 51 && code <= 65) return <CloudRain size={size} strokeWidth={strokeWidth} className="text-blue-300" />;
  if (code >= 71 && code <= 75) return <CloudSnow size={size} strokeWidth={strokeWidth} className="text-blue-200" />;
  if (code >= 95) return <CloudLightning size={size} strokeWidth={strokeWidth} className="text-yellow-300" />;
  return <CloudSun size={size} strokeWidth={strokeWidth} className="text-yellow-300/80" />;
};

const Forecast = ({ daily, unit, theme }) => {
  const [showAll, setShowAll] = useState(false);
  const isDark = theme === "dark";

  if (!daily || !daily.time) return null;

  const dayCount = showAll ? Math.min(daily.time.length, 10) : Math.min(daily.time.length, 7);
  const days = [];

  for (let i = 0; i < dayCount; i++) {
    if (daily.time[i]) {
      days.push({
        date: new Date(daily.time[i]),
        maxTemp: daily.temperature_2m_max[i],
        minTemp: daily.temperature_2m_min[i],
        code: daily.weathercode[i],
      });
    }
  }

  const formatTemp = (temp) => {
    if (temp === undefined || temp === null) return "--";
    const value = unit === "F" ? Math.round((temp * 9) / 5 + 32) : Math.round(temp);
    const sign = value >= 0 ? "+" : "";
    return `${sign}${value}°`;
  };

  return (
    <div className="w-full drop-shadow-md">
      <div className={`flex justify-between items-center border-b pb-3 mb-6 px-2 ${isDark ? "border-white/15" : "border-gray-900/10"}`}>
        <div className="flex items-center gap-6">
          <span className="text-[#FACC15] text-[11px] font-semibold tracking-[0.18em] uppercase border-b-2 border-[#FACC15] pb-2.5 cursor-pointer">
            TODAY
          </span>
        </div>
        <button
          onClick={() => setShowAll(!showAll)}
          className={`text-[11px] font-medium uppercase tracking-[0.15em] cursor-pointer transition-colors ${isDark ? "text-white/70 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}
        >
          {showAll ? "SHOW LESS" : "SHOW FOR 10 DAYS"}
        </button>
      </div>

      <div className="flex gap-2 md:gap-4 overflow-x-auto hide-scrollbar pb-4 px-2">
        {days.map((day, index) => (
          <div
            key={index}
            className={`flex flex-col items-center justify-between text-center min-w-[100px] md:min-w-[120px] flex-shrink-0 py-4 px-3 rounded-xl transition-all cursor-default group ${isDark ? "hover:bg-white/[0.05]" : "hover:bg-black/[0.03]"}`}
          >
            <span className={`text-[12px] font-bold tracking-[0.1em] uppercase mb-1 ${isDark ? "text-white/90" : "text-gray-900"}`}>
              {day.date.toLocaleDateString("en-US", { weekday: "long" }).toUpperCase()}
            </span>
            <span className={`text-[11px] font-light mb-4 ${isDark ? "text-white/50" : "text-gray-500"}`}>
              {day.date.toLocaleDateString("en-US", { day: "numeric", month: "short" })}
            </span>
            <div className={`flex flex-col text-[11px] font-medium tracking-wide mb-4 gap-0.5 ${isDark ? "text-white/70" : "text-gray-600"}`}>
              <span>min <span className={isDark ? "text-white/90" : "text-gray-900"}>{formatTemp(day.minTemp)}</span></span>
              <span>max <span className={isDark ? "text-white/90" : "text-gray-900"}>{formatTemp(day.maxTemp)}</span></span>
            </div>
            <div className="mb-3 group-hover:scale-110 transition-transform">
              {getWeatherIcon(day.code)}
            </div>
            <span className={`text-[10px] font-light capitalize leading-tight max-w-[80px] ${isDark ? "text-white/50" : "text-gray-500"}`}>
              {weatherDescriptions[day.code] || "Clear"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Forecast;
