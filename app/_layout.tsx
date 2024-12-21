import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { PaperProvider } from "react-native-paper";
import { ThemeProvider } from "@react-navigation/native";
import { useThemeMode, Theme, Colors } from "@/libs/theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useColorScheme, LogBox } from "react-native";
import * as SystemUI from "expo-system-ui";
import * as SplashScreen from "expo-splash-screen";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import "react-native-reanimated";

export { ErrorBoundary } from "expo-router";

export const unstable_settings = { initialRouteName: "(tabs)" };

const queryClient = new QueryClient();

LogBox.ignoreLogs(["Support for defaultProps"]);
LogBox.ignoreLogs(["Encountered two children"]);

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const systemColorScheme = useColorScheme();
  const { themeMode } = useThemeMode();

  const [loaded, error] = useFonts({
    RobotoRegular: require("@/assets/fonts/Roboto-Regular.ttf"),
    RobotoMedium: require("@/assets/fonts/Roboto-Medium.ttf"),
    RobotoBold: require("@/assets/fonts/Roboto-Bold.ttf"),
    ...MaterialCommunityIcons.font,
  });

  const selectedTheme =
    themeMode === "auto" ? systemColorScheme || "light" : themeMode;

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(Colors[selectedTheme].secondaryContainer);
  }, [selectedTheme]);

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider theme={Theme[selectedTheme].appTheme}>
        <ThemeProvider value={Theme[selectedTheme].navigationTheme}>
          <Stack
            screenOptions={{
              animation: "slide_from_bottom",
            }}
          >
            <Stack.Screen
              name="(tabs)"
              options={{
                headerShown: false,
              }}
            />
          </Stack>
        </ThemeProvider>

        <StatusBar style={themeMode === "dark" ? "light" : "dark"} />
      </PaperProvider>
    </QueryClientProvider>
  );
}
