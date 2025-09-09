import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../../theme/ThemeContext';
import { useAppNavigation } from '../../utils/functions';
  
 

const SplashScreen = ({ navigation }) => {
    const { goToLogin } = useAppNavigation();

  const { theme, colors, setTheme } = useTheme();
  useEffect(() => {
    const timer = setTimeout(() => {
        goToLogin();
    }, 3000); // 300000 ms = 5 minutes

    return () => clearTimeout(timer);
  }, [navigation]);

  return ( 
    <LinearGradient
      colors={[colors.primary, colors.accent]}
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 10 }}
    >
      <ActivityIndicator size="large" color="#007AFF" />
      <Text style={[styles.text,{color:colors.text}]}>Loading...</Text>

    
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