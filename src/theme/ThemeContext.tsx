import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { darkTheme, lightTheme } from './theme';

 

type ThemeType = 'light' | 'dark';
type ColorPalette = typeof lightTheme.colors;

interface ThemeContextProps {
  theme: ThemeType;
  colors: ColorPalette;
  setTheme: (theme: ThemeType) => void;
  setColors: (colors: ColorPalette) => void;
}

const ThemeContext = createContext<ThemeContextProps>({
  theme: 'light',
  colors: darkTheme.colors,
  setTheme: () => {},
  setColors: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const systemScheme = useColorScheme();
  const [theme, setTheme] = useState<ThemeType>(systemScheme === 'dark' ? 'dark' : 'light');
  const [colors, setColors] = useState<ColorPalette>(theme === 'dark' ? darkTheme.colors : lightTheme.colors);

  React.useEffect(() => {
    setColors(theme === 'dark' ? darkTheme.colors : lightTheme.colors);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, colors, setTheme, setColors }}>
      {children}
    </ThemeContext.Provider>
  );
};