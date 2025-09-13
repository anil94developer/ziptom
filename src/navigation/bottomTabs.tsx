import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../pages/mainApp/home/HomeScreen';
import ExploreScreen from '../pages/mainApp/explore/ExploreScreen';
import SearchScreen from '../pages/mainApp/highProtien/HighProtien';
import TenMins from '../pages/mainApp/10min/Tenmins';
import ReOrderScreen from '../pages/mainApp/myOrder/MyOrder';
import { useTheme } from '../theme/ThemeContext';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { View } from 'react-native';
import HighProtien from '../pages/mainApp/highProtien/HighProtien';
import MyOrderScreen from '../pages/mainApp/myOrder/MyOrder';

const Tab = createBottomTabNavigator();

const BottomTabs = () => {
    const { colors } = useTheme();

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.text,
                tabBarStyle: {
                    backgroundColor: colors.surface,
                    borderTopColor: colors.border,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                },
            }}
        >
            <Tab.Screen
                name="HomeTab"
                component={HomeScreen}
                options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="home" size={size} color={color} />
                    ),
                }}
            />

            <Tab.Screen
                name="ExploreTab"
                component={ExploreScreen}
                options={{
                    tabBarLabel: 'Near Me',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="map" size={size} color={color} />
                    ),
                }}
            />

            <Tab.Screen
                name="tenMinTab"
                component={TenMins}
                options={{
                    tabBarLabel: '10 mins',
                    tabBarIcon: ({ color, size }) => (
                        <View style={{ position: 'absolute', top: -40, backgroundColor: colors.primary, borderRadius: 360, padding: 6,width:60,height:60,justifyContent:'center',alignItems:'center' }}>
                            <MaterialIcons name="timer" size={size} color={'#fff'} />
                        </View>
                    ),
                }}
            />

            <Tab.Screen
                name="HighProtienTab"
                component={HighProtien}
                options={{
                    tabBarLabel: 'High Protein',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="fitness-center" size={size} color={color} />

                    ),
                }}
            />

            <Tab.Screen
                name="MyOrderScreenTabs"
                component={MyOrderScreen}
                options={{
                    tabBarLabel: 'My Order',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="list" size={size} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

export default BottomTabs;
