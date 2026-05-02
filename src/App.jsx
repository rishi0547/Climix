import React, { useState, useContext } from "react";
import Header from "./components/Header";
import WeatherCard from "./components/WeatherCard";
import Forecast from "./components/Forecast";
import ErrorMessage from "./components/ErrorMessage";
import { ThemeContext } from "./context/ThemeContext";

import darkBg from "./asset/dark-bg-img.jpg";
import lightBg from "./asset/light-bg-img.jpg";

const App = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchHistory, setSearchHistory] = useState(() => {
    return JSON.parse(localStorage.getItem("cities")) || [];
  });
  const [unit, setUnit] = useState("C");

  const isDark = theme === "dark";

  const saveCity = (cityName) => {
    let history = JSON.parse(localStorage.getItem("cities")) || [];
    history = history.filter((c) => c.toLowerCase() !== cityName.toLowerCase());
    history.unshift(cityName);
    history = history.slice(0, 5);
    localStorage.setItem("cities", JSON.stringify(history));
    setSearchHistory(history);
  };

  const getWeather = async (cityName) => {
    if (!cityName.trim()) return;

    setLoading(true);
    setError("");
    setWeather(null);
    setCity(cityName);

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
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
          `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weathercode,surface_pressure,windspeed_10m,precipitation` +
          `&hourly=temperature_2m,weathercode` +
          `&daily=temperature_2m_max,temperature_2m_min,weathercode,sunrise,sunset,precipitation_probability_max,windspeed_10m_max` +
          `&timezone=auto&forecast_days=10`,
      );
      const weatherData = await weatherRes.json();

      const current = weatherData.current || {};

      setWeather({
        name,
        country,
        temperature: current.temperature_2m ?? current.temperature ?? 0,
        windspeed: current.windspeed_10m ?? current.windspeed ?? 0,
        humidity: current.relative_humidity_2m ?? null,
        pressure: current.surface_pressure ?? null,
        apparent_temperature: current.apparent_temperature ?? null,
        weathercode: current.weathercode ?? 2,
        precipitation_probability:
          weatherData.daily?.precipitation_probability_max?.[0] ?? null,
        sunrise: weatherData.daily?.sunrise?.[0] ?? null,
        sunset: weatherData.daily?.sunset?.[0] ?? null,
        hourly: weatherData.hourly || null,
        daily: weatherData.daily,
      });

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
          const weatherRes = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
              `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weathercode,surface_pressure,windspeed_10m,precipitation` +
              `&hourly=temperature_2m,weathercode` +
              `&daily=temperature_2m_max,temperature_2m_min,weathercode,sunrise,sunset,precipitation_probability_max,windspeed_10m_max` +
              `&timezone=auto&forecast_days=10`,
          );
          const weatherData = await weatherRes.json();

          const locationRes = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
          );
          const locationData = await locationRes.json();

          const current = weatherData.current || {};

          setWeather({
            name: locationData.city || locationData.locality || "Your Location",
            country: locationData.countryCode || "",
            temperature: current.temperature_2m ?? current.temperature ?? 0,
            windspeed: current.windspeed_10m ?? current.windspeed ?? 0,
            humidity: current.relative_humidity_2m ?? null,
            pressure: current.surface_pressure ?? null,
            apparent_temperature: current.apparent_temperature ?? null,
            weathercode: current.weathercode ?? 2,
            precipitation_probability:
              weatherData.daily?.precipitation_probability_max?.[0] ?? null,
            sunrise: weatherData.daily?.sunrise?.[0] ?? null,
            sunset: weatherData.daily?.sunset?.[0] ?? null,
            hourly: weatherData.hourly || null,
            daily: weatherData.daily,
          });

          if (locationData.city || locationData.locality) {
            saveCity(locationData.city || locationData.locality);
          }
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError(
          "Unable to retrieve your location. Please allow location access.",
        );
        setLoading(false);
      },
    );
  };

  const bgImage = isDark ? darkBg : lightBg;

  return (
    <div
      className={`min-h-screen flex flex-col font-sans relative ${isDark ? "text-white" : "text-gray-900"}`}
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center bottom",
        backgroundAttachment: "fixed",
      }}
    >
      <div
        className={`absolute inset-0 pointer-events-none z-0 ${
          isDark
            ? "bg-gradient-to-t from-black/70 via-black/30 to-transparent"
            : "bg-gradient-to-t from-white/70 via-white/20 to-transparent"
        }`}
      />

      <div className="relative z-10 flex flex-col items-center min-h-screen">
        <Header
          weather={weather}
          unit={unit}
          setUnit={setUnit}
          city={city}
          setCity={setCity}
          fetchWeather={fetchWeather}
          loading={loading}
          getLocationWeather={getLocationWeather}
          searchHistory={searchHistory}
          getWeather={getWeather}
          theme={theme}
          toggleTheme={toggleTheme}
        />

        <ErrorMessage error={error} theme={theme} />

        <div className="flex-1 flex flex-col justify-end w-full max-w-[1400px] px-6 md:px-10 pb-10">
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-4">
                <div
                  className={`w-10 h-10 border-2 rounded-full animate-spin ${isDark ? "border-white/20 border-t-yellow-400" : "border-gray-300 border-t-yellow-500"}`}
                />
                <p
                  className={`text-sm font-light tracking-wide ${isDark ? "text-white/60" : "text-gray-500"}`}
                >
                  Fetching weather data...
                </p>
              </div>
            </div>
          )}

          {!weather && !loading && !error && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <h2
                className={`text-3xl md:text-4xl font-extralight mb-4 tracking-wide ${isDark ? "text-white/80" : "text-gray-800"}`}
              >
                Welcome to Climix
              </h2>
              <p
                className={`text-sm font-light max-w-md leading-relaxed ${isDark ? "text-white/40" : "text-gray-500"}`}
              >
                Open the{" "}
                <span
                  className={`font-medium tracking-wider ${isDark ? "text-white/70" : "text-gray-700"}`}
                >
                  MENU
                </span>{" "}
                to search for a city or use your current location to get
                started.
              </p>
            </div>
          )}

          {weather && (
            <>
              <WeatherCard weather={weather} unit={unit} theme={theme} />

              {weather.daily && (
                <div className="mt-10 md:mt-14">
                  <Forecast daily={weather.daily} unit={unit} theme={theme} />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
