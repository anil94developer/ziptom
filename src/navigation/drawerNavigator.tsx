// navigation/DrawerNavigator.tsx

import React from 'react';
import  {createDrawerNavigator}  from '@react-navigation/drawer';
import BottomTabs from './bottomTabs';
import CityDetailsScreen from '../pages/home/CityDetailsScreen';
import CustomDrawerContent from './customDrawerContent';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: 'slide',
      }}
    >
      <Drawer.Screen name="MainTabs" component={BottomTabs} />
      <Drawer.Screen name="CityDetails" component={CityDetailsScreen} />
      {/* Add more drawer screens if needed */}
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
