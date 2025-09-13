import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Routes } from '../navigation/routes';

/**
 * Navigation utility functions for your app.
 * Each function navigates to a specific route with optional params.
 */

// Define your route names here

export const useAppNavigation = () => {
  const navigation = useNavigation<NavigationProp<any>>();

  const goToMainApp = (params?: any) => {
    navigation.navigate(Routes.MainApp, params);
  };

  const goToLogin = (params?: any) => {
    navigation.navigate(Routes.Login, params);
  };
  const goToPersonalDetails = (params?: any) => {
    navigation.navigate(Routes.PersonalDetails, params);
  };

  const goToRestaurantDetails = (params?: any) => {
    navigation.navigate(Routes.RestaurantDetails, params);
  };

  const goToLocationSearch = (params?: any) => {
    navigation.navigate(Routes.LocationSearch, params);
  }

  const goToSearchProduct = (params?: any) => {
    navigation.navigate(Routes.SearchProduct, params);
  }

  const goToProfile = (params?: any) => {
    navigation.navigate(Routes.Profile, params);
  };

  const goToEditProfile = (params?: any) => {
    navigation.navigate(Routes.EditProfile, params);
  }

  const goToOrderDetails = (params?: any) => {
    navigation.navigate(Routes.OrderDetails, params);
  }

    const goToOrderTracking = (params?: any) => {
    navigation.navigate(Routes.OrderTracking, params);
  }

  const goToDetails = (id: string | number, params?: any) => {
    navigation.navigate(Routes.Dashboard, { id, ...params });
  };

  // Add more navigation functions as needed

  return {
    goToMainApp,
    goToLogin,
    goToPersonalDetails,
    goToRestaurantDetails,
    goToDetails,
    goToLocationSearch,
    goToSearchProduct,
    goToProfile,
    goToEditProfile,
    goToOrderDetails,
    goToOrderTracking
    // Add more here
  };
};