import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { fetchWeather } from "@/libs/api/weather";
import { CurrentWeather, RenderDay } from "@/components/weather";
import {
  ScreenWrapper,
  ErrorComponent,
  LoadingComponent,
} from "@/components/shared";
import { useQuery } from "@tanstack/react-query";

export default function WeatherScreen() {
  const theme = useTheme();
  const {
    data: weather,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["weather"],
    queryFn: fetchWeather,
    refetchInterval: 5 * 60000,
    refetchIntervalInBackground: true,
    retry: 3,
  });

  const renderContent = () => {
    if (!weather) return null;
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
    <ScreenWrapper contentContainerStyle={styles.screenWrapper}>
      {isLoading ? (
        <LoadingComponent text="Carregando dados climáticos..." />
      ) : isError ? (
        <ErrorComponent error={error.message} refetch={refetch} />
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
});
