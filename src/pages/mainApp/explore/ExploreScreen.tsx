import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from "react-native-maps";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const { width, height } = Dimensions.get("window");

const restaurants = [
  {
    id: 1,
    name: "Biryani House",
    lat: 28.6139,
    lng: 77.209,
    rating: 4.2,
    image: "https://img.freepik.com/free-photo/chicken-biryani.jpg",
  },
  {
    id: 2,
    name: "Pizza Hub",
    lat: 28.6145,
    lng: 77.207,
    rating: 4.5,
    image: "https://img.freepik.com/free-photo/delicious-pizza.jpg",
  },
  {
    id: 3,
    name: "Burger Corner",
    lat: 28.615,
    lng: 77.212,
    rating: 3.9,
    image: "https://img.freepik.com/free-photo/tasty-burger.jpg",
  },
];

const ExploreScreen = () => {
  const [region, setRegion] = useState({
    latitude: 28.6139,
    longitude: 77.209,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const mapRef = useRef<MapView>(null);

  const goToRestaurant = (rest: any) => {
    mapRef.current?.animateToRegion(
      {
        latitude: rest.lat,
        longitude: rest.lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      1000
    );
  };

  const centerOnUser = () => {
    // Fake user location (replace with expo-location or RN Geolocation API)
    const userLocation = { latitude: 28.6129, longitude: 77.210 };
    mapRef.current?.animateToRegion(
      {
        ...userLocation,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      1000
    );
  };

  return (
    <View style={styles.container}>
      {/* Map */}
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        region={region}
        onRegionChangeComplete={(reg) => setRegion(reg)}
      >
        {restaurants.map((rest) => (
          <Marker
            key={rest.id}
            coordinate={{ latitude: rest.lat, longitude: rest.lng }}
          >
            <MaterialIcons name="restaurant" size={32} color="tomato" />
            <Callout
              tooltip
              onPress={() => goToRestaurant(rest)} // Center map when callout pressed
            >
              <View style={styles.calloutBox}>
                <Image source={{ uri: rest.image }} style={styles.calloutImage} />
                <View style={{ padding: 6 }}>
                  <Text style={styles.calloutTitle}>{rest.name}</Text>
                  <Text style={styles.calloutRating}>⭐ {rest.rating}</Text>
                  <Text style={styles.calloutLink}>Tap to view</Text>
                </View>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      {/* Search Bar */}
      <View style={styles.searchBox}>
        <MaterialIcons name="search" size={22} color="#666" />
        <TextInput
          placeholder="Search restaurants"
          style={styles.searchInput}
        />
      </View>

      {/* GPS Button */}
      <TouchableOpacity style={styles.gpsButton} onPress={centerOnUser}>
        <MaterialIcons name="my-location" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Bottom List */}
      <View style={styles.bottomList}>
        <FlatList
          data={restaurants}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => goToRestaurant(item)}
            >
              <Image source={{ uri: item.image }} style={styles.cardImage} />
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardRating}>⭐ {item.rating}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width, height },

  searchBox: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    elevation: 5,
  },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 14, color: "#333" },

  gpsButton: {
    position: "absolute",
    right: 20,
    bottom: 150,
    backgroundColor: "tomato",
    padding: 12,
    borderRadius: 30,
    elevation: 5,
  },

  bottomList: { position: "absolute", bottom: 20 },
  card: {
    backgroundColor: "#fff",
    width: 150,
    marginHorizontal: 10,
    borderRadius: 10,
    elevation: 4,
    padding: 10,
    alignItems: "center",
  },
  cardImage: { width: "100%", height: 80, borderRadius: 8 },
  cardTitle: {
    fontWeight: "bold",
    marginTop: 6,
    fontSize: 14,
    color: "#333",
  },
  cardRating: { fontSize: 12, color: "#777" },

  calloutBox: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
    elevation: 5,
    width: 200,
  },
  calloutImage: { width: 70, height: 70 },
  calloutTitle: { fontWeight: "bold", fontSize: 14, color: "#222" },
  calloutRating: { fontSize: 12, color: "#777" },
  calloutLink: { fontSize: 12, color: "tomato", marginTop: 4 },
});

export default ExploreScreen;
