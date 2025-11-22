import React, { useState, useEffect, useRef } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    Modal,
    ActivityIndicator,
    Dimensions,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Header from "../../../componets/header";
import { searchPlacesAutocomplete, getPlaceDetails, PlacePrediction, PlaceDetails, getAddressFromCoordinates } from "../../../utils/helper";
import { getCurrentLocation } from "../../../utils/permissionHelper";

const { width, height } = Dimensions.get('window');

interface LocationSearchProps {
    visible: boolean;
    onClose: () => void;
    onSelectLocation?: (location: { address: string; latitude: number; longitude: number; placeId?: string }) => void;
}

const LocationSearch = ({ visible, onClose, onSelectLocation }: LocationSearchProps) => {
    const [query, setQuery] = useState("");
    const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentLocationAddress, setCurrentLocationAddress] = useState<string>("");
    const [currentLocationCoords, setCurrentLocationCoords] = useState<{ lat: number; lng: number } | null>(null);
    const [selectedLocation, setSelectedLocation] = useState<{ latitude: number; longitude: number; address: string } | null>(null);
    const [mapRegion, setMapRegion] = useState<Region>({
        latitude: 28.6139,
        longitude: 77.209,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });
    const mapRef = useRef<MapView>(null);

    // Debounced search function
    useEffect(() => {
        const searchTimeout = setTimeout(async () => {
            if (query.length >= 2) {
                setLoading(true);
                const results = await searchPlacesAutocomplete(query, currentLocationCoords || undefined);
                setPredictions(results);
                setLoading(false);
            } else {
                setPredictions([]);
            }
        }, 300);

        return () => clearTimeout(searchTimeout);
    }, [query, currentLocationCoords]);

    // Get current location on mount
    useEffect(() => {
        if (visible) {
            const fetchCurrentLocation = async () => {
                const location = await getCurrentLocation() as { latitude: number; longitude: number } | null;
                if (location && 'latitude' in location && 'longitude' in location) {
                    setCurrentLocationCoords({ lat: location.latitude, lng: location.longitude });
                    const address = await getAddressFromCoordinates(location.latitude, location.longitude);
                    if (address) {
                        setCurrentLocationAddress(address);
                    }
                    // Set map region to current location
                    const newRegion: Region = {
                        latitude: location.latitude,
                        longitude: location.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    };
                    setMapRegion(newRegion);
                    setSelectedLocation({
                        latitude: location.latitude,
                        longitude: location.longitude,
                        address: address || '',
                    });
                    mapRef.current?.animateToRegion(newRegion, 1000);
                }
            };
            fetchCurrentLocation();
        }
    }, [visible]);

    const handleSelectPrediction = async (prediction: PlacePrediction) => {
        setLoading(true);
        const placeDetails = await getPlaceDetails(prediction.place_id);
        if (placeDetails) {
            const newRegion: Region = {
                latitude: placeDetails.geometry.location.lat,
                longitude: placeDetails.geometry.location.lng,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            };
            setMapRegion(newRegion);
            setSelectedLocation({
                latitude: placeDetails.geometry.location.lat,
                longitude: placeDetails.geometry.location.lng,
                address: placeDetails.formatted_address,
            });
            mapRef.current?.animateToRegion(newRegion, 1000);
            setQuery(prediction.description);
            setPredictions([]);
        }
        setLoading(false);
    };

    const handleMapPress = async (event: any) => {
        const { latitude, longitude } = event.nativeEvent.coordinate;
        setLoading(true);
        const address = await getAddressFromCoordinates(latitude, longitude);
        if (address) {
            setSelectedLocation({
                latitude,
                longitude,
                address,
            });
        }
        setLoading(false);
    };

    const handleConfirmLocation = () => {
        if (selectedLocation && onSelectLocation) {
            onSelectLocation({
                address: selectedLocation.address,
                latitude: selectedLocation.latitude,
                longitude: selectedLocation.longitude,
            });
            onClose();
        }
    };

    const handleUseCurrentLocation = async () => {
        if (currentLocationCoords && currentLocationAddress && onSelectLocation) {
            onSelectLocation({
                address: currentLocationAddress,
                latitude: currentLocationCoords.lat,
                longitude: currentLocationCoords.lng,
            });
            onClose();
        } else {
            setLoading(true);
            const location = await getCurrentLocation() as { latitude: number; longitude: number } | null;
            if (location && 'latitude' in location && 'longitude' in location) {
                const address = await getAddressFromCoordinates(location.latitude, location.longitude);
                if (address && onSelectLocation) {
                    onSelectLocation({
                        address: address,
                        latitude: location.latitude,
                        longitude: location.longitude,
                    });
                    onClose();
                }
            }
            setLoading(false);
        }
    };

    return (
        <Modal
            animationType="slide"
            visible={visible}
            onRequestClose={onClose}
            transparent={false}
        >
            <View style={styles.container}>
                <Header
                    title="Select a location"
                    onBack={onClose}
                    onAdd={() => {}}
                />
                
                {/* Map View */}
                <View style={styles.mapContainer}>
                    <MapView
                        ref={mapRef}
                        provider={PROVIDER_GOOGLE}
                        style={styles.map}
                        region={mapRegion}
                        onRegionChangeComplete={setMapRegion}
                        onPress={handleMapPress}
                        showsUserLocation={true}
                        showsMyLocationButton={false}
                    >
                        {selectedLocation && (
                            <Marker
                                coordinate={{
                                    latitude: selectedLocation.latitude,
                                    longitude: selectedLocation.longitude,
                                }}
                                draggable
                                onDragEnd={(e) => {
                                    const { latitude, longitude } = e.nativeEvent.coordinate;
                                    handleMapPress({ nativeEvent: { coordinate: { latitude, longitude } } });
                                }}
                            >
                                <View style={styles.markerContainer}>
                                    <MaterialIcons name="place" size={40} color="#f44336" />
                                </View>
                            </Marker>
                        )}
                    </MapView>

                    {/* Search Box Overlay */}
                    <View style={styles.searchOverlay}>
                        <View style={styles.searchBox}>
                            <MaterialIcons name="search" size={20} color="#888" />
                            <TextInput
                                style={styles.input}
                                placeholder="Search for area, street name..."
                                value={query}
                                onChangeText={setQuery}
                                placeholderTextColor="#888"
                            />
                            {loading && <ActivityIndicator size="small" color="#f44336" style={{ marginLeft: 8 }} />}
                            {query.length > 0 && (
                                <TouchableOpacity onPress={() => setQuery("")}>
                                    <MaterialIcons name="close" size={20} color="#888" />
                                </TouchableOpacity>
                            )}
                        </View>

                        {/* Autocomplete Results */}
                        {query.length >= 2 && predictions.length > 0 && (
                            <View style={styles.predictionsContainer}>
                                <FlatList
                                    data={predictions}
                                    keyExtractor={(item) => item.place_id}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                            style={styles.predictionItem}
                                            onPress={() => handleSelectPrediction(item)}
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

                    {/* Current Location Button */}
                    <TouchableOpacity style={styles.currentLocationButton} onPress={handleUseCurrentLocation}>
                        <MaterialIcons name="my-location" size={24} color="#fff" />
                    </TouchableOpacity>

                    {/* Selected Location Info */}
                    {selectedLocation && (
                        <View style={styles.selectedLocationInfo}>
                            <View style={styles.locationInfoContent}>
                                <MaterialIcons name="place" size={20} color="#f44336" />
                                <View style={{ flex: 1, marginLeft: 8 }}>
                                    <Text style={styles.locationInfoTitle} numberOfLines={1}>
                                        {selectedLocation.address || "Selected Location"}
                                    </Text>
                                    <Text style={styles.locationInfoSubtitle}>
                                        {selectedLocation.latitude.toFixed(6)}, {selectedLocation.longitude.toFixed(6)}
                                    </Text>
                                </View>
                            </View>
                            <TouchableOpacity
                                style={styles.confirmButton}
                                onPress={handleConfirmLocation}
                            >
                                <Text style={styles.confirmButtonText}>Confirm</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    mapContainer: {
        flex: 1,
        position: "relative",
    },
    map: {
        width: "100%",
        height: "100%",
    },
    markerContainer: {
        alignItems: "center",
        justifyContent: "center",
    },
    searchOverlay: {
        position: "absolute",
        top: 10,
        left: 10,
        right: 10,
        zIndex: 1000,
    },
    searchBox: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    input: {
        flex: 1,
        marginLeft: 8,
        fontSize: 14,
        color: "#333",
    },
    predictionsContainer: {
        backgroundColor: "#fff",
        borderRadius: 8,
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
    currentLocationButton: {
        position: "absolute",
        bottom: 100,
        right: 15,
        backgroundColor: "#f44336",
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: "center",
        justifyContent: "center",
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        zIndex: 1000,
    },
    selectedLocationInfo: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#fff",
        padding: 16,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        elevation: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    locationInfoContent: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    locationInfoTitle: {
        fontSize: 14,
        fontWeight: "600",
        color: "#222",
    },
    locationInfoSubtitle: {
        fontSize: 12,
        color: "#777",
        marginTop: 2,
    },
    confirmButton: {
        backgroundColor: "#f44336",
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
    },
    confirmButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    option: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 12,
        marginBottom: 10,
        elevation: 1,
    },
    optionTitle: { fontSize: 14, fontWeight: "bold", color: "#333" },
    optionSubtitle: { fontSize: 12, color: "#777", marginTop: 2 },
});

export default LocationSearch;
