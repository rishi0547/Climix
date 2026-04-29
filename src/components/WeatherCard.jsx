import React from "react";
import { Wind, Droplet, Thermometer, CloudRain, Sunrise, Sunset, Sun, Cloud, CloudSun, CloudSnow, CloudLightning, CloudFog } from "lucide-react";
import HourlyForecast from "./HourlyForecast";

const getWeatherIconLarge = (code) => {
  const size = 64;
  const strokeWidth = 1.2;
  if (code === 0 || code === 1) return <Sun size={size} strokeWidth={strokeWidth} className="text-yellow-400 drop-shadow-lg" />;
  if (code === 2) return <CloudSun size={size} strokeWidth={strokeWidth} className="text-yellow-300 drop-shadow-lg" />;
  if (code === 3) return <Cloud size={size} strokeWidth={strokeWidth} className="text-white/80 drop-shadow-lg" />;
  if (code === 45 || code === 48) return <CloudFog size={size} strokeWidth={strokeWidth} className="text-white/70 drop-shadow-lg" />;
  if (code >= 51 && code <= 65) return <CloudRain size={size} strokeWidth={strokeWidth} className="text-blue-300 drop-shadow-lg" />;
  if (code >= 71 && code <= 75) return <CloudSnow size={size} strokeWidth={strokeWidth} className="text-blue-200 drop-shadow-lg" />;
  if (code >= 95) return <CloudLightning size={size} strokeWidth={strokeWidth} className="text-yellow-300 drop-shadow-lg" />;
  return <CloudSun size={size} strokeWidth={strokeWidth} className="text-yellow-300 drop-shadow-lg" />;
};

const getWeatherDescription = (code) => {
  const descriptions = {
    0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
    45: "Fog", 48: "Depositing rime fog", 51: "Light drizzle", 53: "Moderate drizzle",
    55: "Dense drizzle", 61: "Slight rain", 63: "Moderate rain", 65: "Heavy rain",
    71: "Slight snow fall", 73: "Moderate snow fall", 75: "Heavy snow fall", 95: "Thunderstorm",
  };
  return descriptions[code] || "Clear";
};

const WeatherCard = ({ weather, unit, theme }) => {
  if (!weather) return null;

  const isDark = theme === "dark";

  const formatTemp = (temp) => {
    if (temp === undefined || temp === null) return "--";
    const value = unit === "F" ? Math.round((temp * 9) / 5 + 32) : Math.round(temp);
    const sign = value >= 0 ? "+" : "";
    return `${sign}${value}`;
  };

  const now = new Date();
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dateStr = `${dayNames[now.getDay()]} ${now.getDate()} ${monthNames[now.getMonth()]} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

  const weatherCode = weather.weathercode ?? 2;
  const desc = getWeatherDescription(weatherCode);

  const formatTime = (isoStr) => {
    if (!isoStr) return "--:--";
    const d = new Date(isoStr);
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  };

  const sunriseTime = weather.sunrise ? formatTime(weather.sunrise) : "4:59";
  const sunsetTime = weather.sunset ? formatTime(weather.sunset) : "20:47";

  return (
    <div className="w-full flex flex-col gap-8">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
        <div className="flex flex-col gap-1 lg:min-w-[320px]">
          <p className={`text-[15px] md:text-[17px] font-light tracking-wide mb-4 drop-shadow-sm ${isDark ? "text-white/80" : "text-gray-700"}`}>
            {dateStr}
          </p>

          <div className="flex items-center gap-5 mb-2">
            {getWeatherIconLarge(weatherCode)}
            <span className="text-[64px] md:text-[80px] lg:text-[90px] font-extralight tracking-tighter text-[#FACC15] drop-shadow-lg leading-none">
              {formatTemp(weather.temperature)}°{unit}
            </span>
          </div>

          <p className={`text-[17px] font-light mt-2 drop-shadow-sm ${isDark ? "text-white/90" : "text-gray-800"}`}>
            Feels like {formatTemp(weather.apparent_temperature ?? weather.temperature + 1)}°{unit}
          </p>

          <p className={`text-[13px] font-light mt-1 max-w-[320px] leading-relaxed ${isDark ? "text-white/60" : "text-gray-500"}`}>
            The whole day will be {desc.toLowerCase()}.{" "}
            {weather.precipitation_probability != null && weather.precipitation_probability > 5
              ? `Precipitation probability: ${weather.precipitation_probability}%`
              : "No precipitation."}
          </p>

          <div className={`mt-6 flex gap-6 text-[12px] font-light ${isDark ? "text-white/50" : "text-gray-500"}`}>
            <div className="flex items-center gap-1.5">
              <Sunrise size={14} strokeWidth={1.5} /> Sunrise: {sunriseTime}
            </div>
            <div className="flex items-center gap-1.5">
              <Sunset size={14} strokeWidth={1.5} /> Sunset: {sunsetTime}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:min-w-[220px] pt-2">
          <h3 className={`text-[12px] font-semibold tracking-[0.18em] uppercase mb-2 ${isDark ? "text-white/60" : "text-gray-500"}`}>
            More Details:
          </h3>
          <DetailRow icon={<Wind size={14} strokeWidth={1.5} />} label="Wind speed:" value={`${weather.windspeed} m/s`} isDark={isDark} />
          <DetailRow icon={<Droplet size={14} strokeWidth={1.5} />} label="Air humidity:" value={weather.humidity != null ? `${weather.humidity}%` : "42-76%"} isDark={isDark} />
          <DetailRow icon={<Thermometer size={14} strokeWidth={1.5} />} label="Pressure:" value={weather.pressure != null ? `${Math.round(weather.pressure)}hPa` : "747-749mm"} isDark={isDark} />
          <DetailRow icon={<CloudRain size={14} strokeWidth={1.5} />} label="Precipitation probability:" value={weather.precipitation_probability != null ? `${weather.precipitation_probability}%` : "2%"} isDark={isDark} />
        </div>

        <div className="flex-1 w-full lg:w-auto">
          <HourlyForecast hourly={weather.hourly} unit={unit} theme={theme} />
        </div>
      </div>
    </div>
  );
};

const DetailRow = ({ icon, label, value, isDark }) => (
  <div className={`flex justify-between items-center gap-4 pb-2.5 border-b text-[13px] ${isDark ? "border-white/[0.08]" : "border-gray-900/[0.08]"}`}>
    <span className={`flex items-center gap-2 font-light ${isDark ? "text-white/60" : "text-gray-600"}`}>
      {icon} {label}
    </span>
    <span className={`font-medium ${isDark ? "text-white/90" : "text-gray-900"}`}>
      {value}
    </span>
  </div>
);

export default WeatherCard;
