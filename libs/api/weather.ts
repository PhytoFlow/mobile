import axios from "axios";
import {
  ForecastAPI,
  CurrentWeatherAPI,
  WeatherUI,
  AirPollutionAPI,
} from "@/libs/models/weather";
import NetInfo from "@react-native-community/netinfo";
import { calculateDewPoint } from "../utils/calculateDewPoint";
import getLocation from "../utils/getLocation";

export const WEATHER_CONFIG = {
  API_KEY: "48d5485df65b2549a095241e17ed419f",
  BASE_URL: "https://api.openweathermap.org/data/2.5",
  MAP_URL: "https://tile.openweathermap.org/map",
  LANGUAGE: "pt_br",
  UNITS: "metric",
} as const;

const apiClient = axios.create({
  baseURL: WEATHER_CONFIG.BASE_URL,
  params: {
    appid: WEATHER_CONFIG.API_KEY,
    units: WEATHER_CONFIG.UNITS,
    lang: WEATHER_CONFIG.LANGUAGE,
  },
});

const AQI_DESCRIPTIONS: Record<number, string> = {
  1: "Bom",
  2: "Moderado",
  3: "Ruim",
  4: "Muito Ruim",
  5: "Perigoso",
};

/**
 * Fetch da API de clima atual
 */
const fetchCurrentWeather = (
  latitude: number,
  longitude: number,
): Promise<CurrentWeatherAPI> =>
  apiClient
    .get("/weather", { params: { lat: latitude, lon: longitude } })
    .then((response) => response.data);

/**
 * Fetch da API de previsão do tempo
 */
const fetchForecast = (
  latitude: number,
  longitude: number,
): Promise<ForecastAPI> =>
  apiClient
    .get("/forecast", { params: { lat: latitude, lon: longitude } })
    .then((response) => response.data);

/**
 * Fetch da API de qualidade do ar
 */
const fetchAirPollution = (
  latitude: number,
  longitude: number,
): Promise<AirPollutionAPI> =>
  apiClient
    .get("/air_pollution", { params: { lat: latitude, lon: longitude } })
    .then((response) => response.data);

/**
 * Busca e formata os dados meteorológicos
 */
export const fetchWeatherData = async (
  latitude: number,
  longitude: number,
): Promise<WeatherUI> => {
  if (!latitude || !longitude) {
    throw new Error("Latitude e longitude são obrigatórios");
  }

  try {
    const [currentData, forecastData, airPollutionData] = await Promise.all([
      fetchCurrentWeather(latitude, longitude),
      fetchForecast(latitude, longitude),
      fetchAirPollution(latitude, longitude),
    ]);

    return formatWeatherData(currentData, forecastData, airPollutionData);
  } catch (error) {
    handleFetchErrors(error);
    throw new Error("Falha ao recuperar os dados meteorológicos");
  }
};

/**
 * Formata os dados retornados pela API em uma estrutura de UI
 */
const formatWeatherData = (
  currentData: CurrentWeatherAPI,
  forecastData: ForecastAPI,
  airPollutionData: AirPollutionAPI,
): WeatherUI => {
  const aqiValue = airPollutionData.list[0].main.aqi;
  const aqiDescription = AQI_DESCRIPTIONS[aqiValue] || "Desconhecido";

  const dailyForecast = forecastData.list
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
      rain: currentData.rain?.["1h"] ?? 0,
      dewPoint: calculateDewPoint(
        currentData.main.temp,
        currentData.main.humidity,
      ),
      airQuality: aqiDescription,
    },
    forecast: dailyForecast,
  };
};

/**
 * Busca os dados meteorológicos considerando a conexão e localização
 */
export const fetchWeather = async (): Promise<WeatherUI> => {
  const netState = await NetInfo.fetch();
  if (!netState.isConnected) {
    throw new Error("Sem conexão com a internet");
  }

  const location = await getLocation();
  return fetchWeatherData(location.coords.latitude, location.coords.longitude);
};

/**
 * Gerencia os erros de requisição
 */
const handleFetchErrors = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    throw new Error(
      error.response?.status === 404
        ? "Dados não encontrados"
        : "Erro na comunicação com o servidor",
    );
  }
  if (error instanceof Error) {
    throw new Error(error.message);
  }
  throw new Error("Erro desconhecido");
};

/**
 * Gera a URL do ícone meteorológico
 */
const getWeatherIconUrl = (iconCode: string): string =>
  `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
