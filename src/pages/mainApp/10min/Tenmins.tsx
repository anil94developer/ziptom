import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { ImageAssets } from "../../../assets/images";
import FoodCard from "../home/FoodCard";
import { useTheme } from "../../../theme/ThemeContext";
import FilterModal from "../home/FilterModal";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import { fetchDeliveryTimeCategories, Category } from "../../../redux/slices/homeSlice";
import { fetchRestaurants } from "../../../redux/slices/restaurantSlice";
import { getCurrentLocation } from "../../../utils/permissionHelper";
 
const Tenmins = () => {
  const { colors } = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const { deliveryTimeCategories } = useSelector((state: any) => state.home);
  const { restaurants = [], loading = false } = useSelector((state: any) => state.restaurant || {});
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const hasInitializedCategory = useRef(false);

  // Fetch categories and location only once on mount
  useEffect(() => {
    dispatch(fetchDeliveryTimeCategories());
    // Get current location
    const getLocation = async () => {
      const location = await getCurrentLocation() as { latitude: number; longitude: number } | null;
      if (location && 'latitude' in location && 'longitude' in location) {
        setCurrentLocation({ latitude: location.latitude, longitude: location.longitude });
      }
    };
    getLocation();
  }, [dispatch]);

  // Select first category by default only once when categories are first loaded
  useEffect(() => {
    if (deliveryTimeCategories && deliveryTimeCategories.length > 0 && !hasInitializedCategory.current) {
      const firstCategory = deliveryTimeCategories[0];
      const categoryId = firstCategory.id || firstCategory._id;
      if (categoryId) {
        hasInitializedCategory.current = true;
        setSelectedCategoryId(categoryId);
      }
    }
  }, [deliveryTimeCategories]);

  // Fetch restaurants whenever currentLocation changes (not based on category)
  useEffect(() => {
    if (currentLocation) {
      dispatch(fetchRestaurants({
        page: 1,
        limit: 50,
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        raduis: 10, // 10 km radius
      }));
    } else {
      // Fetch without location if location is not available
      dispatch(fetchRestaurants({
        page: 1,
        limit: 50,
      }));
    }
  }, [currentLocation, dispatch]);

  // Handle category selection
  const handleCategoryPress = (category: Category) => {
    const categoryId = category.id || category._id;
    if (categoryId && categoryId !== selectedCategoryId) {
      setSelectedCategoryId(categoryId);
    }
  };

  return (
    <View style={styles.container}>
      {/* Sticky Header - Category Section */}
      <View style={styles.stickyHeader}>
        <Text style={styles.sectionTitle}>🔥 10 Mins Delivery</Text>
        {deliveryTimeCategories && deliveryTimeCategories.length > 0 ? (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.categoryScrollView}
          >
            {deliveryTimeCategories.map((category: Category) => {
              const categoryId = category.id || category._id;
              const isSelected = selectedCategoryId === categoryId;
              return (
                <TouchableOpacity 
                  key={categoryId} 
                  style={[
                    styles.proteinBox,
                    isSelected && styles.selectedProteinBox
                  ]}
                  onPress={() => handleCategoryPress(category)}
                >
                  <Image 
                    source={category.image ? { uri: category.image } : ImageAssets.Logo} 
                    style={[
                      styles.proteinImage,
                      isSelected && styles.selectedProteinImage
                    ]}
                  />
                  <Text style={[
                    styles.proteinText,
                    isSelected && styles.selectedProteinText
                  ]}>{category.name}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No categories available</Text>
          </View>
        )}
      </View>

      {/* Scrollable Content */}
      <ScrollView 
        style={styles.scrollContent}
        contentContainerStyle={styles.scrollContentContainer}
      >
        {/* Filter / Sort */}
        <View style={styles.filterRow}>
          <TouchableOpacity style={styles.filterBtn} onPress={() => setFilterVisible(true)}>
            <MaterialIcons name="tune" size={18} color="#000" />
            <Text style={styles.filterText}>Filter</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterBtn}>
            <Text style={styles.filterText}>Sort by</Text>
            <MaterialIcons name="arrow-drop-down" size={18} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.boltBtn}>
            <MaterialIcons name="bolt" size={16} color="orange" />
            <Text style={styles.boltText}>Food in 10 mins</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>
          {restaurants && restaurants.length > 0 ? `${restaurants.length} Restaurants to explore` : "Restaurants to explore"}
        </Text>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={styles.loadingText}>Loading restaurants...</Text>
          </View>
        ) : restaurants && restaurants.length > 0 ? (
          <View>
            {restaurants.map((restaurant: any) => {
              const primaryImage = restaurant.images?.find((img: any) => img.isPrimary) || restaurant.images?.[0];
              const imageUrl = primaryImage?.url || ImageAssets.Logo;
              // Safely extract rating - handle both object {average, count} and number formats
              const rating = typeof restaurant.rating === 'object' && restaurant.rating !== null
                ? (restaurant.rating.average ?? 0)
                : (typeof restaurant.rating === 'number' ? restaurant.rating : 0);
              // Safely extract reviews count
              const reviews = typeof restaurant.rating === 'object' && restaurant.rating !== null
                ? (restaurant.rating.count ?? restaurant.ratingCount ?? 0)
                : (restaurant.ratingCount ?? 0);
              const location = restaurant.address?.city || "";
              const distance = ""; // Distance calculation can be added if needed
              const cuisines = restaurant.cuisineType?.join(", ") || "";
              const features = restaurant.features?.join(", ") || "";
              
              return (
                <FoodCard
                  key={restaurant._id || restaurant.id || Math.random().toString()}
                  image={imageUrl}
                  discount=""
                  time="10-15 MINS"
                  name={restaurant.name || ""}
                  rating={rating}
                  reviews={reviews}
                  location={location}
                  distance={distance}
                  cuisines={cuisines}
                  features={features}
                  item={restaurant}
                  category={selectedCategoryId}
                />
              );
            })}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No restaurants available</Text>
          </View>
        )}

        <FilterModal
          visible={filterVisible}
          onClose={() => setFilterVisible(false)}
          onApply={(selectedSort: any) => {
            console.log("Selected sort:", selectedSort);
            setFilterVisible(false);
          }}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#fff",
  },
  stickyHeader: {
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    zIndex: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  categoryScrollView: {
    marginTop: 5,
  },
  scrollContent: {
    flex: 1,
  },
  scrollContentContainer: {
    padding: 10,
    paddingBottom: 20,
  },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginVertical: 10 },
  tabs: { flexDirection: "row", marginVertical: 10 },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#f1f1f1",
    borderRadius: 20,
    marginRight: 10,
  },
  activeTab: { backgroundColor: "#ffebe6" },
  tabText: { color: "#555", fontWeight: "600" },
  activeTabText: { color: "#e53935" },

  card: {
    width: 180,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginRight: 12,
    elevation: 2,
    overflow: "hidden",
  },
  cardImage: { width: "100%", height: 120, borderTopLeftRadius: 10, borderTopRightRadius: 10 },
  cardBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#ffcce0",
    padding: 5,
    borderRadius: 6,
  },
  badgeText: { fontSize: 10, fontWeight: "bold", color: "#000" },
  cardPrice: { fontWeight: "bold", marginTop: 5 },
  cardTitle: { fontSize: 14, fontWeight: "600", marginVertical: 4 },
  cardInfo: { fontSize: 12, color: "#777" },
  highlight: { color: "#f57c00", fontWeight: "bold" },
  ratingRow: { flexDirection: "row", alignItems: "center", marginVertical: 3 },
  ratingText: { fontSize: 12, marginLeft: 4, color: "green" },
  priceRow: { flexDirection: "row", alignItems: "center", marginTop: 5 },
  mrp: { fontSize: 12, textDecorationLine: "line-through", color: "#999", marginRight: 6 },
  discount: { fontSize: 14, fontWeight: "bold", color: "#e53935", marginRight: 10 },
  addBtn: {
    backgroundColor: "#e0f2f1",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
  },
  addText: { color: "green", fontWeight: "bold" },

  proteinBox: { 
    alignItems: "center", 
    marginRight: 15,
    padding: 5,
  },
  selectedProteinBox: {
    backgroundColor: "#ffebe6",
    borderRadius: 30,
    padding: 5,
  },
  proteinImage: { width: 60, height: 60, borderRadius: 30 },
  selectedProteinImage: {
    borderWidth: 2,
    borderColor: "#e53935",
  },
  proteinText: { marginTop: 5, fontSize: 12 },
  selectedProteinText: {
    color: "#e53935",
    fontWeight: "bold",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  loadingText: {
    marginLeft: 10,
    fontSize: 14,
    color: "#666",
  },
  emptyContainer: {
    paddingVertical: 20,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#999",
  },

  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 15,
    justifyContent: "space-between",
  },
  filterBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f1f1",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  filterText: { fontSize: 12, marginLeft: 5, fontWeight: "600" },
  boltBtn: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "orange",
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  boltText: { fontSize: 12, marginLeft: 5, fontWeight: "600", color: "orange" },
});

export default Tenmins;
