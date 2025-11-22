import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import Header from "../../../componets/header";
import { useTheme } from "../../../theme/ThemeContext";
import {
  Category,
  NineNineProduct,
  fetchCategories,
  fetchNineNineProducts,
  fetchProducts,
  setSearchQuery,
  setSelectedCategoryId,
  resetPagination,
} from "../../../redux/slices/homeSlice";
import { AppDispatch, RootState } from "../../../redux/store";
import { useAppNavigation } from "../../../utils/functions";

type CategoryTab = {
  key: string;
  label: string;
  image?: string;
};

const ProductList = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const { colors } = useTheme();
  const {goToRestaurantDetails} = useAppNavigation()

  const { 
    categories, 
    products, 
    loading, 
    error, 
    vegType,
    currentPage,
    totalPages,
    hasNextPage,
    searchQuery,
    selectedCategoryId,
  } = useSelector((state: RootState) => state.home);

  const [localSearchQuery, setLocalSearchQuery] = useState("");
  const [searchDebounceTimer, setSearchDebounceTimer] = useState<NodeJS.Timeout | null>(null);
  const isInitialMount = useRef(true);

  // Fetch categories on mount
  useEffect(() => {
    if (!categories.length) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length]);

  // Initial fetch and refetch on vegType change
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      dispatch(resetPagination());
      dispatch(fetchProducts({
        page: 1,
        limit: 20,
        categoryId: selectedCategoryId || undefined,
        search: searchQuery || undefined,
      }));
      return;
    }
    
    // Refetch when vegType changes
    dispatch(resetPagination());
    dispatch(fetchProducts({
      page: 1,
      limit: 20,
      categoryId: selectedCategoryId || undefined,
      search: searchQuery || undefined,
    }));
  }, [dispatch, vegType]);

  // Debounced search
  useEffect(() => {
    if (searchDebounceTimer) {
      clearTimeout(searchDebounceTimer);
    }

    const timer = setTimeout(() => {
      dispatch(setSearchQuery(localSearchQuery));
      dispatch(resetPagination());
      dispatch(fetchProducts({
        page: 1,
        limit: 20,
        categoryId: selectedCategoryId || undefined,
        search: localSearchQuery || undefined,
      }));
    }, 500); // 500ms debounce

    setSearchDebounceTimer(timer);

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [localSearchQuery, selectedCategoryId, dispatch]);

  // Fetch when category changes
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    dispatch(resetPagination());
    dispatch(fetchProducts({
      page: 1,
      limit: 20,
      categoryId: selectedCategoryId || undefined,
      search: searchQuery || undefined,
    }));
  }, [selectedCategoryId, dispatch]);

  // Load more products
  const loadMoreProducts = useCallback(() => {
    if (!loading && hasNextPage && currentPage < totalPages) {
      dispatch(fetchProducts({
        page: currentPage + 1,
        limit: 20,
        categoryId: selectedCategoryId || undefined,
        search: searchQuery || undefined,
      }));
    }
  }, [loading, hasNextPage, currentPage, totalPages, selectedCategoryId, searchQuery, dispatch]);

  const categoryTabs: CategoryTab[] = useMemo(() => {
    const base: CategoryTab[] = [{ key: "all", label: "All" }];
    const mapped = categories.map((item: Category) => ({
      key: item._id,
      label: item.name,
      image: item.image,
    }));
    return [...base, ...mapped];
  }, [categories]);

  const handleCategorySelect = (categoryKey: string) => {
    if (categoryKey === "all") {
      dispatch(setSelectedCategoryId(null));
    } else {
      dispatch(setSelectedCategoryId(categoryKey));
    }
  };

  const renderCategoryTab = ({ item }: { item: CategoryTab }) => {
    const isSelected = (item.key === "all" && !selectedCategoryId) || selectedCategoryId === item.key;
    return (
      <TouchableOpacity
        style={[
          styles.categoryChip,
          {
            backgroundColor: isSelected ? colors.primary : colors.surface,
            borderColor: isSelected ? colors.primary : colors.border,
          },
        ]}
        onPress={() => handleCategorySelect(item.key)}
      >
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.categoryChipImage} />
        ) : null}
        <Text
          style={[
            styles.categoryChipText,
            { color: isSelected ? colors.background : colors.text },
          ]}
        >
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderProductCard = ({ item }: { item: NineNineProduct }) => {
    return (
      <TouchableOpacity
        onPress={() => {
            goToRestaurantDetails({restroDetails:item})
           }}
      style={[styles.productCard, { backgroundColor: colors.surface }]}>
        <Image source={{ uri: item.image }} style={styles.productImage} />
        <View style={styles.productContent}>
          <Text style={[styles.productTitle, { color: colors.text }]}>
            {item.name}
          </Text>
          <Text style={[styles.productCategory, { color: colors.textSecondary }]}>
            {item.categoryId?.name ?? "Unknown"}
          </Text>
          <Text style={[styles.productPrice, { color: colors.primary }]}>
            ₹{item.price}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const showLoadingState =
    loading && !products.length && !categories.length && !error;

  const renderFooter = () => {
    if (!hasNextPage) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator color={colors.primary} size="small" />
      </View>
    );
  };
 
  return (
    <View style={{ flex: 1, backgroundColor: colors.background, marginTop: 20 }}>
      <Header title="Products" onBack={() => navigation.goBack()} />
      <View style={styles.container}>
        {/* Search Bar */}
        <View style={[styles.searchContainer, { backgroundColor: colors.surface }]}>
          <MaterialIcons name="search" size={20} color={colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search products..."
            placeholderTextColor={colors.textSecondary}
            value={localSearchQuery}
            onChangeText={setLocalSearchQuery}
          />
          {localSearchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setLocalSearchQuery("")}>
              <MaterialIcons name="close" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.categorySection}>
          <Text style={[styles.sectionHeading, { color: colors.text }]}>
            Categories
          </Text>
          <FlatList
            data={categoryTabs}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.key}
            renderItem={renderCategoryTab}
            contentContainerStyle={styles.categoryListContent}
          />
        </View>

        <View style={styles.productSection}>
          <View style={styles.productHeader}>
            <Text style={[styles.sectionHeading, { color: colors.text }]}>
              Products
            </Text>
            <Text style={[styles.resultCount, { color: colors.textSecondary }]}>
              {products.length} items
            </Text>
          </View>

          {showLoadingState ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color={colors.primary} size="large" />
            </View>
          ) : products.length ? (
            <FlatList
              data={products}
              keyExtractor={(item) => item._id}
              renderItem={renderProductCard}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.productListContent}
              onEndReached={loadMoreProducts}
              onEndReachedThreshold={0.5}
              ListFooterComponent={renderFooter}
            />
          ) : (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyTitle, { color: colors.text }]}>
                No products found
              </Text>
              <Text
                style={[styles.emptySubtitle, { color: colors.textSecondary }]}
              >
                {searchQuery ? "Try a different search term." : "Try selecting a different category."}
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    marginTop: 20,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
  },
  categorySection: {
    marginBottom: 12,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  categoryListContent: {
    paddingRight: 16,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 10,
  },
  categoryChipImage: {
    width: 22,
    height: 22,
    borderRadius: 11,
    marginRight: 8,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: "500",
  },
  productSection: {
    flex: 1,
  },
  productHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  resultCount: {
    fontSize: 12,
  },
  productListContent: {
    paddingBottom: 24,
  },
  productCard: {
    flexDirection: "row",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 12,
    elevation: 2,
  },
  productImage: {
    width: 100,
    height: 100,
  },
  productContent: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },
  productTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  productCategory: {
    fontSize: 12,
    marginTop: 2,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "700",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: "center",
  },
});

export default ProductList;

