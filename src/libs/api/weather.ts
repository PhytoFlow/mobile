import axios from "axios";
import {
  ForecastAPI,
  CurrentWeatherAPI,
  WeatherUI,
  AirPollutionAPI,
} from "@/libs/models/weather";
import { calculateDewPoint } from "../utils/calculateDewPoint";
import { AxiosResponse } from "axios";

export const WEATHER_CONFIG = {
  API_KEY: "48d5485df65b2549a095241e17ed419f",
  BASE_URL: "https://api.openweathermap.org/data/2.5",
  MAP_URL: "https://tile.openweathermap.org/map",
  LANGUAGE: "pt_br",
  UNITS: "metric",
} as const;

const AQI_DESCRIPTIONS: Record<number, string> = {
  1: "Bom",
  2: "Moderado",
  3: "Ruim",
  4: "Muito Ruim",
  5: "Perigoso",
};

export const fetchWeatherData = async ({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}): Promise<WeatherUI> => {
  if (!latitude || !longitude) {
    throw new Error("Latitude e longitude são obrigatórios");
  }

  try {
    const [currentResponse, forecastResponse, airPollutionResponse] =
      await Promise.all([
        fetchCurrentWeather(latitude, longitude),
        fetchForecast(latitude, longitude),
        fetchAirPollution(latitude, longitude),
      ]);

    const { data: currentData } = currentResponse;
    const {
      data: { list: forecastList },
    } = forecastResponse;
    const {
      data: {
        list: [airPollutionData],
      },
    } = airPollutionResponse;

    const aqiValue = airPollutionData.main.aqi;
    const aqiDescription = AQI_DESCRIPTIONS[aqiValue] || "Desconhecido";

    const dailyForecast = forecastList
      .filter((item) => item.dt_txt.includes("12:00:00"))
      .slice(0, 5)
      .map((item) => ({
        date: item.dt_txt.split(" ")[0],
        temp: Math.round(item.main.temp),
        condition: {
          description: item.weather[0].description,
          icon: getWeatherIconUrl(item.weather[0].icon),
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
          icon: getWeatherIconUrl(currentData.weather[0].icon),
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
    console.error("Erro ao buscar dados meteorológicos:", error);
    throw new Error("Falha ao recuperar dados meteorológicos");
  }
};

const fetchCurrentWeather = (
  latitude: number,
  longitude: number,
): Promise<AxiosResponse<CurrentWeatherAPI>> =>
  axios.get(`${WEATHER_CONFIG.BASE_URL}/weather`, {
    params: {
      lat: latitude,
      lon: longitude,
      appid: WEATHER_CONFIG.API_KEY,
      units: WEATHER_CONFIG.UNITS,
      lang: WEATHER_CONFIG.LANGUAGE,
    },
  });

const fetchForecast = (
  latitude: number,
  longitude: number,
): Promise<AxiosResponse<ForecastAPI>> =>
  axios.get(`${WEATHER_CONFIG.BASE_URL}/forecast`, {
    params: {
      lat: latitude,
      lon: longitude,
      appid: WEATHER_CONFIG.API_KEY,
      units: WEATHER_CONFIG.UNITS,
      lang: WEATHER_CONFIG.LANGUAGE,
    },
  });

const fetchAirPollution = (
  latitude: number,
  longitude: number,
): Promise<AxiosResponse<AirPollutionAPI>> =>
  axios.get(`${WEATHER_CONFIG.BASE_URL}/air_pollution`, {
    params: {
      lat: latitude,
      lon: longitude,
      appid: WEATHER_CONFIG.API_KEY,
    },
  });

const getWeatherIconUrl = (iconCode: string): string =>
  `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
