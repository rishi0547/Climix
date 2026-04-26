import React from "react";
import {
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudFog,
  CloudSun,
  Moon,
} from "lucide-react";

const getHourlyIcon = (code, hour) => {
  const isNight = hour < 6 || hour >= 21;
  const size = 20;
  const strokeWidth = 1.5;

  if (code === 0 || code === 1) {
    return isNight
      ? <Moon size={size} strokeWidth={strokeWidth} className="text-yellow-200" />
      : <Sun size={size} strokeWidth={strokeWidth} className="text-yellow-400" />;
  }
  if (code === 2) return <CloudSun size={size} strokeWidth={strokeWidth} className="text-yellow-300/80" />;
  if (code === 3) return <Cloud size={size} strokeWidth={strokeWidth} className="text-white/70" />;
  if (code === 45 || code === 48) return <CloudFog size={size} strokeWidth={strokeWidth} className="text-white/60" />;
  if (code >= 51 && code <= 65) return <CloudRain size={size} strokeWidth={strokeWidth} className="text-blue-300" />;
  if (code >= 71 && code <= 75) return <CloudSnow size={size} strokeWidth={strokeWidth} className="text-blue-200" />;
  if (code >= 95) return <CloudLightning size={size} strokeWidth={strokeWidth} className="text-yellow-300" />;
  return <CloudSun size={size} strokeWidth={strokeWidth} className="text-yellow-300/80" />;
};

const PERIODS = [
  { label: "NIGHT", hours: [0, 3] },
  { label: "MORNING", hours: [6, 9] },
  { label: "DAY", hours: [12, 15] },
  { label: "EVENING", hours: [18, 21] },
];

const HourlyForecast = ({ hourly, unit, theme }) => {
  if (!hourly || !hourly.time) return null;

  const isDark = theme === "dark";

  const today = new Date().toISOString().split("T")[0];

  const hourLookup = {};
  hourly.time.forEach((t, i) => {
    if (t.startsWith(today)) {
      const hour = new Date(t).getHours();
      hourLookup[hour] = {
        temp: hourly.temperature_2m[i],
        code: hourly.weathercode[i],
      };
    }
  });

  const formatTemp = (temp) => {
    if (temp === undefined || temp === null) return "--";
    const value = unit === "F" ? Math.round((temp * 9) / 5 + 32) : Math.round(temp);
    return `+${value}°`;
  };

  return (
    <div className={`backdrop-blur-md border rounded-2xl p-4 md:p-5 w-full ${
      isDark
        ? "bg-white/[0.07] border-white/[0.12]"
        : "bg-white/40 border-white/60 shadow-lg"
    }`}>
      {/* Period Headers */}
      <div className="grid grid-cols-4 mb-3">
        {PERIODS.map((period) => (
          <div key={period.label} className="text-center">
            <span className={`text-[10px] md:text-[11px] font-semibold tracking-[0.15em] uppercase ${
              isDark ? "text-white/40" : "text-gray-900/50"
            }`}>
              {period.label}
            </span>
          </div>
        ))}
      </div>

      {/* Hourly Data */}
      <div className="grid grid-cols-4">
        {PERIODS.map((period) => (
          <div key={period.label} className="flex justify-center gap-3 md:gap-5">
            {period.hours.map((hour) => {
              const data = hourLookup[hour];
              return (
                <div key={hour} className="flex flex-col items-center gap-1.5 py-2">
                  {data ? getHourlyIcon(data.code, hour) : <Cloud size={20} strokeWidth={1.5} className={isDark ? "text-white/30" : "text-gray-400"} />}
                  <span className={`text-[13px] md:text-[14px] font-medium mt-0.5 ${isDark ? "text-white" : "text-gray-900"}`}>
                    {data ? formatTemp(data.temp) : "--"}
                  </span>
                  <span className={`text-[10px] font-light ${isDark ? "text-white/40" : "text-gray-900/50"}`}>
                    {String(hour).padStart(2, "0")}:00
                  </span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HourlyForecast;
