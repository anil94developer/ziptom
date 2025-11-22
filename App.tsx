/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { StatusBar, StyleSheet, useColorScheme } from 'react-native';
import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/navigation';
import { ThemeProvider } from './src/theme/ThemeContext';
import 'react-native-gesture-handler';
import { CartProvider } from './src/context/cartProvider';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import { REACT_APP_API_URL } from "@env";
import CustomToast from './src/componets/customToast';
import { Provider as PaperProvider } from 'react-native-paper';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar hidden={true} />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  console.log("Base URL:", REACT_APP_API_URL);
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <ThemeProvider>
          <CartProvider>
            <Provider store={store}>
              <CustomToast/>
              <AppNavigator />
            </Provider>
          </CartProvider>
        </ThemeProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
