import React, { useCallback, useEffect, useState } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { Text, ActivityIndicator, useTheme, Button } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { fetchWeatherData } from "@/libs/api/weather";
import { WeatherUI } from "@/libs/models/weather";
import { RenderDay } from "@/components/weather/RenderDay";
import { CurrentWeather } from "@/components/weather/CurrentWeather";
import ScreenWrapper from "@/components/ScreenWrapper";
import NetInfo from "@react-native-community/netinfo";

export default function HomeScreen() {
  const theme = useTheme();
  const [weather, setWeather] = useState<WeatherUI | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getWeatherData = useCallback(async () => {
    try {
      const netState = await NetInfo.fetch();
      if (!netState.isConnected) {
        setError("Sem conexão com a internet");
        setLoading(false);
        return;
      }

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError("Permissão de localização negada");
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const data = await fetchWeatherData({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      setWeather(data);
      setError(null);
    } catch (err) {
      console.error("Erro ao buscar dados meteorológicos:", err);
      setError("Falha ao carregar dados meteorológicos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getWeatherData();
  }, [getWeatherData]);

  const renderError = () => (
    <View style={styles.errorContainer}>
      <MaterialCommunityIcons
        name="alert-circle"
        size={48}
        color={theme.colors.error}
      />
      <Text
        variant="bodyLarge"
        style={[styles.errorText, { color: theme.colors.error }]}
      >
        {error}
      </Text>
      <Button onPress={getWeatherData}>Tentar Novamente</Button>
    </View>
  );

  const renderContent = () => {
    const { current, location, forecast } = weather;

    return (
      <View style={styles.mainContainer}>
        <View style={styles.weatherContainer}>
          <View style={styles.locationContainer}>
            <Text variant="headlineSmall">
              {location.name}, {location.country}
            </Text>
            <MaterialCommunityIcons
              name="map-marker"
              size={20}
              color={theme.colors.onSurfaceVariant}
              style={styles.locationIcon}
            />
          </View>

          <CurrentWeather weather={current} />

          <View style={styles.forecastHeaderContainer}>
            <MaterialCommunityIcons
              name="calendar-month"
              size={28}
              color={theme.colors.onSurfaceVariant}
            />
            <Text variant="titleMedium" style={styles.forecastHeaderText}>
              Previsão diária (às 12h)
            </Text>
          </View>

          <View style={styles.forecastListContainer}>
            <FlatList
              contentContainerStyle={styles.forecastListContent}
              data={forecast}
              renderItem={({ item }) => <RenderDay item={item} />}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => `forecast-${index}`}
            />
          </View>
        </View>
      </View>
    );
  };

  return (
    <ScreenWrapper withScrollView contentContainerStyle={styles.screenWrapper}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
        </View>
      ) : error ? (
        renderError()
      ) : (
        renderContent()
      )}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  screenWrapper: {
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  mainContainer: {
    flex: 1,
  },
  weatherContainer: {
    flex: 1,
    margin: 16,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationIcon: {
    marginLeft: 8,
  },
  forecastHeaderContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  forecastHeaderText: {
    marginLeft: 8,
    marginVertical: 16,
  },
  forecastListContainer: {
    marginHorizontal: -16,
  },
  forecastListContent: {
    gap: 12,
    paddingHorizontal: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  errorText: {
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
});
