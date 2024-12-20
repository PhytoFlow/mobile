import React from "react";
import { Appbar, Divider, Menu, Tooltip, useTheme } from "react-native-paper";
import { useThemeMode } from "@/libs/theme";

type ThemeOption = {
  label: string;
  value: "light" | "dark" | "auto";
  icon: string;
};

function AppHeader() {
  const theme = useTheme();
  const { themeMode, toggleTheme } = useThemeMode();
  const [visible, setVisible] = React.useState(false);

  const showMenu = () => setVisible(true);
  const hideMenu = () => setVisible(false);

  const handleThemeChange = (theme: ThemeOption["value"]) => {
    toggleTheme(theme);
    hideMenu();
  };

  const themeOptions: ThemeOption[] = [
    { label: "Automático (Sistema)", value: "auto", icon: "cog" },
    { label: "Tema Claro", value: "light", icon: "white-balance-sunny" },
    { label: "Tema Escuro", value: "dark", icon: "weather-night" },
  ];

  return (
    <Appbar.Header elevated mode="small">
      <Appbar.Content
        title="PhytoFlow"
        titleStyle={{ fontWeight: "bold", color: theme.colors.primary }}
      />
      <Menu
        visible={visible}
        onDismiss={hideMenu}
        anchorPosition={"bottom"}
        anchor={
          <Tooltip enterTouchDelay={400} title={"Escolher tema"}>
            <Appbar.Action
              icon={"theme-light-dark"}
              color={theme.colors.primary}
              onPress={showMenu}
            />
          </Tooltip>
        }
      >
        {themeOptions.map((option) => (
          <React.Fragment key={option.value}>
            <Menu.Item
              title={option.label}
              onPress={() => handleThemeChange(option.value)}
              leadingIcon={option.icon}
              style={{
                backgroundColor:
                  option.value === themeMode
                    ? theme.colors.secondaryContainer
                    : "transparent",
              }}
            />
            {option.value !== "auto" && <Divider />}
          </React.Fragment>
        ))}
      </Menu>
    </Appbar.Header>
  );
}

export default AppHeader;
