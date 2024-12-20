import {
  MD3DarkTheme,
  MD3LightTheme,
  adaptNavigationTheme,
  configureFonts,
} from "react-native-paper";
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationLightTheme,
} from "@react-navigation/native";
import { Colors } from "./colors";

const baseVariants = configureFonts({
  config: { fontFamily: "RobotoRegular" },
});

const customVariants = {
  titleMedium: {
    ...baseVariants.titleMedium,
    fontFamily: "RobotoMedium",
  },
  labelMedium: {
    ...baseVariants.labelMedium,
    fontFamily: "RobotoMedium",
  },
} as const;

const fonts = configureFonts({
  config: {
    ...baseVariants,
    ...customVariants,
  },
});

const AppDarkTheme = { ...MD3DarkTheme, fonts, colors: Colors.dark };
const AppLightTheme = { ...MD3LightTheme, fonts, colors: Colors.light };

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
