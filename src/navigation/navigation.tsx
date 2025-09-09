import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../pages/auth/login';
import SignupScreen from '../pages/auth/signup';
import SplashScreen from '../pages/splash/SplashScreen';
import HomeScreen from '../pages/home/HomeScreen';
import CityDetailsScreen from '../pages/home/CityDetailsScreen';
import ExploreScreen from '../pages/explore/ExploreScreen';
import SearchScreen from '../pages/search/SearchScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: true }}>
        <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen}  options={{ headerShown: false }} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="CityDetails" component={CityDetailsScreen} />
        <Stack.Screen name="Explore" component={ExploreScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />



      </Stack.Navigator>
    </NavigationContainer>
  );
}
