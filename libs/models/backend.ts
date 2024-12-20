export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface SensorValues {
  timestamp: string;
  temperature: number;
  humidity: number;
  soil_humidity: number;
  light: number;
  uv_intensity: number;
  soil_temperature: number;
}

export type SensorValueKeys = Exclude<keyof SensorValues, "timestamp">;

export interface Sensor {
  identifier: string;
  name: string;
  working: boolean;
  irrigationAvailable: boolean;
  coordinate: Coordinate;
  values: SensorValues;
}

export type Dashboard = {
  identifier: string;
  name: string;
  values: {
    timestamp: string;
    temperature: number;
    humidity: number;
    soil_humidity: number;
    light: number;
    uv_intensity: number;
    soil_temperature: number;
  }[];
}[];
