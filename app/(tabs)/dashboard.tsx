import React, { useState, useMemo } from "react";
import { StyleSheet, Dimensions, View } from "react-native";
import { useTheme } from "react-native-paper";
import { LineChart } from "react-native-chart-kit";
import { useQuery } from "@tanstack/react-query";
import { Dropdown } from "react-native-paper-dropdown";
import {
  Dashboard,
  SensorValueKeys,
  SensorValues,
} from "@/libs/models/backend";
import {
  ScreenWrapper,
  ErrorComponent,
  LoadingComponent,
} from "@/components/shared";
import { fetchDashboard } from "@/libs/api/backend";
import { LineChartData } from "react-native-chart-kit/dist/line-chart/LineChart";
import { chartColors } from "@/libs/theme";
import { rgbToRgba } from "@/libs/utils/rgbToRgba";
import { processFontFamily } from "expo-font";

const getLabelForChart = (values: SensorValues[]) => {
  return values.map((value) =>
    new Date(value.timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }),
  );
};

const SensorDashboard = () => {
  const theme = useTheme();
  const [selectedSensor, setSelectedSensor] = useState<string>("");

  const {
    data: sensors = [],
    isLoading,
    refetch,
    isError,
    error,
    isSuccess,
  } = useQuery<Dashboard>({
    queryKey: ["dashboard"],
    queryFn: fetchDashboard,
    refetchInterval: 30 * 60000,
    refetchIntervalInBackground: true,
    retry: 3,
  });

  if (isSuccess && !selectedSensor && sensors?.length > 0) {
    setSelectedSensor(sensors[0].identifier);
  }

  const selectedSensorData = useMemo(() => {
    return sensors?.find((sensor) => sensor.identifier === selectedSensor);
  }, [sensors, selectedSensor]);

  const getChartColor = (chart: SensorValueKeys) =>
    chartColors[chart][theme.dark ? "dark" : "light"];

  if (isLoading) {
    return <LoadingComponent text="Carregando dados do painel..." />;
  }

  if (isError) {
    return <ErrorComponent error={error.message} refetch={refetch} />;
  }

  const renderChart = (data: LineChartData, unit: string | undefined) => (
    <LineChart
      data={data}
      width={Dimensions.get("window").width - 32}
      height={220}
      yAxisSuffix={unit}
      chartConfig={{
        backgroundColor: theme.colors.surface,
        backgroundGradientFrom: theme.colors.surface,
        backgroundGradientTo: theme.colors.surface,
        color: (opacity = 1) => rgbToRgba(theme.colors.onSurface, opacity),
        labelColor: () => theme.colors.onSurface,
        useShadowColorFromDataset: true,
        decimalPlaces: 1,
        propsForLabels: {
          fontFamily: processFontFamily("PoppinsRegular")!,
          fontSize: 11,
        },
      }}
      style={{
        marginVertical: 8,
        borderRadius: 16,
        alignSelf: "center",
        borderWidth: 1,
        borderColor: theme.colors.outline,
      }}
      segments={5}
    />
  );

  return (
    <ScreenWrapper contentContainerStyle={styles.screenWrapper}>
      <Dropdown
        label="Sensor"
        placeholder="Selecione o sensor"
        options={sensors.map((sensor) => ({
          label: `${sensor.name} (${sensor.identifier})`,
          value: sensor.identifier,
        }))}
        value={selectedSensor}
        // @ts-ignore
        onSelect={setSelectedSensor}
        mode="outlined"
        hideMenuHeader
      />

      <View style={styles.section}>
        {selectedSensorData && (
          <>
            {renderChart(
              {
                labels: getLabelForChart(selectedSensorData.values),
                datasets: [
                  {
                    data: selectedSensorData.values.map(
                      (value) => value.temperature,
                    ),
                    color: (opacity = 1) =>
                      rgbToRgba(getChartColor("temperature"), opacity),
                  },
                  {
                    data: selectedSensorData.values.map(
                      (value) => value.soil_temperature,
                    ),

                    color: (opacity = 1) =>
                      rgbToRgba(getChartColor("soil_temperature"), opacity),
                  },
                ],
                legend: ["Temperatura", "Temperatura do solo"],
              },
              "°C",
            )}
            {renderChart(
              {
                labels: getLabelForChart(selectedSensorData.values),
                datasets: [
                  {
                    data: selectedSensorData.values.map(
                      (value) => value.humidity,
                    ),
                    color: (opacity = 1) =>
                      rgbToRgba(getChartColor("humidity"), opacity),
                  },
                  {
                    data: selectedSensorData.values.map(
                      (value) => value.soil_humidity,
                    ),
                    color: (opacity = 1) =>
                      rgbToRgba(getChartColor("soil_humidity"), opacity),
                  },
                ],
                legend: ["Umidade", "Umidade do solo"],
              },
              "%",
            )}
            {renderChart(
              {
                labels: getLabelForChart(selectedSensorData.values),
                datasets: [
                  {
                    data: selectedSensorData.values.map(
                      (value) => value.uv_intensity,
                    ),
                    color: (opacity = 1) =>
                      rgbToRgba(getChartColor("uv_intensity"), opacity),
                  },
                ],
                legend: ["Índice UV"],
              },
              undefined,
            )}
            {renderChart(
              {
                labels: getLabelForChart(selectedSensorData.values),
                datasets: [
                  {
                    data: selectedSensorData.values.map((value) => value.light),
                    color: (opacity = 1) =>
                      rgbToRgba(getChartColor("light"), opacity),
                  },
                ],
                legend: ["Intensidade da luz"],
              },
              " cd",
            )}
          </>
        )}
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  screenWrapper: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  section: {
    marginTop: 16,
    marginBottom: 8,
  },
  menuButton: {
    marginHorizontal: 16,
    marginTop: 8,
  },
});

export default SensorDashboard;
