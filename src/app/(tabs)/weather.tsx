import React, { useCallback, useEffect, useState } from "react";
import { View, FlatList, Alert } from "react-native";
import { Text, ActivityIndicator, useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { debounce } from "lodash";
import * as Location from "expo-location";
import { fetchWeatherByLatLong } from "@/libs/api/weather";
import { LocationData, WeatherApiResponse } from "@/libs/models/weather";
import { RenderDay } from "@/components/weather/RenderDay";
import { CurrentWeather } from "@/components/weather/CurrentWeather";
import ScreenWrapper from "@/components/ScreenWrapper";

export default function HomeScreen() {
  const theme = useTheme();
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [weather, setWeather] = useState<WeatherApiResponse | null>({
    current: null,
    location: null,
    forecast: null,
  });
  const [loading, setLoading] = useState(true);

  const handelLocation = (loc: { name: string }) => {
    console.log(locations);
    setLocations([]);
    setShowSearchBar(false);
    setLoading(true);
    /*fetchWeatherForecast({
      cityName: loc.name,
    }).then((data) => {
      setWeather(data);
      setLoading(false);
      console.log(data);
    });*/
  };

  const handleSearch = (value: string) => {
    if (value.length > 2) {
      //fetchLocations({ cityName: value }).then((data) => setLocations(data));
    }
  };

  useEffect(() => {
    fetchMyWeatherData();
  }, []);

  const fetchMyWeatherData = async () => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission to access location was denied");
        return;
      }
      Location.getCurrentPositionAsync({}).then((location) => {
        fetchWeatherByLatLong({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        }).then((data) => {
          setWeather(data);
          setLoading(false);
        });
      });
    })();
  };

  const handleDebounce = useCallback(debounce(handleSearch, 500), []);
  const { current, location, forecast } = weather;

  return (
    <ScreenWrapper
      withScrollView
      contentContainerStyle={{
        flexGrow: 1,
      }}
    >
      {loading ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          {/* SEARCH BAR SECTION */}
          {/*<View
            style={{
              marginHorizontal: 16,
              position: "relative",
              zIndex: 10,
            }}
          >
            <SearchBar
              showSearchBar={showSearchBar}
              setShowSearchBar={setShowSearchBar}
              handleDebounce={handleDebounce}
            />
            {locations.length > 0 && showSearchBar ? (
              <LocationsList
                locations={locations}
                handleLocation={handelLocation}
              />
            ) : null}
          </View>*/}

          <View
            style={{
              flex: 1,
              margin: 16,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text variant="headlineSmall">
                {location.name}, {location.country}
              </Text>
              <MaterialCommunityIcons
                name="map-marker"
                size={20}
                color={theme.colors.onSurfaceVariant}
                style={{ marginLeft: 8 }}
              />
            </View>

            <CurrentWeather current={current} />

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <MaterialCommunityIcons
                name="calendar-month"
                size={28}
                color={theme.colors.secondary}
              />
              <Text
                variant="titleMedium"
                style={{
                  marginLeft: 8,
                  marginVertical: 16,
                }}
              >
                Previsão diária (às 12h)
              </Text>
            </View>

            <View style={{ marginHorizontal: -16 }}>
              <FlatList
                contentContainerStyle={{ gap: 12, paddingHorizontal: 16 }}
                data={forecast}
                renderItem={({ item }) => <RenderDay item={item} />}
                horizontal
                overScrollMode="never"
                showsHorizontalScrollIndicator={false}
              />
            </View>
          </View>
        </View>
      )}
    </ScreenWrapper>
  );
}
