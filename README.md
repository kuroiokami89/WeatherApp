# 🌤️ Weather App

A modern, beautiful weather application built with React Native and Expo. Get real-time weather information with an intuitive search experience and dynamic UI that changes based on time of day.

![React Native](https://img.shields.io/badge/React%20Native-0.73%2B-blue)
![Expo](https://img.shields.io/badge/Expo-50%2B-000000)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0%2B-3178C6)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

- **🔍 City Search** - Search for any city worldwide with real-time suggestions
- **🌡️ Real-time Weather** - Current temperature, conditions, and daily highs/lows
- **🎨 Dynamic Gradients** - Background colors that adapt based on time of day
- **📍 Geolocation** - Beautiful location-based weather display
- **⚡ Smooth Performance** - Optimized with debounced search and responsive UI
- **📱 Cross-platform** - Works seamlessly on iOS, Android, and web

## 🛠️ Tech Stack

- **Frontend Framework**: [React Native](https://reactnative.dev)
- **Build Tool**: [Expo](https://expo.dev)
- **Language**: [TypeScript](https://www.typescriptlang.org)
- **Weather API**: [Open-Meteo](https://open-meteo.com) - Free weather data API
- **Geocoding API**: [Open-Meteo Geocoding](https://open-meteo.com/en/features/geocoding-api) - Location search
- **UI Components**: React Native built-in components
- **Styling**: StyleSheet with dynamic theming
- **Icons**: Expo Vector Icons (Ionicons)
- **Animations**: Expo Linear Gradient for beautiful backgrounds

## 📦 API Details

### Open-Meteo Weather API

- **Endpoint**: `https://api.open-meteo.com/v1/forecast`
- **Features**: Current weather, temperature, weather codes, daily forecasts
- **Benefits**: No API key required, free tier, reliable, GDPR compliant

### Open-Meteo Geocoding API

- **Endpoint**: `https://geocoding-api.open-meteo.com/v1/search`
- **Features**: Location search with country/region data
- **Benefits**: Fast, accurate location suggestions, no authentication needed

## 🚀 Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn
- Expo CLI (optional but recommended)

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd WeatherApp
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npx expo start
   ```

4. **Open in your preferred platform**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Press `w` for web browser
   - Scan QR code with Expo Go app on your phone

## 📁 Project Structure

```
WeatherApp/
├── app/
│   ├── _layout.tsx          # Main app component with weather logic
│   ├── modal.tsx            # Modal screens
│   └── (tabs)/              # Tabbed navigation
├── components/              # Reusable UI components
├── constants/               # App constants and theme
├── hooks/                   # Custom React hooks
├── assets/                  # Images and fonts
├── package.json
├── tsconfig.json
└── README.md
```

## 🎨 Key Components

### WeatherData Interface

```typescript
interface WeatherData {
  temperature: number; // Current temperature
  weatherCode: number; // WMO weather condition code
  maxTemp: number; // Daily maximum temperature
  minTemp: number; // Daily minimum temperature
  city: string; // City name
}
```

### LocationSuggestion Interface

```typescript
interface LocationSuggestion {
  name: string; // City/location name
  latitude: number; // Latitude coordinate
  longitude: number; // Longitude coordinate
  country: string; // Country name
  admin1?: string; // State/province name
}
```

## 🎯 How It Works

1. **Search** - Type in the search bar to find a city
2. **Select** - Choose from the dropdown suggestions
3. **Fetch** - App fetches real-time weather data from Open-Meteo
4. **Display** - Beautiful UI shows current conditions and forecast
5. **Dynamic Theme** - Colors change based on time of day:
   - 🌅 Dawn (5am-9am): Orange/warm gradient
   - ☀️ Day (9am-5pm): Blue sky gradient
   - 🌆 Dusk (5pm-8pm): Purple/pink gradient
   - 🌙 Night (8pm-5am): Dark blue gradient

## 📝 Scripts

```bash
# Start development server
npm start

# Start with specific platform
npx expo start --ios
npx expo start --android
npx expo start --web

# Reset project
npm run reset-project

# Run linter
npx eslint .
```

## 🔄 Environment & Config

- **TypeScript**: Configured for strict type checking
- **ESLint**: Code quality and style consistency
- **Expo Config**: Defined in `app.json` and `eas.json`

## 📊 Weather Condition Codes

The app uses WMO Weather interpretation codes (0-99) to determine weather conditions:

- **0-3**: Clear to overcast sky
- **45, 48**: Foggy conditions
- **51-55**: Drizzle
- **61-65**: Rain
- **71-77**: Snow
- **80-82**: Rain showers
- **85-86**: Snow showers
- **95-99**: Thunderstorms

## 🔒 Privacy

This app respects user privacy:

- Location data is only sent to Open-Meteo servers
- No personal data is stored or tracked
- No authentication required
- Compliant with GDPR standards

## 📄 License

This project is open source and available under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Feel free to fork the repository and submit pull requests.

## 📞 Support

For issues, questions, or suggestions, please open an issue in the GitHub repository.

---

**Built with ❤️ using React Native and Expo**
