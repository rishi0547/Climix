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
      className="min-h-screen flex flex-col items-center justify-center p-4 font-sans bg-cover bg-center transition-all duration-500 ease-in-out"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="w-full max-w-4xl flex justify-end mb-4">
        <button
          onClick={toggleTheme}
          className="p-3 rounded-full bg-white/20 backdrop-blur-md shadow-lg border border-white/30 text-2xl hover:bg-white/30 transition-colors"
          title={`Switch to ${isDark ? "light" : "dark"} mode`}
        >
          {isDark ? "☀️" : "🌙"}
        </button>
      </div>

      <div
        className={`backdrop-blur-md rounded-2xl p-8 w-full max-w-md shadow-2xl text-center transition-colors duration-500 ${isDark ? "bg-gray-900/80 text-white" : "bg-white/85 text-gray-800"}`}
      >
        <h1
          className={`text-3xl font-extrabold mb-6 drop-shadow-sm ${isDark ? "text-white" : "text-gray-800"}`}
        >
          CLIMIX
        </h1>

        <SearchForm
          city={city}
          setCity={setCity}
          fetchWeather={fetchWeather}
          loading={loading}
        />

        <LocationButton
          getLocationWeather={getLocationWeather}
          loading={loading}
        />

        <RecentSearches searchHistory={searchHistory} getWeather={getWeather} />

        <ErrorMessage error={error} />

        <WeatherCard weather={weather} />
        {weather && weather.daily && <Forecast daily={weather.daily} />}
      </div>
    </div>
  );
};

export default App;
