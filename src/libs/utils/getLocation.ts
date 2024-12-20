import * as Location from "expo-location";

/**
 * Solicita permissão para acessar a localização do dispositivo e retorna a posição atual
 */
export default async function getLocation(): Promise<Location.LocationObject> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    throw new Error(
      "Permissão de localização negada. Habilite as permissões de localização nas configurações do dispositivo.",
    );
  }
  return Location.getCurrentPositionAsync({});
}
