import React, { useState, useEffect } from "react";
import SearchForm from "./components/SearchForm";
import LocationButton from "./components/LocationButton";
import RecentSearches from "./components/RecentSearches";
import WeatherCard from "./components/WeatherCard";
import ErrorMessage from "./components/ErrorMessage";

const App = () => {
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
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`,
      );
      const weatherData = await weatherRes.json();

      setWeather({
        name,
        country,
        temperature: weatherData.current_weather.temperature,
        windspeed: weatherData.current_weather.windspeed,
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
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`,
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-400 to-indigo-400 p-4 font-sans">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 w-full max-w-md shadow-2xl text-center">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-6 drop-shadow-sm">
          Weather App
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
      </div>
    </div>
  );
};

export default App;
