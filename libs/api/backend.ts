import axios from "axios";
import { Dashboard, Sensor } from "../models/backend";

const apiClient = axios.create({
  baseURL: "https://1e68-200-137-197-75.ngrok-free.app",
});

export const fetchSensors = async (): Promise<Sensor[]> => {
  try {
    const response = await apiClient.get("/api/current");

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const irrigateSensor = async (sensorId: string): Promise<void> => {
  try {
    await apiClient.post("/api/aguar", {
      identifier: sensorId,
      time: 2000,
    });
  } catch (error) {
    throw error;
  }
};

export const fetchDashboard = async (): Promise<Dashboard> => {
  try {
    const response = await apiClient.get("/api/dashboard");

    console.log(JSON.stringify(response.data, null, 2));

    return response.data;
  } catch (error) {
    throw error;
  }
};

/*
  return [
    {
      identifier: "A2",
      name: "Sensor tomate",
      values: [
        {
          timestamp: "2024-12-19T00:00:00Z",
          temperature: 27.1,
          humidity: 68.4,
          soil_humidity: 15.3,
          uv_intensity: 8.2,
          soil_temperature: 22.4,
          light: 430,
        },
        {
          timestamp: "2024-12-19T00:30:00Z",
          temperature: 27.3,
          humidity: 67.9,
          soil_humidity: 15.5,
          uv_intensity: 8.0,
          soil_temperature: 22.5,
          light: 432,
        },
        {
          timestamp: "2024-12-19T01:00:00Z",
          temperature: 27.5,
          humidity: 67.5,
          soil_humidity: 15.8,
          uv_intensity: 8.3,
          soil_temperature: 22.7,
          light: 435,
        },
        {
          timestamp: "2024-12-19T01:30:00Z",
          temperature: 27.7,
          humidity: 67.1,
          soil_humidity: 16.0,
          uv_intensity: 8.1,
          soil_temperature: 22.8,
          light: 438,
        },
        {
          timestamp: "2024-12-19T02:00:00Z",
          temperature: 27.9,
          humidity: 66.8,
          soil_humidity: 16.2,
          uv_intensity: 8.0,
          soil_temperature: 23.0,
          light: 440,
        },
        {
          timestamp: "2024-12-19T02:30:00Z",
          temperature: 28.0,
          humidity: 66.5,
          soil_humidity: 16.4,
          uv_intensity: 8.1,
          soil_temperature: 23.2,
          light: 445,
        },
        {
          timestamp: "2024-12-19T03:00:00Z",
          temperature: 28.2,
          humidity: 66.2,
          soil_humidity: 16.6,
          uv_intensity: 8.4,
          soil_temperature: 23.3,
          light: 448,
        },
      ],
    },
    {
      identifier: "A1",
      name: "Sensor feijão",
      values: [
        {
          timestamp: "2024-12-19T00:00:00Z",
          temperature: 24.5,
          humidity: 71.2,
          soil_humidity: 29.5,
          uv_intensity: 7.5,
          soil_temperature: 19.3,
          light: 490,
        },
        {
          timestamp: "2024-12-19T00:30:00Z",
          temperature: 24.7,
          humidity: 70.9,
          soil_humidity: 29.7,
          uv_intensity: 7.7,
          soil_temperature: 19.4,
          light: 495,
        },
        {
          timestamp: "2024-12-19T01:00:00Z",
          temperature: 24.9,
          humidity: 70.5,
          soil_humidity: 30.0,
          uv_intensity: 7.8,
          soil_temperature: 19.5,
          light: 500,
        },
        {
          timestamp: "2024-12-19T01:30:00Z",
          temperature: 25.1,
          humidity: 70.3,
          soil_humidity: 30.2,
          uv_intensity: 7.9,
          soil_temperature: 19.6,
          light: 505,
        },
        {
          timestamp: "2024-12-19T02:00:00Z",
          temperature: 25.3,
          humidity: 70.1,
          soil_humidity: 30.5,
          uv_intensity: 8.0,
          soil_temperature: 19.7,
          light: 510,
        },
        {
          timestamp: "2024-12-19T02:30:00Z",
          temperature: 25.5,
          humidity: 69.8,
          soil_humidity: 30.8,
          uv_intensity: 8.1,
          soil_temperature: 19.8,
          light: 515,
        },
        {
          timestamp: "2024-12-19T03:00:00Z",
          temperature: 25.7,
          humidity: 69.6,
          soil_humidity: 31.0,
          uv_intensity: 8.3,
          soil_temperature: 19.9,
          light: 520,
        },
      ],
    },
  ];
};

*/
/*
[
    {
      identifier: "A1",
      name: "Sensor Milho",
      working: true,
      irrigationAvailable: true,
      coordinate: {
        latitude: -16.60659,
        longitude: -49.263305,
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
      working: true,
      irrigationAvailable: false,
      coordinate: {
        latitude: -16.607046,
        longitude: -49.265708,
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
    {
      identifier: "A3",
      name: "Sensor Repolho",
      working: false,
      irrigationAvailable: false,
      coordinate: {
        latitude: -16.605408,
        longitude: -49.263652,
      },
      values: null,
    },
  ];

*/
