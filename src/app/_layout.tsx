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
import { Colors, useDarkMode } from "@/libs/theme";

const AppDarkTheme = { ...MD3DarkTheme, colors: Colors.dark };
const AppLightTheme = { ...MD3LightTheme, colors: Colors.light };

const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationDark: NavigationDarkTheme,
  reactNavigationLight: NavigationLightTheme,
  materialDark: AppDarkTheme,
  materialLight: AppLightTheme,
});

export const unstable_settings = { initialRouteName: "(tabs)" };

export default function RootLayout() {
  const { colorScheme } = useDarkMode();

  return (
    <PaperProvider
      theme={colorScheme === "dark" ? AppDarkTheme : AppLightTheme}
    >
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : LightTheme}>
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

      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
    </PaperProvider>
  );
}
