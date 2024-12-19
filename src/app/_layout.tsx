import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider,
  adaptNavigationTheme,
} from "react-native-paper";
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationLightTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Colors, useThemeMode } from "@/libs/theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useColorScheme } from "react-native";

const AppDarkTheme = { ...MD3DarkTheme, colors: Colors.dark };
const AppLightTheme = { ...MD3LightTheme, colors: Colors.light };

const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationDark: NavigationDarkTheme,
  reactNavigationLight: NavigationLightTheme,
  materialDark: AppDarkTheme,
  materialLight: AppLightTheme,
});

export const unstable_settings = { initialRouteName: "(tabs)" };

const queryClient = new QueryClient();

const Theme = {
  ["dark"]: {
    appTheme: AppDarkTheme,
    navigationTheme: DarkTheme,
  },
  ["light"]: {
    appTheme: AppLightTheme,
    navigationTheme: LightTheme,
  },
};

export default function RootLayout() {
  const systemColorScheme = useColorScheme();
  const { themeMode } = useThemeMode();

  const selectedTheme =
    themeMode === "auto" ? systemColorScheme || "light" : themeMode;

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
