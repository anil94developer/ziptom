import React, { useState, useEffect } from "react";
import { View, StyleSheet, Dimensions, Text } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import polyline from "@mapbox/polyline";
import Header from "../../../componets/header";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

const GOOGLE_API_KEY = "AIzaSyCJEGqn0OfqHe1OAhMp35nhlc8cRGPtkKw"; // 🔑 put your API key here

const OrderTrackingScreen = () => {
  const navigation = useNavigation();
  const [userLocation] = useState({
    latitude: 28.6139,
    longitude: 77.209,
  });
  const [riderLocation] = useState({
    latitude: 28.6205,
    longitude: 77.215,
  });
  const [routeCoords, setRouteCoords] = useState<any[]>([]);

  // Fetch route from Google Directions API
  const fetchRoute = async () => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${riderLocation.latitude},${riderLocation.longitude}&destination=${userLocation.latitude},${userLocation.longitude}&key=${GOOGLE_API_KEY}`
      );
      const data = await response.json();

      if (data.routes.length) {
        const points = polyline.decode(data.routes[0].overview_polyline.points);
        const coords = points.map((point) => ({
          latitude: point[0],
          longitude: point[1],
        }));
        setRouteCoords(coords);
      }
    } catch (error) {
      console.log("Route error: ", error);
    }
  };

  useEffect(() => {
    fetchRoute();
  }, []);

  return (
    <View style={styles.container}>
     <Header
                title="Order Tracking"
                onBack={() => navigation.goBack()}
            />
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
      >
        {/* User Pin */}
        <Marker coordinate={userLocation} title="Your Location">
          <MaterialIcons name="home" size={36} color="#f44336" />
        </Marker>

        {/* Rider Pin */}
        <Marker coordinate={riderLocation} title="Delivery Boy">
          <MaterialIcons name="delivery-dining" size={40} color="#4caf50" />
        </Marker>

        {/* Polyline Road Route */}
        {routeCoords.length > 0 && (
          <Polyline
            coordinates={routeCoords}
            strokeColor="#f44336"
            strokeWidth={5}
          />
        )}
      </MapView>

      {/* Bottom Status Card */}
      <View style={styles.bottomCard}>
        <Text style={styles.statusText}>🚴 Rider is on the way</Text>
        <Text style={styles.etaText}>Estimated Delivery: 15 mins</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: width, height: height },
  bottomCard: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    elevation: 4,
    alignItems: "center",
  },
  statusText: { fontSize: 16, fontWeight: "bold", color: "#333" },
  etaText: { fontSize: 14, color: "#777", marginTop: 4 },
});

export default OrderTrackingScreen;
