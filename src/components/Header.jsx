import React, { useState } from "react";
import { MapPin, ChevronDown, Menu, X, Search, Navigation } from "lucide-react";
import sunImg from "../asset/sun.png";
import crescentImg from "../asset/crescent.png";

const Header = ({
  weather,
  unit,
  setUnit,
  city,
  setCity,
  fetchWeather,
  loading,
  getLocationWeather,
  searchHistory,
  getWeather,
  theme,
  toggleTheme,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const isDark = theme === "dark";

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      getWeather(searchInput);
      setSearchInput("");
      setMenuOpen(false);
    }
  };

  return (
    <>
      {/* Top Navigation Bar */}
      <header className="w-full max-w-[1400px] flex justify-between items-center px-6 md:px-10 py-5 z-20 relative">
        {/* Left: Logo + Location */}
        <div className="flex items-center gap-5">
          <h1 className={`text-[15px] md:text-[17px] font-bold tracking-[0.25em] drop-shadow-md uppercase ${isDark ? "text-white" : "text-gray-900"}`}>
            CLIMIX
          </h1>
          {weather && (
            <div className={`hidden md:flex items-center gap-1.5 text-[13px] font-light ${isDark ? "text-white/80" : "text-gray-700"}`}>
              <MapPin size={14} className={isDark ? "text-white/60" : "text-gray-500"} />
              <span>
                Weather in <span className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>{weather.name}</span>
                {" / "}
                <span className={isDark ? "text-white/70" : "text-gray-500"}>{weather.country}</span>
              </span>
              <ChevronDown size={14} className={isDark ? "text-white/50" : "text-gray-400"} />
            </div>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-5 md:gap-8">
          {/* Unit Toggle */}
          <div className={`flex items-center gap-1 text-[13px] ${isDark ? "text-white/80" : "text-gray-600"}`}>
            <button
              onClick={() => setUnit("C")}
              className={`cursor-pointer transition-all ${unit === "C"
                ? (isDark ? "text-white font-bold" : "text-gray-900 font-bold")
                : (isDark ? "text-white/50 font-light hover:text-white/70" : "text-gray-400 font-light hover:text-gray-600")
              }`}
            >
              °C
            </button>
            <span className={isDark ? "text-white/30" : "text-gray-300"}>|</span>
            <button
              onClick={() => setUnit("F")}
              className={`cursor-pointer transition-all ${unit === "F"
                ? (isDark ? "text-white font-bold" : "text-gray-900 font-bold")
                : (isDark ? "text-white/50 font-light hover:text-white/70" : "text-gray-400 font-light hover:text-gray-600")
              }`}
            >
              °F
            </button>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`cursor-pointer p-1.5 rounded-full transition-all flex items-center justify-center ${
              isDark
                ? "hover:bg-white/10"
                : "hover:bg-black/5"
            }`}
            title={`Switch to ${isDark ? "light" : "dark"} mode`}
          >
            <img 
              src={isDark ? sunImg : crescentImg} 
              alt="Toggle Theme" 
              className="w-[18px] h-[18px] object-contain opacity-90 hover:opacity-100 transition-opacity" 
            />
          </button>

          {/* Menu Button */}
          <button
            onClick={() => setMenuOpen(true)}
            className={`flex items-center gap-2 cursor-pointer transition-all group ${isDark ? "text-white/90 hover:text-white" : "text-gray-700 hover:text-gray-900"}`}
          >
            <span className="text-[13px] font-semibold tracking-[0.2em] uppercase">MENU</span>
            <Menu size={18} className="group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </header>

      {/* Slide-out Menu Drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className={`absolute inset-0 backdrop-blur-sm ${isDark ? "bg-black/50" : "bg-black/20"}`}
            onClick={() => setMenuOpen(false)}
          />

          {/* Drawer */}
          <div className={`relative w-full max-w-sm backdrop-blur-xl border-l p-8 flex flex-col gap-6 shadow-2xl animate-slide-in ${
            isDark
              ? "bg-gradient-to-b from-[#1a1a2e]/95 to-[#16213e]/95 border-white/10"
              : "bg-white/85 border-gray-200"
          }`}>
            <div className="flex justify-between items-center mb-2">
              <h2 className={`text-lg font-semibold tracking-wider ${isDark ? "text-white" : "text-gray-900"}`}>MENU</h2>
              <button
                onClick={() => setMenuOpen(false)}
                className={`cursor-pointer p-1 ${isDark ? "text-white/70 hover:text-white" : "text-gray-500 hover:text-gray-800"}`}
              >
                <X size={22} />
              </button>
            </div>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="flex-1 relative">
                <Search size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? "text-white/40" : "text-gray-400"}`} />
                <input
                  type="text"
                  placeholder="Search city..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-1 ${
                    isDark
                      ? "bg-white/10 border-white/15 text-white placeholder:text-white/40 focus:ring-yellow-400/50 focus:border-yellow-400/30"
                      : "bg-gray-100 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:ring-yellow-500/50 focus:border-yellow-500/30"
                  }`}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className={`px-5 py-3 border rounded-xl text-sm font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  isDark
                    ? "bg-yellow-500/20 border-yellow-400/30 text-yellow-300 hover:bg-yellow-500/30"
                    : "bg-yellow-500/15 border-yellow-500/30 text-yellow-700 hover:bg-yellow-500/25"
                }`}
              >
                {loading ? "..." : "Go"}
              </button>
            </form>

            {/* Location Button */}
            <button
              onClick={() => {
                getLocationWeather();
                setMenuOpen(false);
              }}
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 py-3 border rounded-xl text-sm font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                isDark
                  ? "bg-white/8 border-white/15 text-white/80 hover:bg-white/15"
                  : "bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Navigation size={15} />
              Use Current Location
            </button>

            {/* Recent Searches */}
            {searchHistory.length > 0 && (
              <div className="mt-2">
                <h3 className={`text-[11px] font-semibold tracking-[0.15em] uppercase mb-3 ${isDark ? "text-white/40" : "text-gray-400"}`}>
                  Recent Searches
                </h3>
                <div className="flex flex-wrap gap-2">
                  {searchHistory.map((historyCity, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        getWeather(historyCity);
                        setMenuOpen(false);
                      }}
                      className={`px-3.5 py-1.5 border rounded-full text-[12px] font-medium cursor-pointer transition-all ${
                        isDark
                          ? "bg-white/8 border-white/12 text-white/70 hover:bg-white/15 hover:text-white"
                          : "bg-gray-100 border-gray-200 text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                      }`}
                    >
                      {historyCity}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in {
          animation: slideIn 0.3s ease-out forwards;
        }
      `}</style>
    </>
  );
};

export default Header;
