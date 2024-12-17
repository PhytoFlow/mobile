import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { CommonActions } from "@react-navigation/native";
import React from "react";
import { BottomNavigation } from "react-native-paper";

function TabBar(props: BottomTabBarProps) {
  return (
    <BottomNavigation.Bar
      navigationState={props.state}
      safeAreaInsets={props.insets}
      onTabPress={({ route, preventDefault }) => {
        const event = props.navigation.emit({
          type: "tabPress",
          target: route.key,
          canPreventDefault: true,
        });

        if (event.defaultPrevented) {
          preventDefault();
        } else {
          props.navigation.dispatch({
            ...CommonActions.navigate(route.name, route.params),
            target: props.state.key,
          });
        }
      }}
      renderIcon={({ route, focused, color }) => {
        const { options } = props.descriptors[route.key];
        if (options.tabBarIcon) {
          return options.tabBarIcon({ focused, color, size: 24 });
        }

        return null;
      }}
      getLabelText={({ route }) => {
        return props.descriptors[route.key].options.title;
      }}
    />
  );
}

export default TabBar;
