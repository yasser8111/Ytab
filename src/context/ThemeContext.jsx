import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

const DEFAULT_CUSTOMIZATION = {
  accentColor: "#3b82f6",
  opacity: 0.6,
  blur: 12,
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [customization, setCustomization] = useState(() => {
    const saved = localStorage.getItem("ytab_customization");
    return saved ? JSON.parse(saved) : DEFAULT_CUSTOMIZATION;
  });

  const updateCustomization = (key, value) => {
    setCustomization((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--accent-color", customization.accentColor);
    root.style.setProperty("--card-opacity", customization.opacity);
    root.style.setProperty("--card-blur", `${customization.blur}px`);
    localStorage.setItem("ytab_customization", JSON.stringify(customization));
  }, [customization]);

  return (
    <ThemeContext.Provider
      value={{
        isDarkMode,
        setIsDarkMode,
        customization,
        updateCustomization,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
