import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { Text, useTheme } from "react-native-paper";

interface LoadingComponentProps {
  size?: "small" | "large";
  text?: string;
}

const LoadingComponent: React.FC<LoadingComponentProps> = ({
  size = "large",
  text,
}) => {
  const theme = useTheme();
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size={size} color={theme.colors.primary} />
      {!!text && (
        <Text variant="bodyLarge" style={styles.loadingText}>
          {text}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
  },
});

export default LoadingComponent;
