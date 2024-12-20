import React from "react";
import { Image, View, StyleSheet } from "react-native";
import { Text, Card, useTheme } from "react-native-paper";
import { ForecastUI } from "@/libs/models/weather";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type RenderImageProp = {
  item: ForecastUI;
};

const RenderDay: React.FC<RenderImageProp> = ({ item }) => {
  const theme = useTheme();
  const date = new Date(item.date);
  const options: Intl.DateTimeFormatOptions = { weekday: "long" };
  const dayName = date.toLocaleDateString("pt-BR", options);

  return (
    <Card mode="outlined" style={styles.card}>
      <Card.Content style={styles.cardContent}>
        <Text variant="bodyMedium" style={styles.dayName}>
          {dayName}
        </Text>

        <Image source={{ uri: item.condition.icon }} style={styles.icon} />

        <View style={styles.humidityContainer}>
          <MaterialCommunityIcons
            name={"water"}
            size={14}
            color={theme.colors.onSurfaceVariant}
          />
          <Text variant="bodySmall" style={styles.humidityText}>
            {item.humidity} %
          </Text>
        </View>

        <Text variant="bodySmall" numberOfLines={1} style={styles.description}>
          {item.condition.description}
        </Text>

        <Text
          variant="titleMedium"
          style={[styles.temp, { color: theme.colors.primary }]}
        >
          {item.temp} °C
        </Text>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 128,
    borderRadius: 24,
  },
  cardContent: {
    alignItems: "center",
    width: "100%",
  },
  dayName: {
    textTransform: "capitalize",
  },
  icon: {
    width: 48,
    height: 48,
  },
  humidityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  humidityText: {
    marginLeft: 4,
  },
  description: {
    marginTop: 4,
    textAlign: "center",
  },
  temp: {
    marginTop: 4,
  },
});

export default RenderDay;
