import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Header from "../../../componets/header";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../../redux/slices/homeSlice";
import { Item } from "react-native-paper/lib/typescript/components/Drawer/Drawer";
import { useAppNavigation } from "../../../utils/functions";

// const categories = [
//   { id: "1", name: "Veg Meal", image: "https://img.icons8.com/emoji/96/rice-cracker.png" },
//   { id: "2", name: "Pizza", image: "https://img.icons8.com/emoji/96/pizza.png" },
//   { id: "3", name: "Thali", image: "https://img.icons8.com/emoji/96/bento-box.png" },
//   { id: "4", name: "Cake", image: "https://img.icons8.com/emoji/96/shortcake.png" },
//   { id: "5", name: "Burger", image: "https://img.icons8.com/emoji/96/hamburger.png" },
//   { id: "6", name: "Chole Bhature", image: "https://img.icons8.com/emoji/96/cooked-rice.png" },
//   { id: "7", name: "North Indian", image: "https://img.icons8.com/emoji/96/flatbread.png" },
//   { id: "8", name: "Biryani", image: "https://img.icons8.com/emoji/96/curry-rice.png" },
//   { id: "9", name: "Paneer", image: "https://img.icons8.com/emoji/96/stew.png" },
//   { id: "10", name: "Rolls", image: "https://img.icons8.com/emoji/96/burrito.png" },
//   { id: "11", name: "Sweets", image: "https://img.icons8.com/emoji/96/doughnut.png" },
//   { id: "12", name: "Dosa", image: "https://img.icons8.com/emoji/96/flatbread.png" },
//   { id: "13", name: "Chinese", image: "https://img.icons8.com/emoji/96/noodles.png" },
//   { id: "14", name: "Noodles", image: "https://img.icons8.com/emoji/96/spaghetti.png" },
//   { id: "15", name: "Paratha", image: "https://img.icons8.com/emoji/96/flatbread.png" },
// ];
 
const SearchProduct = () => {
  const navigation = useNavigation();
  const [recent, setRecent] = useState<string[]>(["Khandelwal Dhaba"]);
  const [query, setQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<any[]>([]);
  const dispatch = useDispatch();
  const { products, categories, restaurants } = useSelector((state: any) => state.home);
  const { goToProductList } = useAppNavigation();
  // useEffect(() => {
  //  const getCategories = async () => {
  //    let res = await dispatch(fetchCategories()).unwrap();
  //  }
  //  getCategories()
   
  // }, [])
  

  const addToRecent = (term: string) => {
    const normalised = term.trim();
    if (!normalised) return;
    setRecent((prev) => {
      const withoutTerm = prev.filter(
        (item) => item.toLowerCase() !== normalised.toLowerCase()
      );
      return [normalised, ...withoutTerm].slice(0, 5);
    });
  };

  useEffect(() => {
    const searchTerm = query.trim().toLowerCase();
    if (!searchTerm) {
      setFilteredProducts([]);
      setFilteredRestaurants([]);
      return;
    }

    const productMatches = products.filter((product: any) => {
      const nameMatch = product?.name?.toLowerCase().includes(searchTerm);
      const categoryMatch = product?.categoryId?.name
        ?.toLowerCase()
        .includes(searchTerm);
      return nameMatch || categoryMatch;
    });

    const restaurantMatches = restaurants.filter((restaurant: any) => {
      const nameMatch = restaurant?.name?.toLowerCase().includes(searchTerm);
      const cuisineMatch = Array.isArray(restaurant?.cuisineType)
        ? restaurant.cuisineType.some((cuisine: string) =>
            cuisine?.toLowerCase().includes(searchTerm)
          )
        : false;
      return nameMatch || cuisineMatch;
    });

    setFilteredProducts(productMatches);
    setFilteredRestaurants(restaurantMatches);
  }, [products, restaurants, query]);

  const handleSubmitSearch = () => {
    const trimmed = query.trim();
    if (!trimmed) {
      setFilteredProducts([]);
      setFilteredRestaurants([]);
      return;
    }
    addToRecent(trimmed);
  };

  const handleRecentPress = (term: string) => {
    setQuery(term);
    addToRecent(term);
  };

  const handleCategoryPress = (item: any) => {
    setQuery(item.name);
    addToRecent(item.name);
    goToProductList(item);
  };

  return (
    <ScrollView style={styles.container}>
      {/* <Header
                    title="Search item"
                    onBack={()=>{navigation.goBack()}}
                // onAdd={() => console.log("Add clicked!")}
                />   */}
      {/* Search Bar */}
      <View style={styles.searchBar}>
        <TouchableOpacity onPress={()=>{navigation.goBack()}}>
          <MaterialIcons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <TextInput
          placeholder="Restaurant name or a dish..."
          style={styles.input}
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
          onSubmitEditing={handleSubmitSearch}
        />
        {/* <MaterialIcons name="mic" size={24} color="#f44336" /> */}
      </View>

      {/* Recent Searches */}
      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.sectionTitle}>YOUR RECENT SEARCHES</Text>
          <TouchableOpacity onPress={() => setRecent([])}>
            <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.recentList}>
          {recent.map((item, index) => (
            <TouchableOpacity
              key={`${item}-${index}`}
              style={styles.recentTag}
              onPress={() => handleRecentPress(item)}
            >
              <MaterialIcons name="history" size={16} color="#666" />
              <Text style={styles.recentText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Categories */}
      <Text style={styles.sectionTitle}>WHAT’S ON YOUR MIND?</Text>
      <FlatList
        data={categories}
        keyExtractor={(item) => item._id || item.id}
        numColumns={3}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.categoryCard}
            onPress={() => handleCategoryPress(item)}
          >
            <Image source={{ uri: item.image }} style={styles.categoryImage} />
            <Text style={styles.categoryText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />

      {query.trim().length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SEARCH RESULTS</Text>
          {filteredProducts.length === 0 && filteredRestaurants.length === 0 ? (
            <Text style={styles.emptyResults}>
              No matches found for "{query.trim()}"
            </Text>
          ) : (
            <>
              {filteredProducts.length > 0 && (
                <View style={styles.resultGroup}>
                  <Text style={styles.resultSectionTitle}>Products</Text>
                  {filteredProducts.map((product: any) => (
                    <View key={product._id} style={styles.resultItem}>
                      <Image
                        source={{ uri: product.image }}
                        style={styles.resultImage}
                      />
                      <View style={styles.resultContent}>
                        <Text style={styles.resultTitle}>{product.name}</Text>
                        <Text style={styles.resultSubtitle}>
                          ₹{product.price} • {product?.categoryId?.name}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}

              {filteredRestaurants.length > 0 && (
                <View style={styles.resultGroup}>
                  <Text style={styles.resultSectionTitle}>Restaurants</Text>
                  {filteredRestaurants.map((restaurant: any) => (
                    <View key={restaurant._id} style={styles.resultItem}>
                      <Image
                        source={{ uri: restaurant?.images?.[0]?.url }}
                        style={styles.resultImage}
                      />
                      <View style={styles.resultContent}>
                        <Text style={styles.resultTitle}>{restaurant.name}</Text>
                        <Text style={styles.resultSubtitle}>
                          {Array.isArray(restaurant.cuisineType)
                            ? restaurant.cuisineType.join(", ")
                            : ""}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </>
          )}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 12 },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginVertical: 15,
    
  },
  input: { flex: 1, padding: 8, fontSize: 16 },
  section: { marginVertical: 10 },
  sectionTitle: { fontWeight: "bold", color: "#333", marginBottom: 8 },
  row: { flexDirection: "row", justifyContent: "space-between" },
  clearText: { color: "red", fontSize: 12 },
  recentList: { flexDirection: "row", flexWrap: "wrap", marginTop: 5 },
  recentTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eee",
    padding: 6,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
  },
  recentText: { marginLeft: 5, fontSize: 13, color: "#333" },
  categoryCard: {
    flex: 1,
    alignItems: "center",
    margin: 8,
  },
  categoryImage: { width: 70, height: 70, borderRadius: 50 },
  categoryText: { marginTop: 6, fontSize: 13, fontWeight: "500", color: "#333" },
  emptyResults: { marginTop: 10, color: "#999", fontSize: 14 },
  resultGroup: { marginTop: 12 },
  resultSectionTitle: { fontSize: 14, fontWeight: "600", color: "#555", marginBottom: 6 },
  resultItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f7f7f7",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  resultImage: { width: 45, height: 45, borderRadius: 8, marginRight: 10 },
  resultContent: { flex: 1 },
  resultTitle: { fontSize: 15, fontWeight: "600", color: "#222" },
  resultSubtitle: { fontSize: 12, color: "#666", marginTop: 2 },
});

export default SearchProduct;
