// AppNavigator.tsx

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from '../pages/splash/SplashScreen';
import LoginScreen from '../pages/auth/login';
import SignupScreen from '../pages/auth/signup';
import PersonalDetails from '../pages/auth/personalDetails';
import DrawerNavigator from './drawerNavigator';
import BottomTabs from './bottomTabs';
import RestaurantDetails from '../pages/mainApp/restaurantDetails/RestaurantDetails';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="PersonalDetails" component={PersonalDetails} />
        <Stack.Screen name="MainApp" component={BottomTabs} />
        <Stack.Screen name="RestaurantDetails" component={RestaurantDetails} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
