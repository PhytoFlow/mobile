import { useState, useEffect } from "react";
import { Storage } from "../storage";
import { useGlobalSearchParams, useRouter } from "expo-router";

/**
 * Gerencia o modo de tema (claro, escuro ou automático) com base em configurações globais e armazenadas, permitindo alternar entre os modos.
 */
export const useThemeMode = () => {
  const router = useRouter();
  const { themeMode: globalThemeMode } = useGlobalSearchParams();

  const [localThemeMode, setLocalThemeMode] = useState<
    "light" | "dark" | "auto"
  >("auto");

  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await Storage.getItem<string>("theme");

      setLocalThemeMode(
        savedTheme === "light" || savedTheme === "dark" ? savedTheme : "auto",
      );
    };
    loadTheme();
  }, [globalThemeMode]);

  const toggleTheme = async (newScheme: "light" | "dark" | "auto") => {
    setLocalThemeMode(newScheme);
    await Storage.setItem("theme", newScheme);

    router.setParams({ themeMode: newScheme });
  };

  return { toggleTheme, themeMode: localThemeMode };
};
