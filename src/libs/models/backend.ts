export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface Sensor {
  identifier: string;
  name: string;
  working: boolean;
  irrigationAvailable: boolean;
  coordinate: Coordinate;
  values: {
    temperature: number;
    humidity: number;
    soil_humidity: number;
    light: number;
    uv_intensity: number;
    soil_temperature: number;
  };
}
