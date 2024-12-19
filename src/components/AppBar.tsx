import React, { useCallback } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Appbar, Tooltip, useTheme } from "react-native-paper";
import { Colors, useDarkMode } from "@/libs/theme";

function AppHeader() {
  const theme = useTheme();
  const { colorScheme, toggleTheme } = useDarkMode();

  const IconButton = useCallback(
    (props: { size: number; color: string }) => {
      return colorScheme === "dark" ? (
        <MaterialCommunityIcons
          {...props}
          color={Colors.dark.primary}
          name="white-balance-sunny"
        />
      ) : (
        <MaterialCommunityIcons
          {...props}
          color={Colors.light.primary}
          name="moon-waning-crescent"
        />
      );
    },
    [colorScheme],
  );

  return (
    <Appbar.Header elevated mode="small">
      <Appbar.Content
        title="PhytoFlow"
        titleStyle={{ fontWeight: "bold", color: theme.colors.primary }}
      />
      <Tooltip
        enterTouchDelay={400}
        title={
          colorScheme === "dark"
            ? "Habilitar tema claro"
            : "Habilitar tema escuro"
        }
      >
        <Appbar.Action icon={IconButton} onPress={toggleTheme} />
      </Tooltip>
    </Appbar.Header>
  );
}

export default AppHeader;
