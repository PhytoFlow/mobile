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
  Snackbar,
} from "react-native-paper";
import { WEATHER_CONFIG } from "@/libs/api/weather";
import { Coordinate, Sensor } from "@/libs/models/backend";
import { fetchSensors, irrigateSensor } from "@/libs/api/backend";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  LoadingComponent,
  ErrorComponent,
  ScreenWrapper,
} from "@/components/shared";

interface MapLayer {
  key:
    | "temp_new"
    | "precipitation_new"
    | "clouds_new"
    | "wind_new"
    | "pressure_new"
    | "none";
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
  const queryClient = useQueryClient();

  const mapRef = useRef<MapView | null>(null);
  const markerRefs = useRef<Record<string, MapMarker | null>>({});

  const [currentLocation, setCurrentLocation] = useState<Region | null>(null);
  const [currentMapLayer, setCurrentMapLayer] =
    useState<MapLayer["key"]>("none");
  const [isSensorsModalVisible, setSensorsModalVisible] =
    useState<boolean>(false);
  const [isLayerModalVisible, setLayerModalVisible] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useState<{
    visible: boolean;
    message: string;
    type: "success" | "error";
  }>({
    visible: false,
    message: "",
    type: "success",
  });

  const {
    data: sensors,
    isLoading: isLoadingSensors,
    isLoadingError: isSensorsError,
    refetch: sensorsRefetch,
  } = useQuery({
    queryKey: ["sensors"],
    queryFn: fetchSensors,
    refetchInterval: 60000,
    refetchIntervalInBackground: true,
    retry: 3,
  });

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

  const irrigateMutation = useMutation({
    mutationFn: irrigateSensor,
    onSuccess: () => {
      setSnackbar({
        visible: true,
        message: "Irrigação iniciada com sucesso!",
        type: "success",
      });

      queryClient.invalidateQueries({ queryKey: ["sensors"] });
    },
    onError: (error: Error) => {
      console.error(error);
      setSnackbar({
        visible: true,
        message: `Erro ao irrigar, tente novamente`,
        type: "error",
      });
    },
    onSettled: () => {
      setSensorsModalVisible(false);
    },
  });

  const handleIrrigation = (sensorId: string) => {
    irrigateMutation.mutate(sensorId);
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
      title: "Intensidade da luz",
      description: `${sensor.values.light} cd`,
      icon: "lightbulb-on",
    },
    {
      title: "Índice UV",
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
    let locationSubscription: Location.LocationSubscription | null = null;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync({});
        const initialRegion: Region = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922 / 8,
          longitudeDelta: 0.0421 / 8,
        };
        setCurrentLocation(initialRegion);

        try {
          locationSubscription = await Location.watchPositionAsync(
            {
              accuracy: Location.Accuracy.High,
              timeInterval: 1000,
              distanceInterval: 1,
            },
            (newLocation) => {
              setCurrentLocation((prev) => ({
                latitude: newLocation.coords.latitude,
                longitude: newLocation.coords.longitude,
                latitudeDelta: prev?.latitudeDelta || 0.0922 / 8,
                longitudeDelta: prev?.longitudeDelta || 0.0421 / 8,
              }));
            },
          );
        } catch (error) {
          console.error("Erro ao monitorar localização:", error);
          setSnackbar({
            visible: true,
            message: "Erro ao atualizar localização",
            type: "error",
          });
        }
      }
    })();

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, []);

  useEffect(() => {
    Object.values(markerRefs.current).forEach((marker) => {
      if (marker?.hideCallout) {
        marker.hideCallout();
      }
    });
  }, [theme.dark]);

  const handleMarkerPress = (
    coordinate: Coordinate,
    sensorId: string,
  ): void => {
    const offset: Region = {
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
      latitudeDelta: 0.002,
      longitudeDelta: 0.002,
    };

    offset.latitude += offset.latitudeDelta * 0.5;

    mapRef.current?.animateToRegion(offset, 1000);

    setTimeout(() => {
      markerRefs.current[sensorId]?.showCallout();
    });
  };

  const SensorsModal: React.FC = () => {
    return (
      <Portal>
        <Modal
          visible={isSensorsModalVisible}
          onDismiss={() => {
            if (irrigateMutation.isPending) return;

            setSensorsModalVisible(false);
          }}
          contentContainerStyle={styles.modalContainer}
        >
          <Surface style={[styles.modalContent, { width: "100%" }]}>
            <Text variant="titleMedium" style={styles.modalTitle}>
              Sensores disponíveis
            </Text>
            <Divider style={{ marginBottom: 8 }} />
            {sensors?.map((sensor) => (
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
                    disabled={
                      !sensor.irrigationAvailable ||
                      !sensor.working ||
                      irrigateMutation.isPending
                    }
                    loading={
                      irrigateMutation.isPending &&
                      irrigateMutation.variables === sensor.identifier
                    }
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

  const handleZoomIn = () => {
    if (!mapRef.current) return;

    mapRef.current.getCamera().then((camera) => {
      camera.zoom = (camera.zoom || 15) + 1;
      mapRef.current?.animateCamera(camera, { duration: 300 });
    });
  };

  const handleZoomOut = () => {
    if (!mapRef.current) return;

    mapRef.current.getCamera().then((camera) => {
      camera.zoom = Math.max((camera.zoom || 15) - 1, 0);
      mapRef.current?.animateCamera(camera, { duration: 300 });
    });
  };

  const handleMyLocation = async () => {
    const region: Region = {
      latitude: currentLocation!.latitude,
      longitude: currentLocation!.longitude,
      latitudeDelta: 0.0922 / 8,
      longitudeDelta: 0.0421 / 8,
    };

    const boundaries = await mapRef.current?.getMapBoundaries();

    if (!boundaries) {
      mapRef.current?.animateToRegion(region, 800);
      return;
    }

    const latitudeDelta =
      boundaries.northEast.latitude - boundaries.southWest.latitude;
    const longitudeDelta =
      boundaries.northEast.longitude - boundaries.southWest.longitude;

    mapRef.current?.animateToRegion(
      {
        ...region,
        latitudeDelta:
          latitudeDelta > region.latitudeDelta
            ? region.latitudeDelta
            : latitudeDelta,
        longitudeDelta:
          longitudeDelta > region.longitudeDelta
            ? region.longitudeDelta
            : longitudeDelta,
      },
      800,
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

  if (isLoadingSensors) {
    return <LoadingComponent text="Carregando sensores..." />;
  }

  if (isSensorsError || !sensors) {
    return (
      <ErrorComponent
        error={
          isSensorsError
            ? "Ocorreu um erro ao carregar os sensores."
            : "Não existe nenhum sensor cadastrado"
        }
        refetch={sensorsRefetch}
        withRefetch={isSensorsError}
      />
    );
  }

  return (
    <ScreenWrapper withScrollView={false}>
      <MapView
        ref={mapRef}
        mapType="hybrid"
        rotateEnabled={false}
        pitchEnabled={false}
        provider={PROVIDER_GOOGLE}
        style={StyleSheet.absoluteFillObject}
        initialRegion={{
          latitude: currentLocation
            ? currentLocation.latitude
            : sensors[0].coordinate.latitude,
          longitude: currentLocation
            ? currentLocation.longitude
            : sensors[0].coordinate.latitude,
          latitudeDelta: 0.0922 / 8,
          longitudeDelta: 0.0421 / 8,
        }}
        showsUserLocation
        showsMyLocationButton={false}
        zoomControlEnabled={false}
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
            onPress={() =>
              handleMarkerPress(sensor.coordinate, sensor.identifier)
            }
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
                      icon={sensor.irrigationAvailable ? "water" : "water-off"}
                      disabled={!sensor.irrigationAvailable}
                    >
                      {sensor.irrigationAvailable
                        ? "Irrigar disponível"
                        : "Irrigar indisponível"}
                    </Chip>
                  </View>

                  {!sensor.working
                    ? null
                    : getSensorItems(sensor).map((item, index) => (
                        <List.Item
                          key={index}
                          title={() => (
                            <Text>
                              {item.title}
                              {": "}
                              <Text
                                style={{
                                  fontWeight: "bold",
                                }}
                              >
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

      <FAB
        icon="plus"
        size="small"
        variant="secondary"
        onPress={handleZoomIn}
        style={styles.zoomInButton}
      />
      <FAB
        icon="minus"
        size="small"
        variant="secondary"
        onPress={handleZoomOut}
        style={styles.zoomOutButton}
      />

      {currentLocation && (
        <FAB
          icon="crosshairs-gps"
          size="small"
          variant="secondary"
          onPress={handleMyLocation}
          style={styles.findMeButton}
        />
      )}

      <MapLayerLegend />
      <SensorsModal />
      <LayerSelectionModal />

      <Snackbar
        visible={snackbar.visible}
        onDismiss={() => setSnackbar((prev) => ({ ...prev, visible: false }))}
        duration={3000}
        style={{
          backgroundColor:
            snackbar.type === "success"
              ? theme.colors.primary
              : theme.colors.error,
        }}
        action={{
          label: "OK",
          onPress: () => setSnackbar((prev) => ({ ...prev, visible: false })),
        }}
      >
        {snackbar.message}
      </Snackbar>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  layerButton: {
    position: "absolute",
    bottom: 36,
    left: 12,
  },
  sensorsButton: {
    position: "absolute",
    bottom: 104,
    left: 12,
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
    top: 12,
    left: 12,
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
  zoomInButton: {
    position: "absolute",
    bottom: 64,
    right: 12,
  },
  zoomOutButton: {
    position: "absolute",
    bottom: 12,
    right: 12,
  },
  findMeButton: {
    position: "absolute",
    top: 12,
    right: 12,
  },
});
