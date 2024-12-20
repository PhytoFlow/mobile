import React from "react";
import { View, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Button, Text, useTheme } from "react-native-paper"; // Se estiver usando react-native-paper, caso contrário, substitua por seu componente Button

interface ErrorComponentProps {
  error: string;
  refetch: () => void;
  withRefetch?: boolean;
}

const ErrorComponent: React.FC<ErrorComponentProps> = ({
  error,
  refetch,
  withRefetch = true,
}) => {
  const theme = useTheme();

  return (
    <View style={styles.errorContainer}>
      <MaterialCommunityIcons
        name="alert-circle"
        size={48}
        color={theme.colors.error}
      />
      <Text
        variant="bodyLarge"
        style={[styles.errorText, { color: theme.colors.error }]}
      >
        {error}
      </Text>
      {withRefetch ? <Button onPress={refetch}>Tentar Novamente</Button> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  errorText: {
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
});

export default ErrorComponent;
