import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../../theme/ThemeContext';
import { useAppNavigation } from '../../utils/functions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { requestAllPermissions } from '../../utils/permissionHelper';



const SplashScreen = ({ navigation }) => {
  const { goToLogin, goToMainApp } = useAppNavigation();

  const { theme, colors, setTheme } = useTheme();
  useEffect(() => {
    const timer = setTimeout(() => {
      checkLoginStatus();
    }, 3000); // 300000 ms = 5 minutes

    return () => clearTimeout(timer);
  }, [navigation]);


  const checkLoginStatus = async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
 

    const permissions = await requestAllPermissions();
    console.log("All permissions handled:", permissions);

    let token = null;
    try {
      token = await AsyncStorage.getItem('token');
      if (token) {
        goToMainApp();
      } else {
        goToLogin();
      }
    } catch (error) {
      console.error('Error retrieving token:', error);
    }
  }

  return (
    <LinearGradient
      colors={[colors.primary, colors.accent]}
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 10 }}
    >
      <ActivityIndicator size="large" color="#007AFF" />
      <Text style={[styles.text, { color: colors.text }]}>Loading...</Text>


    </LinearGradient>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    marginTop: 16,
    fontSize: 20,
    color: '#007AFF',
    fontWeight: 'bold',
  },
});

export default SplashScreen;