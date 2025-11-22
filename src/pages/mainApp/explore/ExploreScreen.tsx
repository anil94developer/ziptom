import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import MapView, { Marker, Callout, PROVIDER_GOOGLE, Region } from "react-native-maps";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import { fetchRestaurants, fetchNearByRestraurant, Restaurant } from "../../../redux/slices/restaurantSlice";
import { searchPlacesAutocomplete, getPlaceDetails, PlacePrediction, getAddressFromCoordinates } from "../../../utils/helper";
import { getCurrentLocation } from "../../../utils/permissionHelper";
import { useAppNavigation } from "../../../utils/functions";
import { useTheme } from "../../../theme/ThemeContext";
import Header from "../../../componets/header";

const { width, height } = Dimensions.get("window");

 
const ExploreScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { restaurants, nearByRestuarant, loading } = useSelector((state: any) => state.restaurant);
  const { colors } = useTheme();
  const { goToRestaurantDetails } = useAppNavigation();

  const [region, setRegion] = useState<Region>({
    latitude: 28.6139,
    longitude: 77.209,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [radius, setRadius] = useState(2000);
  const [allRestaurants, setAllRestaurants] = useState<Restaurant[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  const mapRef = useRef<MapView>(null);

  // Fetch all restaurants on mount
  useEffect(() => {
    const fetchData = async () => {
      await fetchCurrentLocationAndRestaurants();
    };
    fetchData();
  }, [dispatch]);

  // Fetch current location and nearby restaurants
  const fetchCurrentLocationAndRestaurants = async () => {
    const location = await getCurrentLocation() as { latitude: number; longitude: number } | null;
    if (location && 'latitude' in location && 'longitude' in location) {
      // Set current location for marker
      setCurrentLocation({
        latitude: location.latitude,
        longitude: location.longitude,
      });
      
      const newRegion: Region = {
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
      setRegion(newRegion);
      mapRef.current?.animateToRegion(newRegion, 1000);
      
      // Fetch restaurants with location parameters
      const result = await dispatch(fetchRestaurants({
        latitude: location.latitude,
        longitude: location.longitude,
        raduis: radius,
      }));
      if (fetchRestaurants.fulfilled.match(result)) {
        setAllRestaurants(result.payload?.data || []);
      }
    } else {
      // Fetch all restaurants without location if location is not available
      const result = await dispatch(fetchRestaurants());
      if (fetchRestaurants.fulfilled.match(result)) {
        setAllRestaurants(result.payload?.data || []);
      }
    }
  };

  // Debounced search for autocomplete
  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (searchQuery.length >= 2) {
        setSearchLoading(true);
        const results = await searchPlacesAutocomplete(searchQuery);
        setPredictions(results);
        setSearchLoading(false);
      } else {
        setPredictions([]);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [searchQuery]);

  // Handle location search selection
  const handleSelectLocation = async (prediction: PlacePrediction) => {
    setSearchLoading(true);
    const placeDetails = await getPlaceDetails(prediction.place_id);
    if (placeDetails) {
      const newRegion: Region = {
        latitude: placeDetails.geometry.location.lat,
        longitude: placeDetails.geometry.location.lng,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
      setRegion(newRegion);
      setSearchQuery(prediction.description);
      setPredictions([]);
      setShowSearchResults(false);
      mapRef.current?.animateToRegion(newRegion, 1000);
      
      // Fetch nearby restaurants for selected location
      // await dispatch(fetchNearByRestraurant({
      //   latitude: placeDetails.geometry.location.lat,
      //   longitude: placeDetails.geometry.location.lng,
      //   raduis: radius,
      // }));
    }
    setSearchLoading(false);
  };

  // Handle search submit - fetch nearby restaurants
  const handleSearchSubmit = async () => {
    if (searchQuery.length >= 2 && predictions.length > 0) {
      // If there are predictions, select the first one
      await handleSelectLocation(predictions[0]);
    } else {
      // If no predictions, use current map center
      // await dispatch(fetchNearByRestraurant({
      //   latitude: region.latitude,
      //   longitude: region.longitude,
      //   raduis: radius,
      // }));
    }
  };

  const goToRestaurant = (rest: Restaurant | any) => {
    const lat = rest.latitude || rest.lat;
    const lng = rest.longitude || rest.lng;
    
    if (lat && lng) {
      mapRef.current?.animateToRegion(
        {
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        1000
      );
    }
    setSelectedRestaurant(rest);
    setDialogVisible(true);
  };

  const centerOnUser = () => {
    fetchCurrentLocationAndRestaurants();
  };

  const handleViewDetails = (restaurant: Restaurant | any) => {
    setDialogVisible(false);
    const restaurantId = restaurant._id || (restaurant as any).id;
    goToRestaurantDetails({ restroDetails: { restaurant: { _id: restaurantId, id: restaurantId } } });
  };

  // Get restaurants to display (nearby or all)
  const restaurantsToDisplay = nearByRestuarant.length > 0 ? nearByRestuarant : allRestaurants;

  return (
    <View style={styles.container}>
      {/* <Header
        title="Explore Restaurants"
        onBack={() => {}}
        onAdd={() => {}}
      /> */}
      
      {/* Map */}
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        region={region}
        onRegionChangeComplete={(reg) => setRegion(reg)}
      >
        {/* Current Location Marker */}
        {currentLocation && (
          <Marker
            coordinate={currentLocation}
            title="Your Location"
            description="Current location"
          >
            <View style={styles.currentLocationMarker}>
              <View style={styles.currentLocationIconContainer}>
                <MaterialIcons name="my-location" size={20} color="#fff" />
              </View>
              <View style={styles.currentLocationPulse} />
            </View>
          </Marker>
        )}

        {/* Restaurant Markers */}
        {restaurantsToDisplay.map((rest: Restaurant | any) => {
          const lat = rest.latitude || rest.lat;
          const lng = rest.longitude || rest.lng;
          const restId = rest._id || (rest as any).id;
          const imageUrl = rest.images?.[0]?.url || rest.image || 'https://via.placeholder.com/150';
          
          if (!lat || !lng) return null;
          
          return (
            <Marker
              key={restId}
              coordinate={{ latitude: lat, longitude: lng }}
              onPress={() => goToRestaurant(rest)}
            >
              <View style={styles.customMarker}>
                <View style={styles.markerIconContainer}>
                  <MaterialIcons name="restaurant" size={24} color="#fff" />
                </View>
                <View style={styles.markerLabelContainer}>
                  <Text style={styles.markerLabel} numberOfLines={1}>
                    {rest.name}
                  </Text>
                </View>
              </View>
              <Callout
                tooltip
                onPress={() => goToRestaurant(rest)}
              >
                <View style={styles.calloutBox}>
                  <Image source={{ uri: imageUrl }} style={styles.calloutImage} />
                  <View style={{ padding: 6 }}>
                    <Text style={styles.calloutTitle}>{rest.name}</Text>
                    {/* <Text style={styles.calloutRating}>⭐ {rest?.rating?.average || rest.rating || 0}</Text> */}
                    <Text style={styles.calloutLink}>Tap to view</Text>
                  </View>
                </View>
              </Callout>
            </Marker>
          );
        })}
      </MapView>

      {/* Search Bar with Autocomplete */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <MaterialIcons name="search" size={22} color="#666" />
          <TextInput
            placeholder="Search area, street name..."
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              setShowSearchResults(text.length >= 2);
            }}
            placeholderTextColor="#888"
          />
          {searchLoading && <ActivityIndicator size="small" color="#f44336" style={{ marginRight: 8 }} />}
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => {
              setSearchQuery("");
              setPredictions([]);
              setShowSearchResults(false);
            }}>
              <MaterialIcons name="close" size={20} color="#888" />
            </TouchableOpacity>
          )}
          <TouchableOpacity 
            style={styles.searchButton}
            onPress={handleSearchSubmit}
          >
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>

        {/* Autocomplete Results */}
        {showSearchResults && searchQuery.length >= 2 && predictions.length > 0 && (
          <View style={styles.predictionsContainer}>
            <FlatList
              data={predictions}
              keyExtractor={(item) => item.place_id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.predictionItem}
                  onPress={() => handleSelectLocation(item)}
                >
                  <MaterialIcons name="location-on" size={20} color="#f44336" />
                  <View style={{ flex: 1, marginLeft: 8 }}>
                    <Text style={styles.predictionMainText}>
                      {item.structured_formatting.main_text}
                    </Text>
                    <Text style={styles.predictionSecondaryText} numberOfLines={1}>
                      {item.structured_formatting.secondary_text}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
              keyboardShouldPersistTaps="handled"
              nestedScrollEnabled
            />
          </View>
        )}
      </View>

      {/* GPS Button */}
      <TouchableOpacity style={styles.gpsButton} onPress={centerOnUser}>
        <MaterialIcons name="my-location" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Bottom List */}
      <View style={styles.bottomList}>
        <FlatList
          data={restaurantsToDisplay}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item: Restaurant | any) => (item._id || (item as any).id || Math.random()).toString()}
          renderItem={({ item }: { item: Restaurant | any }) => {
            const imageUrl = item.images?.[0]?.url || item.image || 'https://via.placeholder.com/150';
            return (
              <TouchableOpacity
                style={styles.card}
                onPress={() => goToRestaurant(item)}
              >
                <Image source={{ uri: imageUrl }} style={styles.cardImage} />
                <Text style={styles.cardTitle} numberOfLines={1}>{item.name}</Text>
                {/* <Text style={styles.cardRating}>⭐ {item?.rating?.average || item.rating || 0}</Text> */}
                {item.cuisineType && (
                  <Text style={styles.cardCuisine} numberOfLines={1}>
                    {item.cuisineType.join(', ')}
                  </Text>
                )}
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Restaurant Details Dialog */}
      <Modal
        visible={dialogVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setDialogVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Restaurant Details</Text>
              <TouchableOpacity onPress={() => setDialogVisible(false)}>
                <MaterialIcons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            {selectedRestaurant && (
              <ScrollView showsVerticalScrollIndicator={false}>
                {selectedRestaurant.images?.[0]?.url && (
                  <Image 
                    source={{ uri: selectedRestaurant.images[0].url }} 
                    style={styles.modalImage} 
                  />
                )}
                
                <Text style={[styles.modalRestaurantName, { color: colors.text }]}>
                  {selectedRestaurant.name}
                </Text>
                
                {selectedRestaurant.description && (
                  <Text style={[styles.modalDescription, { color: colors.textSecondary }]}>
                    {selectedRestaurant.description}
                  </Text>
                )}

                <View style={styles.modalInfoRow}>
                  <MaterialIcons name="star" size={20} color="#FFD700" />
                  <Text style={[styles.modalInfoText, { color: colors.text }]}>
                    {/* {selectedRestaurant?.rating?.average || 0} ({selectedRestaurant.rating?.count || 0} reviews) */}
                  </Text>
                </View>

                {selectedRestaurant.address?.fullAddress && (
                  <View style={styles.modalInfoRow}>
                    <MaterialIcons name="location-on" size={20} color="#f44336" />
                    <Text style={[styles.modalInfoText, { color: colors.text }]} numberOfLines={2}>
                      {selectedRestaurant.address.fullAddress}
                    </Text>
                  </View>
                )}

                {selectedRestaurant.cuisineType && selectedRestaurant.cuisineType.length > 0 && (
                  <View style={styles.modalInfoRow}>
                    <MaterialIcons name="restaurant-menu" size={20} color="#4CAF50" />
                    <Text style={[styles.modalInfoText, { color: colors.text }]}>
                      {selectedRestaurant.cuisineType.join(', ')}
                    </Text>
                  </View>
                )}

                {selectedRestaurant.features && selectedRestaurant.features.length > 0 && (
                  <View style={styles.modalInfoRow}>
                    <MaterialIcons name="check-circle" size={20} color="#2196F3" />
                    <Text style={[styles.modalInfoText, { color: colors.text }]}>
                      {selectedRestaurant.features.join(', ')}
                    </Text>
                  </View>
                )}

                {selectedRestaurant.priceRange && (
                  <View style={styles.modalInfoRow}>
                    <MaterialIcons name="attach-money" size={20} color="#FF9800" />
                    <Text style={[styles.modalInfoText, { color: colors.text }]}>
                      {selectedRestaurant.priceRange}
                    </Text>
                  </View>
                )}

                {selectedRestaurant.contactPhone && (
                  <View style={styles.modalInfoRow}>
                    <MaterialIcons name="phone" size={20} color="#9C27B0" />
                    <Text style={[styles.modalInfoText, { color: colors.text }]}>
                      {selectedRestaurant.contactPhone}
                    </Text>
                  </View>
                )}

                <TouchableOpacity
                  style={[styles.viewDetailsButton, { backgroundColor: colors.primary }]}
                  onPress={() => handleViewDetails(selectedRestaurant)}
                >
                  <Text style={styles.viewDetailsButtonText}>View Full Details</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { 
    width, 
    height: height - 100,
  },
  searchContainer: {
    position: "absolute",
    top: 60,
    left: 10,
    right: 10,
    zIndex: 1000,
  },
  searchBox: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  searchInput: { 
    flex: 1, 
    marginLeft: 8, 
    fontSize: 14, 
    color: "#333" 
  },
  searchButton: {
    backgroundColor: "#f44336",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  searchButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  predictionsContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    maxHeight: 200,
    marginTop: 8,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  predictionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  predictionMainText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#222",
  },
  predictionSecondaryText: {
    fontSize: 12,
    color: "#777",
    marginTop: 2,
  },
  gpsButton: {
    position: "absolute",
    right: 20,
    bottom: 150,
    backgroundColor: "tomato",
    padding: 12,
    borderRadius: 30,
    elevation: 5,
    zIndex: 1000,
  },
  bottomList: { 
    position: "absolute", 
    bottom: 20,
    left: 0,
    right: 0,
  },
  card: {
    backgroundColor: "#fff",
    width: 150,
    marginHorizontal: 10,
    borderRadius: 10,
    elevation: 4,
    padding: 10,
    alignItems: "center",
  },
  cardImage: { 
    width: "100%", 
    height: 80, 
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
  cardTitle: {
    fontWeight: "bold",
    marginTop: 6,
    fontSize: 14,
    color: "#333",
    textAlign: "center",
  },
  cardRating: { 
    fontSize: 12, 
    color: "#777",
    marginTop: 2,
  },
  cardCuisine: {
    fontSize: 10,
    color: "#999",
    marginTop: 2,
    textAlign: "center",
  },
  calloutBox: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
    elevation: 5,
    width: 200,
  },
  calloutImage: { 
    width: 70, 
    height: 70,
    backgroundColor: "#f0f0f0",
  },
  calloutTitle: { 
    fontWeight: "bold", 
    fontSize: 14, 
    color: "#222" 
  },
  calloutRating: { 
    fontSize: 12, 
    color: "#777" 
  },
  calloutLink: { 
    fontSize: 12, 
    color: "tomato", 
    marginTop: 4 
  },
  currentLocationMarker: {
    alignItems: "center",
    justifyContent: "center",
  },
  currentLocationIconContainer: {
    backgroundColor: "#2196F3",
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#fff",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 1,
  },
  currentLocationPulse: {
    position: "absolute",
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#2196F3",
    opacity: 0.3,
    zIndex: 0,
  },
  customMarker: {
    alignItems: "center",
    justifyContent: "center",
  },
  markerIconContainer: {
    backgroundColor: "#f44336",
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#fff",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  markerLabelContainer: {
    backgroundColor: "#fff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 4,
    maxWidth: 120,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  markerLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#222",
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    maxHeight: "80%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  modalImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: "#f0f0f0",
  },
  modalRestaurantName: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
  },
  modalDescription: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  modalInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  modalInfoText: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  viewDetailsButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  viewDetailsButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ExploreScreen;
