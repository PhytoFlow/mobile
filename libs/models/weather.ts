export type CurrentWeatherUI = {
  condition: {
    text: string;
    icon: string;
  };
  temp: number;
  temp_max: number;
  temp_min: number;
  wind: {
    speed: number;
    deg: number;
  };
  humidity: number;
  pressure: number;
  visibility: number;
  clouds: number;
  rain: number;
  dewPoint: number;
  feels_like: number;
  airQuality: string;
};

export interface ForecastUI {
  date: string;
  temp: number;
  condition: {
    description: string;
    icon: string;
  };
  humidity: number;
}

export type WeatherUI = {
  current: CurrentWeatherUI;
  forecast: ForecastUI[];
  location: {
    name: string;
    country: string;
  };
};

export interface CurrentWeatherAPI {
  coord: {
    lon: number;
    lat: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level?: number;
    grnd_level?: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  rain?: {
    "1h"?: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    type?: number;
    id?: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

export interface ForecastAPI {
  cod: string;
  message: number;
  cnt: number;
  list: {
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      temp_min: number;
      temp_max: number;
      pressure: number;
      sea_level: number;
      grnd_level: number;
      humidity: number;
      temp_kf: number;
    };
    weather: {
      id: number;
      main: string;
      description: string;
      icon: string;
    }[];
    clouds: {
      all: number;
    };
    wind: {
      speed: number;
      deg: number;
      gust: number;
    };
    visibility: number;
    pop: number;
    rain?: {
      "3h": number;
    };
    sys: {
      pod: string;
    };
    dt_txt: string;
  }[];
}

export interface AirPollutionAPI {
  coord: [number, number];
  list: {
    dt: number;
    main: {
      aqi: 1 | 2 | 3 | 4 | 5;
    };
    @/components: {
      co: number;
      no: number;
      no2: number;
      o3: number;
      so2: number;
      pm2_5: number;
      pm10: number;
      nh3: number;
    };
  }[];
}
