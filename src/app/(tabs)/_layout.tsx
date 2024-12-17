import TabBar from "@/components/TabBar";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import AppBar from "@/components/AppBar";

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
          title: "Home",
          tabBarIcon: (props) => (
            <MaterialCommunityIcons
              {...props}
              size={24}
              name={props.focused ? "home" : "home-outline"}
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
      <Tabs.Screen
        name="maps"
        options={{
          title: "Mapas",
          tabBarIcon: (props) => (
            <MaterialCommunityIcons
              {...props}
              size={24}
              name={props.focused ? "map" : "map-outline"}
            />
          ),
        }}
      />
    </Tabs>
  );
}

export default TabLayout;
