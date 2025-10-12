/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NewAppScreen } from '@react-native/new-app-screen';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/navigation';
import { ThemeProvider } from './src/theme/ThemeContext';
import 'react-native-gesture-handler';
import { CartProvider } from './src/context/cartProvider';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar hidden={true} />

      <AppContent />
    </SafeAreaProvider>
  );
}

import { REACT_APP_API_URL } from "@env";
import CustomToast from './src/componets/customToast';
import DraggableCartView from './src/componets/draggableCartView';
function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();

  console.log("Base URL:", REACT_APP_API_URL);
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <CartProvider>
          <Provider store={store}>
            <CustomToast/>
            {/* <DraggableCartView />  */}
            <AppNavigator />
          </Provider>
        </CartProvider>

      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
