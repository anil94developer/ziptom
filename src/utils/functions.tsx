import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Routes } from '../navigation/routes';

/**
 * Navigation utility functions for your app.
 * Each function navigates to a specific route with optional params.
 */

// Define your route names here

export const useAppNavigation = () => {
  const navigation = useNavigation<NavigationProp<any>>();

  const goToHome = (params?: any) => {
    navigation.navigate(Routes.Home, params);
  };

  const goToLogin = (params?: any) => {
    navigation.navigate(Routes.Login, params);
  };

  const goToRegister = (params?: any) => {
    navigation.navigate(Routes.Register, params);
  };

  const goToDetails = (id: string | number, params?: any) => {
    navigation.navigate(Routes.Dashboard, { id, ...params });
  };

  // Add more navigation functions as needed

  return {
    goToHome,
    goToLogin,
    goToRegister,
    goToDetails,
    // Add more here
  };
};