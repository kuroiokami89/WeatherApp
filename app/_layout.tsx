import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface WeatherData {
  temperature: number;
  weatherCode: number;
  maxTemp: number;
  minTemp: number;
  city: string;
}

interface LocationSuggestion {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
}

interface SelectedCity {
  name: string;
  lat: number;
  lon: number;
}

export default function WeatherSearchApp() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCity, setSelectedCity] = useState<SelectedCity>({
    name: "Castelfranco Veneto",
    lat: 45.6719,
    lon: 11.9258,
  });

  useEffect(() => {
    fetchWeather(selectedCity.lat, selectedCity.lon, selectedCity.name);
  }, [selectedCity]);

  useEffect(() => {
    if (searchQuery.length > 2) {
      const debounce = setTimeout(() => {
        fetchLocationSuggestions(searchQuery);
      }, 300);
      return () => clearTimeout(debounce);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  const fetchLocationSuggestions = async (query: string) => {
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

  const fetchWeather = async (lat: number, lon: number, cityName: string) => {
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

  const handleSuggestionClick = (suggestion: LocationSuggestion) => {
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
    Keyboard.dismiss();
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
        colors: ["#FFD166", "#FFB347", "#FF8C66"] as const,
        text: "#1B1B1B",
        accent: "#FF6B35",
      };
    } else if (hour >= 9 && hour < 17) {
      return {
        colors: ["#4A90E2", "#357ABD", "#1E5F9A"] as const,
        text: "#FFFFFF",
        accent: "#FFD700",
      };
    } else if (hour >= 17 && hour < 20) {
      return {
        colors: ["#9B5DE5", "#F15BB5", "#FF7F5B"] as const,
        text: "#FFFFFF",
        accent: "#FFE156",
      };
    } else {
      return {
        colors: ["#0F2027", "#203A43", "#2C5364"] as const,
        text: "#FFFFFF",
        accent: "#00B4D8",
      };
    }
  };

  const weatherDescriptions: { [key: number]: string } = {
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
      <LinearGradient colors={theme.colors} style={styles.container}>
        <ActivityIndicator size="large" color={theme.accent} />
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={theme.colors}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <StatusBar
        barStyle={theme.text === "#FFFFFF" ? "light-content" : "dark-content"}
        translucent
        backgroundColor="transparent"
      />
      <SafeAreaView style={styles.safeArea}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={[styles.searchBar]}>
            <Ionicons
              name="search"
              size={20}
              color={theme.text}
              style={styles.searchIcon}
            />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              placeholder="Search for a city..."
              placeholderTextColor={`${theme.text}80`}
              style={[styles.searchInput, { color: theme.text }]}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={clearSearch}
                style={styles.clearButton}
              >
                <Ionicons name="close-circle" size={20} color={theme.text} />
              </TouchableOpacity>
            )}
          </View>

          {/* Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <View style={styles.suggestionsContainer}>
              <FlatList
                data={suggestions}
                keyExtractor={(item, index) => `${item.latitude}-${index}`}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.suggestionItem}
                    onPress={() => handleSuggestionClick(item)}
                  >
                    <Ionicons
                      name="location"
                      size={18}
                      color="#1B1B1B"
                      style={styles.locationIcon}
                    />
                    <View style={styles.suggestionText}>
                      <Text style={styles.suggestionName}>{item.name}</Text>
                      <Text style={styles.suggestionRegion}>
                        {[item.admin1, item.country].filter(Boolean).join(", ")}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}
        </View>

        {/* Weather Display */}
        <View style={styles.weatherContainer}>
          {/* City and Date */}
          <View style={styles.topSection}>
            <Text style={[styles.cityName, { color: theme.text }]}>
              {weather?.city}
            </Text>
            <Text style={[styles.dateTime, { color: theme.text }]}>
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
            </Text>
          </View>

          {/* Main Temperature */}
          <View style={styles.centerSection}>
            <Text style={[styles.temperature, { color: theme.text }]}>
              {weather?.temperature}°
            </Text>
            <Text style={[styles.condition, { color: theme.text }]}>
              {weather
                ? weatherDescriptions[weather.weatherCode] || "Sunny"
                : "Sunny"}
            </Text>
          </View>

          {/* Temperature Range */}
          <View style={styles.tempRangeContainer}>
            <View style={styles.tempRangeItem}>
              <Text style={[styles.tempRangeLabel, { color: theme.text }]}>
                H
              </Text>
              <Text style={[styles.tempRangeValue, { color: theme.text }]}>
                {weather?.maxTemp}°
              </Text>
            </View>
            <Text style={[styles.tempSeparator, { color: theme.text }]}>/</Text>
            <View style={styles.tempRangeItem}>
              <Text style={[styles.tempRangeLabel, { color: theme.text }]}>
                L
              </Text>
              <Text style={[styles.tempRangeValue, { color: theme.text }]}>
                {weather?.minTemp}°
              </Text>
            </View>
          </View>

          {/* Weather Details Grid */}
          <View style={styles.detailsGrid}>
            {[
              { label: "FEELS LIKE", value: `${weather?.temperature}°` },
              { label: "WIND", value: "5 mph" },
              { label: "HUMIDITY", value: "65%" },
              { label: "VISIBILITY", value: "10 mi" },
            ].map((detail, index) => (
              <View
                key={index}
                style={[
                  styles.detailCard,
                  { backgroundColor: "rgba(255, 255, 255, 0.15)" },
                ]}
              >
                <Text style={[styles.detailTitle, { color: theme.text }]}>
                  {detail.label}
                </Text>
                <Text style={[styles.detailValue, { color: theme.text }]}>
                  {detail.value}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  searchContainer: {
    marginBottom: 20,
    zIndex: 10,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomColor: "rgba(255, 255, 255, 0.15)",
    borderBottomWidth: 1, // ← fondamentale
  },
  searchIcon: {
    marginRight: 10,
    opacity: 0.6,
  },
  searchInput: {
    flex: 1,
    fontSize: 18,
    fontFamily: "Inter-Medium",
  },
  clearButton: {
    padding: 4,
  },
  suggestionsContainer: {
    marginTop: 8,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 16,
    overflow: "hidden",
    maxHeight: 250,
  },
  suggestionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.05)",
  },
  locationIcon: {
    marginRight: 12,
    opacity: 0.6,
  },
  suggestionText: {
    flex: 1,
  },
  suggestionName: {
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
    color: "#1B1B1B",
  },
  suggestionRegion: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "#1B1B1B",
    opacity: 0.7,
    marginTop: 2,
  },
  weatherContainer: {
    flex: 1,
  },
  topSection: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  cityName: {
    fontSize: 32,
    fontFamily: "Poppins-SemiBold",
    letterSpacing: -0.5,
    textAlign: "center",
  },
  dateTime: {
    fontSize: 16,
    fontFamily: "Inter-Medium",
    marginTop: 8,
    textAlign: "center",
    opacity: 0.9,
  },
  centerSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  temperature: {
    fontSize: 140,
    fontFamily: "Poppins-Light",
    letterSpacing: -4,
    lineHeight: 140,
  },
  condition: {
    fontSize: 20,
    fontFamily: "Inter-SemiBold",
    marginTop: 8,
    textAlign: "center",
    opacity: 0.9,
  },
  tempRangeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 30,
  },
  tempRangeItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  tempRangeLabel: {
    fontSize: 14,
    fontFamily: "Inter-SemiBold",
    marginRight: 4,
    opacity: 0.8,
  },
  tempRangeValue: {
    fontSize: 24,
    fontFamily: "Inter-SemiBold",
  },
  tempSeparator: {
    fontSize: 20,
    fontFamily: "Inter-Regular",
    marginHorizontal: 12,
    opacity: 0.3,
  },
  detailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  detailCard: {
    width: "48%",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: "center",
  },
  detailTitle: {
    fontSize: 12,
    fontFamily: "Inter-Regular",
    opacity: 0.8,
    marginBottom: 8,
    textAlign: "center",
  },
  detailValue: {
    fontSize: 20,
    fontFamily: "Inter-SemiBold",
    textAlign: "center",
  },
});
