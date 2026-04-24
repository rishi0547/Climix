import React, { useState } from "react";

const App = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchWeather = async (e) => {
    e.preventDefault();
    if (!city.trim()) return;

    setLoading(true);
    setError("");
    setWeather(null);

    try {
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`,
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
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-400 to-indigo-400 p-4 font-sans">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 w-full max-w-md shadow-2xl text-center">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-6 drop-shadow-sm">
          Weather App
        </h1>
        <form onSubmit={fetchWeather} className="flex gap-3 mb-8">
          <input
            type="text"
            placeholder="Enter city name..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-cyan-400 disabled:bg-blue-300 text-white font-semibold py-3 px-6 rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </form>

        {error && (
          <div className="text-red-500 mb-4 font-semibold p-3 bg-red-50 rounded-lg border border-red-100">
            {error}
          </div>
        )}

        {weather && (
          <div className="bg-gray-50 rounded-xl p-6 shadow-inner border border-gray-100 mt-2">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {weather.name}, {weather.country}
            </h2>
            <div className="flex justify-around items-center">
              <div className="flex flex-col gap-1 items-center">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Temperature
                </span>
                <span className="text-3xl font-black text-indigo-500">
                  {weather.temperature}°C
                </span>
              </div>
              <div className="w-px h-12 bg-gray-200"></div>
              <div className="flex flex-col gap-1 items-center">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Wind Speed
                </span>
                <span className="text-3xl font-black text-teal-500">
                  {weather.windspeed} <span className="text-lg">km/h</span>
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
