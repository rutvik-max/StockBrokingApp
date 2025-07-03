import React from 'react';
import {
  NavigationContainer,
  DefaultTheme as NavLight,
  DarkTheme as NavDark,
} from '@react-navigation/native';
import {
  Provider as PaperProvider,
  MD3LightTheme,
  MD3DarkTheme,
} from 'react-native-paper';
import TabNavigator from './src/navigation/TabNavigator';
import { WatchlistProvider } from './src/context/WatchlistContext';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';


function ThemedApp() {
  const { isDark } = useTheme();

  const paperTheme = isDark ? MD3DarkTheme : MD3LightTheme;
  const navTheme = isDark ? NavDark : NavLight;

  return (
    <PaperProvider theme={paperTheme}>
      <NavigationContainer theme={navTheme}>
        <TabNavigator />
      </NavigationContainer>
    </PaperProvider>
  );
}


export default function App() {
  return (
    <WatchlistProvider>
      <ThemeProvider>
        <ThemedApp />
      </ThemeProvider>
    </WatchlistProvider>
  );
}










