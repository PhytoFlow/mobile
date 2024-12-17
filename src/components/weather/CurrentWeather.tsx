import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { Card, Text, useTheme } from "react-native-paper";
import { CurrentWeatherUI } from "@/libs/models/weather";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type CurrentWeatherProp = {
  current: CurrentWeatherUI;
};

export const CurrentWeather: React.FC<CurrentWeatherProp> = ({ current }) => {
  const theme = useTheme();

  const weatherData = [
    {
      label: "Umidade",
      value: `${current.humidity} %`,
      icon: "water" as const,
    },
    {
      label: "Chuva (1h)",
      value: `${current.rain.toFixed(1)} mm/h`,
      icon: "weather-rainy" as const,
    },
    {
      label: "Ponto de orvalho",
      value: `${current.dewPoint} °C`,
      icon: "water-outline" as const,
    },
    {
      label: "Nebulosidade",
      value: `${current.clouds} %`,
      icon: "cloud" as const,
    },
    {
      label: "Vento",
      value: `${(current.wind.speed * 3.6).toFixed(1)} km/h`,
      icon: "weather-windy" as const,
      rotation: current.wind.deg,
    },
    {
      label: "Pressão",
      value: `${current.pressure} mb`,
      icon: "thermometer" as const,
    },
    {
      label: "Visibilidade",
      value: `${(current.visibility / 1000).toFixed(2)} km`,
      icon: "eye" as const,
    },
    {
      label: "Qualidade do ar",
      value: current.airQuality,
      icon: "air-filter" as const,
    },
  ];

  return (
    <React.Fragment>
      <View style={styles.temperatureContainer}>
        <View style={styles.temperatureTextContainer}>
          <Text variant="displayLarge" style={styles.temperatureText}>
            {current.temp}°
          </Text>

          <View style={styles.temperatureDetailsContainer}>
            <Text variant="titleMedium">
              {current.temp_max}°C / {current.temp_min}°C
            </Text>

            <Text variant="titleMedium" style={{ textTransform: "capitalize" }}>
              {current.condition.text}
            </Text>
          </View>
        </View>

        <Image
          source={{
            uri: current.condition?.icon,
          }}
          style={styles.weatherIcon}
        />
      </View>

      <Text variant="titleMedium">
        Sensação térmica de {current.feels_like}°C
      </Text>

      <View style={styles.detailsGridContainer}>
        {weatherData.map((detail, index) => (
          <Card key={index} style={styles.detailCard} mode="outlined">
            <Card.Content style={styles.cardContent}>
              <MaterialCommunityIcons
                name={detail.icon}
                size={24}
                color={theme.colors.onSurfaceVariant}
                style={styles.cardIcon}
              />
              <View>
                <Text variant="bodySmall">{detail.label}</Text>
                <View style={styles.row}>
                  <Text variant="titleMedium">{detail.value}</Text>
                  {detail.rotation !== undefined && (
                    <MaterialCommunityIcons
                      name="arrow-up"
                      size={20}
                      color={theme.colors.onSurfaceVariant}
                      style={{
                        transform: [{ rotate: `${detail.rotation}deg` }],
                        marginLeft: 6,
                      }}
                    />
                  )}
                </View>
              </View>
            </Card.Content>
          </Card>
        ))}
      </View>
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  temperatureContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft: 8,
    marginVertical: 8,
    flex: 1,
  },
  temperatureTextContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  temperatureText: {
    textAlign: "center",
    fontWeight: "bold",
  },
  temperatureDetailsContainer: {
    marginLeft: 12,
  },
  weatherIcon: {
    width: 124,
    height: 124,
    position: "absolute",
    right: 0,
  },
  detailsGridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 6,
    marginTop: 16,
  },
  detailCard: {
    width: "48.5%",
    marginBottom: 6,
    borderRadius: 24,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  cardIcon: {
    marginRight: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
});
