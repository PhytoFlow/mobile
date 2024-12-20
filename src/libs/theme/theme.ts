import {
  MD3DarkTheme,
  MD3LightTheme,
  adaptNavigationTheme,
} from "react-native-paper";
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationLightTheme,
} from "@react-navigation/native";
import { Colors } from "./colors";

const AppDarkTheme = { ...MD3DarkTheme, colors: Colors.dark };
const AppLightTheme = { ...MD3LightTheme, colors: Colors.light };

const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationDark: NavigationDarkTheme,
  reactNavigationLight: NavigationLightTheme,
  materialDark: AppDarkTheme,
  materialLight: AppLightTheme,
});

/**
 * Configurações de tema para o aplicativo.
 */
export const Theme = {
  dark: {
    appTheme: AppDarkTheme,
    navigationTheme: DarkTheme,
  },
  light: {
    appTheme: AppLightTheme,
    navigationTheme: LightTheme,
  },
};
