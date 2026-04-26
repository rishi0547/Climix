import React from "react";
import {
  Droplet,
  Wind,
  CloudRain,
  Sunrise,
  Sunset,
  Thermometer,
} from "lucide-react";

const WeatherCard = ({ weather }) => {
  if (!weather) return null;

  return (
    <div className="flex flex-col md:flex-row shadow-none gap-8 md:gap-16 items-center md:items-start pl-0 md:pl-8">
      <div className="flex flex-col items-center md:items-start tracking-wide">
        <h2 className="text-xl font-medium opacity-80 mb-2">
          {"Friday 27 July 15:00"} {/* Replace with dynamic date if needed */}
        </h2>
        <div className="flex items-center gap-6">
          <span className="text-6xl sm:text-7xl lg:text-8xl drop-shadow-md">
            🌤️
          </span>
          <div className="flex flex-col justify-center gap-1">
            <span className="text-6xl sm:text-7xl lg:text-8xl font-medium tracking-tighter text-[#FACC15] drop-shadow-md">
              +{weather.temperature}°C
            </span>
          </div>
        </div>
        <p className="text-xl font-light mt-4 mb-1">
          Feels like {weather.temperature + 1}°
        </p>
        <p className="text-sm font-light opacity-70">
          The whole day will be partly cloudy. No precipitation.
        </p>

        <div className="mt-8 flex gap-6 text-sm font-light opacity-60">
          <div className="flex items-center gap-2">
            <Sunrise size={16} /> Sunrise: 4:59
          </div>
          <div className="flex items-center gap-2">
            <Sunset size={16} /> Sunset: 20:47
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 pt-0 md:pt-4 border-t md:border-t-0 md:border-l border-current/20 mt-8 md:mt-0 pt-6 md:pt-0 md:pl-10 text-sm font-light">
        <h3 className="font-semibold text-base mb-2 tracking-widest opacity-90 uppercase">
          More Details:
        </h3>
        <div className="flex justify-between items-center gap-6 pb-2 border-b border-current/10">
          <span className="flex items-center gap-2 opacity-80">
            <Wind size={16} /> Wind speed:
          </span>
          <span className="font-medium">{weather.windspeed} m/s</span>
        </div>
        <div className="flex justify-between items-center gap-6 pb-2 border-b border-current/10">
          <span className="flex items-center gap-2 opacity-80">
            <Droplet size={16} /> Air humidity:
          </span>
          <span className="font-medium">42-76%</span>
        </div>
        <div className="flex justify-between items-center gap-6 pb-2 border-b border-current/10">
          <span className="flex items-center gap-2 opacity-80">
            <Thermometer size={16} /> Pressure:
          </span>
          <span className="font-medium">747-749mm</span>
        </div>
        <div className="flex justify-between items-center gap-6 pb-2">
          <span className="flex items-center gap-2 opacity-80">
            <CloudRain size={16} /> Precipitation probability:
          </span>
          <span className="font-medium">2%</span>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
