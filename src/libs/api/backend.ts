import { Sensor } from "../models/backend";

const MOCK_API_DELAY = 3000;

export const fetchSensors = async (): Promise<Sensor[]> => {
  // Simulating API call
  await new Promise((resolve) => setTimeout(resolve, MOCK_API_DELAY));

  // Simulate random API error
  if (Math.random() < 0.1) {
    throw new Error("Failed to fetch sensors data");
  }

  return [
    {
      identifier: "A1",
      name: "Sensor Milho",
      working: true,
      irrigationAvailable: true,
      coordinate: {
        latitude: -23.5505,
        longitude: -46.6333,
      },
      values: {
        temperature: 25.8,
        humidity: 76.8,
        soil_humidity: 12,
        light: 502,
        uv_intensity: 15,
        soil_temperature: 12,
      },
    },
    {
      identifier: "A2",
      name: "Sensor Tomate",
      working: false,
      irrigationAvailable: false,
      coordinate: {
        latitude: -23.5605,
        longitude: -46.6433,
      },
      values: {
        temperature: 27,
        humidity: 74.4,
        soil_humidity: 21,
        light: 561,
        uv_intensity: 3,
        soil_temperature: 11,
      },
    },
  ];
};

export const irrigateSensor = async (sensorId: string): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, MOCK_API_DELAY));

  // Simulate random API error
  if (Math.random() < 0.2) {
    throw new Error("Failed to initiate irrigation");
  }
};
