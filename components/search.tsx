import { MapPin, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function WeatherApp() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCity, setSelectedCity] = useState({
    name: "Castelfranco Veneto",
    lat: 45.6719,
    lon: 11.9258,
  });
  const searchRef = useRef(null);

  useEffect(() => {
    fetchWeather(selectedCity.lat, selectedCity.lon, selectedCity.name);
  }, [selectedCity]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchQuery.length > 2) {
      const debounce = setTimeout(() => {
        fetchLocationSuggestions(searchQuery);
      }, 300);
      return () => clearTimeout(debounce);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  const fetchLocationSuggestions = async (query) => {
    try {
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          query
        )}&count=5&language=en&format=json`
      );
      const data = await response.json();

      if (data.results) {
        setSuggestions(data.results);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    }
  };

  const fetchWeather = async (lat, lon, cityName) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min&timezone=auto`
      );

      const data = await response.json();

      setWeather({
        temperature: Math.round(data.current.temperature_2m),
        weatherCode: data.current.weather_code,
        maxTemp: Math.round(data.daily.temperature_2m_max[0]),
        minTemp: Math.round(data.daily.temperature_2m_min[0]),
        city: cityName,
      });
    } catch (error) {
      console.error("Error fetching weather:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    const cityName = suggestion.admin1
      ? `${suggestion.name}, ${suggestion.admin1}`
      : suggestion.name;

    setSelectedCity({
      name: cityName,
      lat: suggestion.latitude,
      lon: suggestion.longitude,
    });
    setSearchQuery("");
    setShowSuggestions(false);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const getGradientColors = () => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 9) {
      return {
        colors: ["#FFD166", "#FFB347", "#FF8C66"],
        text: "#1B1B1B",
        accent: "#FF6B35",
      };
    } else if (hour >= 9 && hour < 17) {
      return {
        colors: ["#4A90E2", "#357ABD", "#1E5F9A"],
        text: "#FFFFFF",
        accent: "#FFD700",
      };
    } else if (hour >= 17 && hour < 20) {
      return {
        colors: ["#9B5DE5", "#F15BB5", "#FF7F5B"],
        text: "#FFFFFF",
        accent: "#FFE156",
      };
    } else {
      return {
        colors: ["#0F2027", "#203A43", "#2C5364"],
        text: "#FFFFFF",
        accent: "#00B4D8",
      };
    }
  };

  const weatherDescriptions = {
    0: "Clear Sky",
    1: "Mostly Clear",
    2: "Partly Cloudy",
    3: "Overcast",
    45: "Foggy",
    48: "Rime Fog",
    51: "Light Drizzle",
    53: "Moderate Drizzle",
    55: "Heavy Drizzle",
    61: "Light Rain",
    63: "Moderate Rain",
    65: "Heavy Rain",
    71: "Light Snow",
    73: "Moderate Snow",
    75: "Heavy Snow",
    77: "Snow Grains",
    80: "Light Showers",
    81: "Moderate Showers",
    82: "Heavy Showers",
    85: "Light Snow Showers",
    86: "Heavy Snow Showers",
    95: "Thunderstorm",
    96: "Thunderstorm with Hail",
    99: "Severe Thunderstorm",
  };

  const theme = getGradientColors();

  if (loading && !weather) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background: `linear-gradient(135deg, ${theme.colors[0]}, ${theme.colors[1]}, ${theme.colors[2]})`,
        }}
      >
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen p-6 flex flex-col"
      style={{
        background: `linear-gradient(135deg, ${theme.colors[0]}, ${theme.colors[1]}, ${theme.colors[2]})`,
        color: theme.text,
      }}
    >
      {/* Search Bar */}
      <div ref={searchRef} className="relative max-w-2xl mx-auto w-full mb-8">
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 transform -translate-y-1/2 opacity-60"
            size={20}
            style={{ color: theme.text }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            placeholder="Search for a city..."
            className="w-full pl-12 pr-12 py-4 rounded-2xl text-lg font-medium outline-none transition-all"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              color: theme.text,
            }}
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-60 hover:opacity-100 transition-opacity"
            >
              <X size={20} style={{ color: theme.text }} />
            </button>
          )}
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div
            className="absolute top-full mt-2 w-full rounded-2xl overflow-hidden shadow-2xl"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
            }}
          >
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full px-4 py-3 flex items-center gap-3 transition-all hover:bg-white hover:bg-opacity-50"
              >
                <MapPin
                  size={18}
                  className="opacity-60"
                  style={{ color: "#1B1B1B" }}
                />
                <div className="text-left">
                  <div className="font-semibold" style={{ color: "#1B1B1B" }}>
                    {suggestion.name}
                  </div>
                  <div
                    className="text-sm opacity-70"
                    style={{ color: "#1B1B1B" }}
                  >
                    {[suggestion.admin1, suggestion.country]
                      .filter(Boolean)
                      .join(", ")}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Weather Display */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full">
        {/* City and Date */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2" style={{ color: theme.text }}>
            {weather?.city}
          </h1>
          <p className="text-lg opacity-90" style={{ color: theme.text }}>
            {new Date().toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
            {" · "}
            {new Date().toLocaleTimeString([], {
              hour: "numeric",
              minute: "2-digit",
            })}
          </p>
        </div>

        {/* Main Temperature */}
        <div className="text-center mb-8">
          <div
            className="text-9xl font-light mb-2"
            style={{ color: theme.text }}
          >
            {weather?.temperature}°
          </div>
          <p
            className="text-2xl font-semibold opacity-90"
            style={{ color: theme.text }}
          >
            {weather
              ? weatherDescriptions[weather.weatherCode] || "Sunny"
              : "Sunny"}
          </p>
        </div>

        {/* Temperature Range */}
        <div className="flex items-center gap-4 mb-12">
          <div className="flex items-center gap-2">
            <span
              className="text-sm font-semibold opacity-80"
              style={{ color: theme.text }}
            >
              H
            </span>
            <span
              className="text-2xl font-semibold"
              style={{ color: theme.text }}
            >
              {weather?.maxTemp}°
            </span>
          </div>
          <span className="text-2xl opacity-30" style={{ color: theme.text }}>
            /
          </span>
          <div className="flex items-center gap-2">
            <span
              className="text-sm font-semibold opacity-80"
              style={{ color: theme.text }}
            >
              L
            </span>
            <span
              className="text-2xl font-semibold"
              style={{ color: theme.text }}
            >
              {weather?.minTemp}°
            </span>
          </div>
        </div>

        {/* Weather Details */}
        <div className="grid grid-cols-2 gap-3 w-full max-w-md">
          {[
            { label: "FEELS LIKE", value: `${weather?.temperature}°` },
            { label: "WIND", value: "5 mph" },
            { label: "HUMIDITY", value: "65%" },
            { label: "VISIBILITY", value: "10 mi" },
          ].map((detail, index) => (
            <div
              key={index}
              className="rounded-2xl p-4 text-center"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.15)",
                backdropFilter: "blur(10px)",
              }}
            >
              <p
                className="text-xs font-medium opacity-80 mb-2"
                style={{ color: theme.text }}
              >
                {detail.label}
              </p>
              <p
                className="text-xl font-semibold"
                style={{ color: theme.text }}
              >
                {detail.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
