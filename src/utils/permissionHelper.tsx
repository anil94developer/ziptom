import { PermissionsAndroid, Platform, Alert } from "react-native";
import { check, request, PERMISSIONS, RESULTS } from "react-native-permissions";
import Geolocation from "react-native-geolocation-service";
export const requestAppPermission = async (type) => {
  let permission;

  switch (type) {
    case "location":
      permission =
        Platform.OS === "android"
          ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
          : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;
      break;
    case "camera":
      permission =
        Platform.OS === "android"
          ? PERMISSIONS.ANDROID.CAMERA
          : PERMISSIONS.IOS.CAMERA;
      break;
    case "gallery":
      permission =
        Platform.OS === "android"
          ? (Platform.Version >= 33
              ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
              : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE)
          : PERMISSIONS.IOS.PHOTO_LIBRARY;
      break;
    case "storage":
      permission =
        Platform.OS === "android"
          ? PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE
          : PERMISSIONS.IOS.MEDIA_LIBRARY;
      break;
    case "notification":
      permission =
        Platform.OS === "android"
          ? PERMISSIONS.ANDROID.POST_NOTIFICATIONS
          : PERMISSIONS.IOS.NOTIFICATIONS;
      break;
    default:
      return false;
  }

  try {
    const result = await request(permission);
    if (result === RESULTS.GRANTED) return true;

    if (result === RESULTS.BLOCKED) {
      Alert.alert(
        "Permission Blocked",
        `Please enable ${type} permission from app settings.`
      );
    }
    return false;
  } catch (error) {
    console.log(`Permission error (${type}):`, error);
    return false;
  }
};

export const requestAllPermissions = async () => {
  const permissions = ["location", "camera", "gallery", "storage"];
  const results = {};
  for (const type of permissions) {
    results[type] = await requestAppPermission(type);
  }
  console.log("Permission results:", results);
  return results;
};


export const getCurrentLocation = async () => {
  try {
    let hasPermission = false;

    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      hasPermission = granted === PermissionsAndroid.RESULTS.GRANTED;
    } else {
      const result = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      hasPermission = result === RESULTS.GRANTED;
    }

    if (!hasPermission) {
      Alert.alert("Permission denied", "Enable location permission in settings.");
      return null;
    }

    console.log("📡 Getting current position...");

    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log("📍 Current Location:", latitude, longitude);
          resolve({ latitude, longitude });
        },
        (error) => {
          console.log("❌ Geolocation error:", error);
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
        }
      );
    });
  } catch (error) {
    console.log("⚠️ Unexpected error:", error);
    return null;
  }
};
