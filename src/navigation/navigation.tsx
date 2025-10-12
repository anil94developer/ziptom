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
// import LocationSearch from '../pages/mainApp/locationSearch/LocationSearch';
import SearchProduct from '../pages/mainApp/searchProducts/SearchProduct';
import Profile from '../pages/mainApp/profile/Profile';
import EditProfile from '../pages/mainApp/profile/EditProfile';
import OrderDetailsScreen from '../pages/mainApp/myOrder/OrderDetails';
import OrderTrackingScreen from '../pages/mainApp/myOrder/OrderTrackingScreen';
import CartScreen from '../pages/mainApp/cart/CartScreen';
import OrderPlaceScreen from '../pages/mainApp/orderPlaceScreen/orderPlaceScreen';

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
        <Stack.Screen name="OrderPlaceScreen" component={OrderPlaceScreen} />
        <Stack.Screen name='SearchProduct' component={SearchProduct} />
        <Stack.Screen name='Profile' component={Profile} />
        <Stack.Screen name='EditProfile' component={EditProfile} />
        <Stack.Screen name='OrderDetails' component={OrderDetailsScreen} />
        <Stack.Screen name='OrderTracking' component={OrderTrackingScreen} />
        <Stack.Screen name="CartScreen" component={CartScreen} />




      </Stack.Navigator>
    </NavigationContainer>
  );
}
