import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import { colorScheme } from "nativewind";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Appearance, View } from "react-native";
import { themes } from "../utils/color-theme";

interface ThemeProviderProps {
  children: React.ReactNode;
}

type ThemeContextType = {
  theme: "light" | "dark";
  toggleTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {}
});

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark">("light");

  console.log("ThemeProvider - currentTheme:", currentTheme);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem("theme");
        if (saved === "light" || saved === "dark") {
          setCurrentTheme(saved);
          return;
        }
      } catch {
        /* ignore */
      }
      const system = Appearance.getColorScheme();
      setCurrentTheme(system === "dark" ? "dark" : "light");
    })();
  }, []);

  // apply to NativeWind + persist when theme changes
  useEffect(() => {
    colorScheme.set(currentTheme);
    AsyncStorage.setItem("theme", currentTheme).catch(() => {
      /* ignore */
    });
  }, [currentTheme]);

  const toggleTheme = () => {
    setCurrentTheme((t) => (t === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme: currentTheme, toggleTheme }}>
      <StatusBar style={currentTheme === "dark" ? "light" : "dark"} />
      <View style={themes[currentTheme]} className="flex-1">
        {children}
      </View>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
