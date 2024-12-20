import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { PaperProvider } from "react-native-paper";
import { ThemeProvider } from "@react-navigation/native";
import { useThemeMode, Theme, Colors } from "@/libs/theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useColorScheme, LogBox } from "react-native";
import * as SystemUI from "expo-system-ui";

export const unstable_settings = { initialRouteName: "(tabs)" };

const queryClient = new QueryClient();

LogBox.ignoreLogs(["Support for defaultProps"]);

export default function RootLayout() {
  const systemColorScheme = useColorScheme();
  const { themeMode } = useThemeMode();

  const selectedTheme =
    themeMode === "auto" ? systemColorScheme || "light" : themeMode;

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(Colors[selectedTheme].secondaryContainer);
  }, [selectedTheme]);

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
