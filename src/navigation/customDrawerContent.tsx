// navigation/CustomDrawerContent.tsx

import React from 'react';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialIcons';

const CustomDrawerContent = (props: any) => {
  const { colors } = useTheme();

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.primary }]}>Yumzee</Text>

        <DrawerItem
          label="Home"
          icon={({ color, size }) => <Icon name="home" color={color} size={size} />}
          onPress={() => props.navigation.navigate('MainTabs')}
        />
        <DrawerItem
          label="City Details"
          icon={({ color, size }) => <Icon name="location-city" color={color} size={size} />}
          onPress={() => props.navigation.navigate('CityDetails')}
        />

        {/* Add more drawer links if needed */}
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
});

export default CustomDrawerContent;
