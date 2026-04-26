import React, { useState, useEffect, useContext } from "react";
import SearchForm from "./components/SearchForm";
import LocationButton from "./components/LocationButton";
import RecentSearches from "./components/RecentSearches";
import WeatherCard from "./components/WeatherCard";
import ErrorMessage from "./components/ErrorMessage";
import Forecast from "./components/Forecast";
import { ThemeContext } from "./context/ThemeContext";

import lightBg from "./asset/light-bg-img.jpg";
import darkBg from "./asset/dark-bg-img.jpg";

const App = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchHistory, setSearchHistory] = useState([]);

  // Load search history from local storage when the component mounts
  useEffect(() => {
    const history = JSON.parse(localStorage.getItem("cities")) || [];
    setSearchHistory(history);
  }, []);

  const saveCity = (cityName) => {
    let history = JSON.parse(localStorage.getItem("cities")) || [];

    // Remove if it already exists so we can add it to the front
    history = history.filter((c) => c.toLowerCase() !== cityName.toLowerCase());

    // Add to the front of the array
    history.unshift(cityName);

    // Keep only the last 5 searches
    history = history.slice(0, 5);

    localStorage.setItem("cities", JSON.stringify(history));
    setSearchHistory(history);
  };

  const getWeather = async (cityName) => {
    if (!cityName.trim()) return;

    setLoading(true);
    setError("");
    setWeather(null);
    setCity(cityName); // Update the input field

    try {
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1`,
      );
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        throw new Error("City not found");
      }

      const { latitude, longitude, name, country } = geoData.results[0];

      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`,
      );
      const weatherData = await weatherRes.json();

      setWeather({
        name,
        country,
        temperature: weatherData.current_weather.temperature,
        windspeed: weatherData.current_weather.windspeed,
        daily: weatherData.daily,
      });

      // Save valid searches to history
      saveCity(name);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeather = (e) => {
    e.preventDefault();
    getWeather(city);
  };

  const getLocationWeather = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    setLoading(true);
    setError("");
    setWeather(null);
    setCity("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // 1. Get weather for current coordinates
          const weatherRes = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`,
          );
          const weatherData = await weatherRes.json();

          // 2. Get city name corresponding to coordinates (free reverse geocoding API)
          const locationRes = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
          );
          const locationData = await locationRes.json();

          setWeather({
            name: locationData.city || locationData.locality || "Your Location",
            country: locationData.countryCode || "",
            temperature: weatherData.current_weather.temperature,
            windspeed: weatherData.current_weather.windspeed,
            daily: weatherData.daily,
          });

          // Optional: Only save location if it actually resolved to a real city name
          if (locationData.city || locationData.locality) {
            saveCity(locationData.city || locationData.locality);
          }
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setError(
          "Unable to retrieve your location. Please allow location access.",
        );
        setLoading(false);
      },
    );
  };

  const bgImage = theme === "dark" ? darkBg : lightBg;
  const isDark = theme === "dark";

  return (
    <div
      className={`min-h-screen flex flex-col items-center p-4 font-sans bg-cover bg-center transition-all duration-500 ease-in-out ${isDark ? "text-white" : "text-gray-900"}`}
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="w-full max-w-6xl w-full flex justify-between items-center mb-8 px-4 pt-4">
        <div className="flex items-center gap-4">
          <h1 className="text-xl md:text-2xl font-bold tracking-widest drop-shadow-sm uppercase">
            SYNOPTIC
          </h1>
          {weather && (
            <div className="flex items-center text-sm md:text-base opacity-80 border-l border-current pl-4 ml-2">
              <span className="mr-1">📍</span> Weather in <span className="font-semibold ml-1">{weather.name}</span> <span className="mx-1">/</span> {weather.country}
            </div>
          )}
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex text-sm tracking-widest font-semibold opacity-80 cursor-pointer">
            °C <span className="mx-2 opacity-50">|</span> <span className="opacity-50">°F</span>
          </div>
          <div className="flex items-center gap-2 cursor-pointer">
            <span className="text-sm font-semibold tracking-widest">MENU</span>
          </div>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-lg hover:bg-white/20 transition-colors"
            title={`Switch to ${isDark ? "light" : "dark"} mode`}
          >
            {isDark ? "☀️" : "🌙"}
          </button>
        </div>
      </div>

      <div className="w-full max-w-6xl flex-grow flex flex-col justify-end pb-8">
        <div
          className={`backdrop-blur-md rounded-3xl p-6 md:p-10 w-full shadow-2xl transition-colors duration-500 ${isDark ? "bg-gray-950/40 text-gray-100" : "bg-white/40 text-gray-900"} mb-12 flex flex-col md:flex-row md:items-start gap-8`}
        >
          <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-current/10 pb-6 md:pb-0 md:pr-6">
            <SearchForm
              city={city}
              setCity={setCity}
              fetchWeather={fetchWeather}
              loading={loading}
            />
            <div className="mt-4">
              <LocationButton
                getLocationWeather={getLocationWeather}
                loading={loading}
              />
            </div>
            <RecentSearches searchHistory={searchHistory} getWeather={getWeather} />
            <ErrorMessage error={error} />
          </div>

          <div className="w-full md:w-2/3 flex flex-col justify-between h-full">
            <WeatherCard weather={weather} />
          </div>
        </div>

        {weather && weather.daily && <Forecast daily={weather.daily} />}
      </div>
    </div>
  );
};

export default App;
