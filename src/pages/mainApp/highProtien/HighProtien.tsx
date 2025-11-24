import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
  ActivityIndicator,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { ImageAssets } from "../../../assets/images";
import RecommendedSection from "../home/RecommendedSection";
import FoodCard from "../home/FoodCard";
import { useTheme } from "../../../theme/ThemeContext";
import FilterModal from "../home/FilterModal";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import { fetchHighProteinCategories, fetchProducts, Category } from "../../../redux/slices/homeSlice";
import { useAppNavigation } from "../../../utils/functions";

const proteinTabs = ["15-30 GRAM", "45+ GRAM"];

const dishes = [
  {
    id: 1,
    name: "Chicken Salad Bowl",
    protein: "26g",
    kcal: "385 kcal",
    price: 149,
    mrp: 215,
    rating: 4.8,
    reviews: 24,
    image: ImageAssets.Logo,
  },
  {
    id: 2,
    name: "Hyderabadi Dum Chicken Biryani",
    protein: "26g",
    kcal: "700 kcal",
    price: 99,
    mrp: 329,
    discount: 219,
    rating: 4.1,
    reviews: 44,
    image: ImageAssets.Logo,
  },
];

const HighProtien = () => {
  const {colors}=useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const { highProteinCategories, products, loading } = useSelector((state: any) => state.home);
  const [selectedTab, setSelectedTab] = useState("15-30 GRAM");
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const hasInitializedCategory = useRef(false);

  // Fetch categories only once on mount
  useEffect(() => {
    dispatch(fetchHighProteinCategories());
  }, [dispatch]);

  // Select first category by default only once when categories are first loaded
  useEffect(() => {
    if (highProteinCategories && highProteinCategories.length > 0 && !hasInitializedCategory.current) {
      const firstCategory = highProteinCategories[0];
      const categoryId = firstCategory.id || firstCategory._id;
      if (categoryId) {
        hasInitializedCategory.current = true;
        setSelectedCategoryId(categoryId);
      }
    }
  }, [highProteinCategories]);

  // Fetch products whenever selectedCategoryId changes
  useEffect(() => {
    if (selectedCategoryId) {
      dispatch(fetchProducts({
        page: 1,
        limit: 50,
        categoryId: selectedCategoryId,
      }));
    }
  }, [selectedCategoryId, dispatch]);

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
        <Text style={styles.sectionTitle}>🎯 Choose your protein source</Text>
        {highProteinCategories && highProteinCategories.length > 0 ? (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.categoryScrollView}
          >
            {highProteinCategories.map((category: Category) => {
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
                    source={{ uri: category.image }} 
                    style={[
                      styles.proteinImage,
                      isSelected && styles.selectedProteinImage
                    ]}
                    defaultSource={ImageAssets.Logo}
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
            <Text style={styles.emptyText}>No protein sources available</Text>
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
          {products && products.length > 0 ? `${products.length} Products to explore` : "Products to explore"}
        </Text>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={styles.loadingText}>Loading products...</Text>
          </View>
        ) : products && products.length > 0 ? (
          <View>
            {products.map((item: any) => {
              const restaurant = item.restaurant || {};
              const discount = item.hasOffer && item.offerDiscount > 0 
                ? `${item.offerDiscount}% off` 
                : "";
              const rating = restaurant.rating || 0;
              const reviews = restaurant.ratingCount || 0;
              const location = restaurant.address?.city || "";
              const distance = ""; // Distance calculation can be added if needed
              
              return (
                <FoodCard
                  key={item.id || item._id || Math.random().toString()}
                  image={item.image || ImageAssets.Logo}
                  discount={discount}
                  time={item.quickDelivery ? "10-15 MINS" : "20-25 MINS"}
                  name={restaurant.name || item.name}
                  rating={rating}
                  reviews={reviews}
                  location={location}
                  distance={distance}
                  cuisines={item.category?.name || ""}
                  features={item.type || ""}
                  item={restaurant}
                />
              );
            })}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No products available</Text>
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
  proteinItemCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  proteinItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  proteinItemName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  proteinBadge: {
    backgroundColor: "#ffcce0",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  proteinBadgeText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#000",
  },
  proteinItemDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
});

export default HighProtien;
