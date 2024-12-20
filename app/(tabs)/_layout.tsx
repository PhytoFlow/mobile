import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { AppBar, TabBar } from "@/components/layout";


function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        tabBarHideOnKeyboard: true,
        header: () => <AppBar />,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Sensores",
          tabBarIcon: (props) => (
            <MaterialCommunityIcons
              {...props}
              size={24}
              name={props.focused ? "map" : "map-outline"}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Painel",
          tabBarIcon: (props) => (
            <MaterialCommunityIcons
              {...props}
              size={24}
              name={
                props.focused
                  ? "view-dashboard-variant"
                  : "view-dashboard-variant-outline"
              }
            />
          ),
        }}
      />
      <Tabs.Screen
        name="weather"
        options={{
          title: "Clima",
          tabBarIcon: (props) => (
            <MaterialCommunityIcons
              {...props}
              size={24}
              name={props.focused ? "weather-sunny" : "weather-sunset"}
            />
          ),
        }}
      />
    </Tabs>
  );
}

export default TabLayout;
