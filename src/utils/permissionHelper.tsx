import { PermissionsAndroid, Platform, Alert, Linking } from "react-native";
import { request, PERMISSIONS, RESULTS } from "react-native-permissions";
import type { Permission } from "react-native-permissions";
import Geolocation from "react-native-geolocation-service";
type PermissionType = "location" | "camera" | "gallery";

export const requestAppPermission = async (type: PermissionType) => {
  let permission: Permission | null = null;

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
    // case "storage":
    //   permission =
    //     Platform.OS === "android"
    //       ? PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE
    //       : PERMISSIONS.IOS.MEDIA_LIBRARY;
    //   break;
    default:
      return false;
  }

  try {
    const result = await request(permission);
    if (result === RESULTS.GRANTED) return true;

    if (result === RESULTS.BLOCKED) {
      Alert.alert(
  "Permission Blocked",
  `Please enable ${type} permission from app settings.`,
  [
    { text: "Cancel", style: "cancel" },
    {
      text: "Open Settings",
      onPress: () => Linking.openSettings(),
    },
  ]
);

    }
    return false;
  } catch (error) {
    console.log(`Permission error (${type}):`, error);
    return false;
  }
};

export const requestAllPermissions = async () => {
  const permissions: PermissionType[] = ["location", "camera", "gallery"];
  const results: Partial<Record<PermissionType, boolean>> = {};
  for (const type of permissions) {
    results[type] = await requestAppPermission(type);
  }
  console.log("Permission results:", results);
  return results;
};


export const getCurrentLocation1 = async () => {
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

    return new Promise((resolve) => {
      Geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log("📍 Current Location:", latitude, longitude);
          resolve({ latitude, longitude });
        },
        (error) => {
          console.log("❌ Geolocation error:", error);
          resolve(null);
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
export async function getCurrentLocation() {
  try {
    // 1️⃣ Request permission safely
    let granted = false;

    if (Platform.OS === 'ios') {
      const auth = await Geolocation.requestAuthorization('whenInUse');
      granted = auth === 'granted';
    } else {
      const permission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Access Required',
          message: 'We need to access your location to provide services.',
          buttonPositive: 'OK',
        },
      );
      granted = permission === PermissionsAndroid.RESULTS.GRANTED;
    }

    if (!granted) {
      Alert.alert('Permission Denied', 'Location permission is required.');
      return null;
    }

    // 2️⃣ Wrap native call in try/catch
    return await new Promise((resolve) => {
      let resolved = false;
      const done = (val) => {
        if (!resolved) {
          resolved = true;
          clearTimeout(timer);
          resolve(val);
        }
      };

      const timer = setTimeout(() => {
        console.log('⏳ Location request timeout');
        done(null);
      }, 20000);

      try {
        Geolocation.getCurrentPosition(
          (pos) => {
            const { latitude, longitude } = pos.coords;
            console.log('📍 Location:', latitude, longitude);
            done({ latitude, longitude });
          },
          (error) => {
            console.log('❌ Location error:', error);
            Alert.alert('Error getting location', error.message);
            done(null);
          },
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 10000,
            // 🚫 DO NOT include these in RN 0.81+
            // showLocationDialog: true,
            // forceRequestLocation: true,
          },
        );
      } catch (err) {
        console.log('🔥 Native crash prevented:', err);
        done(null);
      }
    });
  } catch (err) {
    console.log('🔥 getCurrentLocation failed:', err);
    return null;
  }
}