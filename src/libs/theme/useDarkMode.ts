import { useState, useEffect } from "react";
import { useRouter, useGlobalSearchParams } from "expo-router";
import { ColorSchemeName, useColorScheme } from "react-native";
import { Storage } from "../storage";

export const useDarkMode = () => {
  const router = useRouter();
  const systemColorScheme = useColorScheme();
  const { colorScheme: globalColorScheme } = useGlobalSearchParams();

  const [localColorScheme, setLocalColorScheme] = useState<string | null>(null);

  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await Storage.getItem<string>("theme");
      setLocalColorScheme(
        savedTheme ||
          (Array.isArray(globalColorScheme)
            ? globalColorScheme[0]
            : globalColorScheme) ||
          systemColorScheme ||
          "light",
      );
    };
    loadTheme();
  }, [globalColorScheme, systemColorScheme]);

  const toggleTheme = async () => {
    const newScheme = localColorScheme === "light" ? "dark" : "light";
    setLocalColorScheme(newScheme);

    await Storage.setItem("theme", newScheme);

    router.setParams({ colorScheme: newScheme });
  };

  return { toggleTheme, colorScheme: localColorScheme as ColorSchemeName };
};
