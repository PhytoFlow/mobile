import axios from "axios";
import {
  ForecastAPI,
  LocationData,
  CurrentWeatherAPI,
  WeatherUI,
  AirPollutionAPI,
} from "@/libs/models/weather";
import { calculateDewPoint } from "../utils/calculateDewPoint";

const API_KEY = "48d5485df65b2549a095241e17ed419f";
const BASE_URL = "https://api.openweathermap.org/data/2.5";
const GEO_URL = "https://api.openweathermap.org/geo/1.0";

/*export const fetchLocations = async ({
  cityName,
}: {
  cityName: string;
}): Promise<LocationData[]> => {
  try {
    const response = await axios.get(`${GEO_URL}/direct`, {
      params: {
        q: cityName,
        limit: 5,
        appid: API_KEY,
      },
    });

    return response.data.map((location: any) => ({
      name: location.name,
      country: location.country,
      lat: location.lat,
      lon: location.lon,
    }));
  } catch (error) {
    console.error("Error fetching locations:", error);
    return [];
  }
};*/

// Fetch weather by latitude and longitude
export const fetchWeatherByLatLong = async ({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
  days?: number;
}): Promise<WeatherUI> => {
  try {
    const [currentResponse, forecastResponse, airPollutionResponse] =
      await Promise.all([
        axios.get<CurrentWeatherAPI>(`${BASE_URL}/weather`, {
          params: {
            lat: latitude,
            lon: longitude,
            appid: API_KEY,
            units: "metric",
            lang: "pt_br",
          },
        }),
        axios.get<ForecastAPI>(`${BASE_URL}/forecast`, {
          params: {
            lat: latitude,
            lon: longitude,
            appid: API_KEY,
            units: "metric",
            lang: "pt_br",
          },
        }),
        axios.get<AirPollutionAPI>(`${BASE_URL}/air_pollution`, {
          params: {
            lat: latitude,
            lon: longitude,
            appid: API_KEY,
          },
        }),
      ]);

    const currentData = currentResponse.data;
    const forecastData = forecastResponse.data;
    const airPollutionData = airPollutionResponse.data;

    // Mapear os níveis de AQI para descrições
    const aqiDescriptions = [
      "Bom",
      "Moderado",
      "Ruim",
      "Muito Ruim",
      "Perigoso",
    ];
    const aqiValue = airPollutionData.list[0].main.aqi;
    const aqiDescription = aqiDescriptions[aqiValue - 1] || "Desconhecido";

    const dailyForecast = forecastData.list
      .filter((item) => item.dt_txt.includes("12:00:00"))
      .slice(0, 5)
      .map((item) => ({
        date: item.dt_txt.split(" ")[0],
        temp: Math.round(item.main.temp),
        condition: {
          description: item.weather[0].description,
          icon: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
        },
        humidity: item.main.humidity,
      }));

    return {
      location: {
        name: currentData.name,
        country: currentData.sys.country,
      },
      current: {
        temp: Math.round(currentData.main.temp),
        temp_max: Math.round(currentData.main.temp_max),
        temp_min: Math.round(currentData.main.temp_min),
        feels_like: Math.round(currentData.main.feels_like),
        condition: {
          text: currentData.weather[0].description,
          icon: `https://openweathermap.org/img/wn/${currentData.weather[0].icon}@2x.png`,
        },
        wind: currentData.wind,
        humidity: currentData.main.humidity,
        pressure: Math.round(currentData.main.pressure),
        visibility: currentData.visibility,
        clouds: currentData.clouds.all,
        rain: currentData.rain ? currentData.rain["1h"] : 0,
        dewPoint: calculateDewPoint(
          currentData.main.temp,
          currentData.main.humidity,
        ),
        airQuality: aqiDescription,
      },
      forecast: dailyForecast,
    };
  } catch (error) {
    console.error("Error fetching weather by lat/long:", error);
    throw error;
  }
};
