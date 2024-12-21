import axios from "axios";
import { Dashboard, Sensor } from "../models/backend";

const apiClient = axios.create({
  baseURL: "https://1e68-200-137-197-75.ngrok-free.app",
});

export const fetchSensors = async (): Promise<Sensor[]> => {
  try {
    const response = await apiClient.get("/api/current");

    response.data[0].coordinate.latitude = -16.6008843345875;
    response.data[0].coordinate.longitude = -49.26570230991262;

    return response.data.concat({
      identifier: "A3",
      name: "Sensor B1",
      working: false,
      irrigationAvailable: false,
      coordinate: {
        latitude: -16.605408,
        longitude: -49.263652,
      },
      values: null,
    });
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

    return response.data;
  } catch (error) {
    throw error;
  }
};
