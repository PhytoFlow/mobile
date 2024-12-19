import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet } from "react-native";
import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  UrlTile,
  Callout,
  Region,
  MapMarker,
} from "react-native-maps";
import * as Location from "expo-location";
import {
  Modal,
  Portal,
  Text,
  Surface,
  List,
  Divider,
  FAB,
  useTheme,
  Chip,
  Button,
} from "react-native-paper";
import { WEATHER_CONFIG } from "@/libs/api/weather";

interface Coordinate {
  latitude: number;
  longitude: number;
}

interface SensorValues {
  temperature: number;
  humidity: number;
  soil_humidity: number;
  light: number;
  uv_intensity: number;
  soil_temperature: number;
}

interface Sensor {
  identifier: string;
  name: string;
  working: boolean;
  irrigationAvailable: boolean;
  coordinate: Coordinate;
  values: SensorValues;
}

interface MapLayer {
  key: string;
  label: string;
  icon: string;
  color: string;
}

interface SensorItem {
  title: string;
  description: string;
  icon: string;
}

export default function IndexScreen() {
  const theme = useTheme();
  const mapRef = useRef<MapView | null>(null);
  const markerRefs = useRef<Record<string, MapMarker | null>>({});
  const [currentLocation, setCurrentLocation] = useState<Region | null>(null);
  const [currentMapLayer, setCurrentMapLayer] = useState<string>("none");
  const [isSensorsModalVisible, setSensorsModalVisible] =
    useState<boolean>(false);
  const [isLayerModalVisible, setLayerModalVisible] = useState<boolean>(false);
  const [sensors, setSensors] = useState<Sensor[]>([]);

  const MAP_LAYERS: MapLayer[] = [
    {
      key: "temp_new",
      label: "Temperatura",
      icon: "thermometer",
      color: "#FF6347",
    },
    {
      key: "precipitation_new",
      label: "Precipitação",
      icon: "water",
      color: "#4169E1",
    },
    {
      key: "clouds_new",
      label: "Nuvens",
      icon: "cloud",
      color: "#87CEFA",
    },
    {
      key: "wind_new",
      label: "Velocidade do vento",
      icon: "weather-windy",
      color: "#20B2AA",
    },
    {
      key: "pressure_new",
      label: "Pressão atmosférica",
      icon: "gauge",
      color: "#32CD32",
    },
    {
      key: "none",
      label: "Nenhuma",
      icon: "eye-off",
      color: theme.colors.onSurfaceDisabled,
    },
  ];

  const handleIrrigation = (sensorId: string): void => {
    console.log(`Irrigando sensor ${sensorId}`);
  };

  const getSensorItems = (sensor: Sensor): SensorItem[] => [
    {
      title: "Temperatura",
      description: `${sensor.values.temperature} °C`,
      icon: "thermometer",
    },
    {
      title: "Umidade do ar",
      description: `${sensor.values.humidity} %`,
      icon: "water-percent",
    },
    {
      title: "Umidade do Solo",
      description: `${sensor.values.soil_humidity} %`,
      icon: "sprinkler",
    },
    {
      title: "Luminosidade",
      description: `${sensor.values.light} lux`,
      icon: "lightbulb-on",
    },
    {
      title: "Intensidade UV",
      description: `${sensor.values.uv_intensity}`,
      icon: "sun-wireless",
    },
    {
      title: "Temperatura do Solo",
      description: `${sensor.values.soil_temperature} °C`,
      icon: "thermometer-lines",
    },
  ];

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync({});
        const initialRegion: Region = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        };
        setCurrentLocation(initialRegion);

        // Simulação de pontos de irrigação
        const mockSensors: Sensor[] = [
          {
            identifier: "A1",
            name: "Sensor Milho",
            working: true,
            irrigationAvailable: true,
            coordinate: {
              latitude: location.coords.latitude + 0.014,
              longitude: location.coords.longitude + 0.014,
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
              latitude: location.coords.latitude + 0.017,
              longitude: location.coords.longitude + 0.017,
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
        setSensors(mockSensors);
      }
    })();
  }, []);

  const handleMarkerPress = (
    coordinate: Coordinate,
    sensorId?: string,
  ): void => {
    const offset: Region = {
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    };

    offset.latitude += offset.latitudeDelta * 0.3;

    mapRef.current?.animateToRegion(offset, 700);
    if (sensorId) {
      setTimeout(() => {
        markerRefs.current[sensorId]?.showCallout();
      }, 800);
    }
  };

  const SensorsModal: React.FC = () => {
    return (
      <Portal>
        <Modal
          visible={isSensorsModalVisible}
          onDismiss={() => setSensorsModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Surface style={[styles.modalContent, { width: "100%" }]}>
            <Text variant="titleMedium" style={styles.modalTitle}>
              Sensores disponíveis
            </Text>
            <Divider style={{ marginBottom: 8 }} />
            {sensors.map((sensor) => (
              <List.Item
                key={sensor.identifier}
                title={`${sensor.name} ${sensor.identifier}`}
                description={sensor.working ? "Em operação" : "Desligado"}
                left={(props) => (
                  <List.Icon
                    {...props}
                    icon="leaf-circle-outline"
                    color={theme.colors.primary}
                  />
                )}
                right={() => (
                  <Button
                    mode="contained"
                    icon="water"
                    onPress={() => handleIrrigation(sensor.identifier)}
                    disabled={!sensor.irrigationAvailable || !sensor.working}
                  >
                    Irrigar
                  </Button>
                )}
                onPress={() => {
                  handleMarkerPress(sensor.coordinate, sensor.identifier);
                  setSensorsModalVisible(false);
                }}
              />
            ))}
          </Surface>
        </Modal>
      </Portal>
    );
  };

  const LayerSelectionModal: React.FC = () => {
    const currentLayerInfo = MAP_LAYERS.find(
      (l) => l.key === currentMapLayer,
    ) as MapLayer;

    return (
      <Portal>
        <Modal
          visible={isLayerModalVisible}
          onDismiss={() => setLayerModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Surface style={styles.modalContent}>
            <Text variant="titleMedium" style={styles.modalTitle}>
              Selecione a camada do mapa
            </Text>
            {MAP_LAYERS.map((layer) => (
              <List.Item
                key={layer.key}
                title={layer.label}
                style={{
                  backgroundColor:
                    currentLayerInfo.key === layer.key
                      ? theme.colors.secondaryContainer
                      : "transparent",
                }}
                left={(props) => (
                  <List.Icon {...props} icon={layer.icon} color={layer.color} />
                )}
                onPress={() => {
                  setCurrentMapLayer(layer.key);
                  setLayerModalVisible(false);
                }}
              />
            ))}
          </Surface>
        </Modal>
      </Portal>
    );
  };

  const MapLayerLegend: React.FC = () => {
    const currentLayerInfo = MAP_LAYERS.find(
      (l) => l.key === currentMapLayer,
    ) as MapLayer;

    return (
      <Chip icon={currentLayerInfo.icon} style={styles.legendChip}>
        <Text variant="labelMedium">
          {currentLayerInfo.key === "none"
            ? "Nenhuma camada"
            : currentLayerInfo.label}
        </Text>
      </Chip>
    );
  };

  return (
    <View style={styles.container}>
      {currentLocation && (
        <MapView
          ref={mapRef}
          mapType="hybrid"
          rotateEnabled={false}
          pitchEnabled={false}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={currentLocation}
          showsUserLocation
          showsMyLocationButton
          zoomControlEnabled
          zoomEnabled
          showsPointsOfInterest={false}
          showsCompass={false}
          showsBuildings={false}
          toolbarEnabled={false}
          loadingEnabled={true}
          loadingIndicatorColor={theme.colors.primary}
          loadingBackgroundColor={theme.colors.background}
        >
          {sensors.map((sensor) => (
            <Marker
              ref={(ref) => (markerRefs.current[sensor.identifier] = ref)}
              key={sensor.identifier}
              coordinate={sensor.coordinate}
              title={`${sensor.name} (${sensor.identifier})`}
              pinColor={sensor.working ? "green" : "wheat"}
              calloutAnchor={{ x: 0.5, y: -0.15 }}
              onPress={() => handleMarkerPress(sensor.coordinate)}
            >
              <Callout tooltip>
                <View style={{ alignItems: "center" }}>
                  <Surface elevation={2} style={styles.surfaceTooltip}>
                    <Text variant="titleMedium" style={styles.modalTitle}>
                      {sensor.name} ({sensor.identifier})
                    </Text>
                    <Divider style={{ marginBottom: 8 }} />

                    <View style={styles.chipRow}>
                      <Chip
                        icon={sensor.working ? "check-circle" : "alert-circle"}
                        textStyle={
                          sensor.working
                            ? undefined
                            : { color: theme.colors.error }
                        }
                        style={
                          sensor.working
                            ? undefined
                            : { backgroundColor: theme.colors.errorContainer }
                        }
                        theme={{
                          colors: {
                            primary: !sensor.working
                              ? theme.colors.error
                              : theme.colors.primary,
                          },
                        }}
                      >
                        {sensor.working ? "Em operação" : "Desligado"}
                      </Chip>
                      <Chip
                        icon={
                          sensor.irrigationAvailable ? "water" : "water-off"
                        }
                        disabled={!sensor.irrigationAvailable}
                      >
                        {sensor.irrigationAvailable
                          ? "Irrigar Disponível"
                          : "Irrigar Indisponível"}
                      </Chip>
                    </View>

                    {getSensorItems(sensor).map((item, index) => (
                      <List.Item
                        key={index}
                        title={() => (
                          <Text>
                            {item.title}:{" "}
                            <Text style={{ fontWeight: "bold" }}>
                              {item.description}
                            </Text>
                          </Text>
                        )}
                        left={(props) => (
                          <List.Icon
                            icon={item.icon}
                            {...props}
                            color={theme.colors.primary}
                          />
                        )}
                      />
                    ))}
                  </Surface>
                  {/* Arrow */}
                  <View
                    style={[
                      styles.arrow,
                      {
                        borderTopColor: theme.colors.elevation.level2,
                      },
                    ]}
                  />
                </View>
              </Callout>
            </Marker>
          ))}
          {currentMapLayer !== "none" && (
            <UrlTile
              key={currentMapLayer}
              urlTemplate={`${WEATHER_CONFIG.MAP_URL}/${currentMapLayer}/{z}/{x}/{y}.png?appid=${WEATHER_CONFIG.API_KEY}`}
              zIndex={-1}
            />
          )}
        </MapView>
      )}

      <FAB
        icon="leaf"
        variant="secondary"
        style={styles.sensorsButton}
        onPress={() => setSensorsModalVisible(true)}
      />

      <FAB
        icon="layers"
        variant="secondary"
        style={styles.layerButton}
        onPress={() => setLayerModalVisible(true)}
      />

      <MapLayerLegend />
      <SensorsModal />
      <LayerSelectionModal />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  layerButton: {
    position: "absolute",
    bottom: 35,
    left: 10,
  },
  sensorsButton: {
    position: "absolute",
    bottom: 105,
    left: 10,
  },
  legendGradient: {
    height: 20,
    width: "100%",
    backgroundColor: "linear-gradient(to right, blue, red)",
  },
  irrigationList: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    paddingHorizontal: 10,
  },
  irrigationChip: {
    marginRight: 10,
  },
  modalContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "85%",
    padding: 16,
    borderRadius: 16,
  },
  modalTitle: {
    marginBottom: 16,
    textAlign: "center",
  },
  chipRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  legendChip: {
    position: "absolute",
    top: 10,
    left: 10,
    opacity: 0.8,
  },
  irrigationControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  timeInput: {
    flex: 1,
    maxWidth: "60%",
  },
  surfaceTooltip: {
    padding: 16,
    borderRadius: 12,
  },
  arrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 10,
    borderStyle: "solid",
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
  },
});
