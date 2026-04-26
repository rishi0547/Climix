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
      className={`min-h-screen flex flex-col items-center p-4 font-sans bg-cover bg-center transition-all duration-500 ease-in-out ${isDark ? "text-white" : "text-black"}`}
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="w-full max-w-7xl flex justify-between items-center mb-8 px-4 pt-4">
        <div className="flex items-center gap-4">
          <h1 className="text-xl md:text-2xl font-bold tracking-[0.1em] drop-shadow-sm uppercase">
            CLIMIX
          </h1>
          {weather && (
            <div className="flex items-center text-sm md:text-base opacity-80 pl-4 ml-2">
              <span className="mr-2 opacity-70">📍</span> Weather in{" "}
              <span className="font-bold ml-1">{weather.name}</span>{" "}
              <span className="mx-1 opacity-50">/</span> {weather.country}
            </div>
          )}
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 cursor-pointer tracking-widest hover:opacity-80 transition-opacity">
            <span className="text-[13px] font-semibold uppercase">MENU</span>
          </div>
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full backdrop-blur-md border text-lg transition-colors ${
              isDark
                ? "bg-white/10 border-white/20 hover:bg-white/20"
                : "bg-black/10 border-black/20 hover:bg-black/20"
            }`}
            title={`Switch to ${isDark ? "light" : "dark"} mode`}
          >
            {isDark ? "☀️" : "🌙"}
          </button>
        </div>
      </div>

      <div className="w-full max-w-7xl flex-grow flex flex-col justify-end pb-8">
        <div
          className={`backdrop-blur-xl rounded-3xl p-6 md:p-12 w-full shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] transition-colors duration-500 border ${
            isDark
              ? "bg-white/5 border-white/10 text-white"
              : "bg-white/30 border-white/40 text-black"
          } mb-12 flex flex-col md:flex-row md:items-start gap-8`}
        >
          <div className="w-full md:w-1/4 border-b md:border-b-0 md:border-r border-current/10 pb-6 md:pb-0 md:pr-8">
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
            <RecentSearches
              searchHistory={searchHistory}
              getWeather={getWeather}
            />
            <ErrorMessage error={error} />
          </div>

          <div className="w-full md:w-3/4 flex flex-col justify-between h-full">
            <WeatherCard weather={weather} />
          </div>
        </div>

        {weather && weather.daily && <Forecast daily={weather.daily} />}
      </div>
    </div>
  );
};

export default App;
