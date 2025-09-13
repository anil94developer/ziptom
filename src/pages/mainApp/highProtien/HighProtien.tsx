import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { ImageAssets } from "../../../assets/images";
import RecommendedSection from "../home/RecommendedSection";
import FoodCard from "../home/FoodCard";
import { foodItems } from "../../../enums/foods";
import { useTheme } from "../../../theme/ThemeContext";
import FilterModal from "../home/FilterModal";

const proteinTabs = ["15-30 GRAM", "45+ GRAM"];
const proteinSources = [
  { name: "Chicken", image: ImageAssets.Logo },
  { name: "Chicken", image: ImageAssets.Logo },
  { name: "Chicken", image: ImageAssets.Logo },
  { name: "Chicken", image: ImageAssets.Logo },
  { name: "Chicken", image: ImageAssets.Logo },
  { name: "Chicken", image: ImageAssets.Logo },
  { name: "Chicken", image: ImageAssets.Logo },
  { name: "Chicken", image: ImageAssets.Logo },
  { name: "Chicken", image: ImageAssets.Logo },
  { name: "Chicken", image: ImageAssets.Logo },
  { name: "Chicken", image: ImageAssets.Logo },

  // { name: "Eggs", image: require("./assets/eggs.png") },
  // { name: "Fish", image: require("./assets/fish.png") },
  // { name: "Mutton", image: require("./assets/mutton.png") },
  // { name: "Paneer", image: require("./assets/paneer.png") },
];

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
  const [selectedTab, setSelectedTab] = useState("15-30 GRAM");
  const [filterVisible, setFilterVisible] = useState(false);

  return (
    <ScrollView style={styles.container}>
      {/* Section Title */}
      <Text style={styles.sectionTitle}>🍱 Protein loaded dishes</Text>

      {/* Tabs */}
      <View style={styles.tabs}>
        {proteinTabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tab,
              selectedTab === tab && styles.activeTab,
            ]}
            onPress={() => setSelectedTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === tab && styles.activeTabText,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Dish Cards */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {dishes.map((item) => (
          <View key={item.id} style={styles.card}>
            <Image source={item.image} style={styles.cardImage} />
            <View style={styles.cardBadge}>
              <Text style={styles.badgeText}>HIGH PROTEIN</Text>
            </View>

            <View style={{ padding: 8 }}>
              <Text style={styles.cardPrice}>ITEMS AT ₹{item.price}</Text>
              <Text style={styles.cardTitle} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.cardInfo}>
                <Text style={styles.highlight}>{item.protein}</Text> •{" "}
                <Text style={styles.highlight}>{item.kcal}</Text>
              </Text>

              <View style={styles.ratingRow}>
                <MaterialIcons name="star" size={14} color="green" />
                <Text style={styles.ratingText}>
                  {item.rating} ({item.reviews})
                </Text>
              </View>

              <View style={styles.priceRow}>
                {item.mrp && (
                  <Text style={styles.mrp}>₹{item.mrp}</Text>
                )}
                {item.discount && (
                  <Text style={styles.discount}>₹{item.discount}</Text>
                )}
                <TouchableOpacity style={styles.addBtn}>
                  <Text style={styles.addText}>ADD</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Protein Source */}
      <Text style={styles.sectionTitle}>🎯 Choose your protein source</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {proteinSources.map((src) => (
          <View key={src.name} style={styles.proteinBox}>
            <Image source={src.image} style={styles.proteinImage} />
            <Text style={styles.proteinText}>{src.name}</Text>
          </View>
        ))}
      </ScrollView>

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

      <Text style={styles.sectionTitle}>367 Restaurants to explore</Text>
      <FlatList
                          data={foodItems || []}
                          showsHorizontalScrollIndicator={false}
                          keyExtractor={item => item.id.toString()}
                          style={{ backgroundColor: colors.surface, padding: 10, paddingBottom: 10 }}
                          contentContainerStyle={{   }}
                          renderItem={({ item }) => (
                              <FoodCard
                                  image="https://www.eatingwell.com/thmb/m5xUzIOmhWSoXZnY-oZcO9SdArQ=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/article_291139_the-top-10-healthiest-foods-for-kids_-02-4b745e57928c4786a61b47d8ba920058.jpg"
                                  discount="66% off upto ₹126"
                                  time="20-25 MINS"
                                  name="Faasos - Wraps, Rolls & Shawarma"
                                  rating={4.3}
                                  reviews={477}
                                  location="Pratap Nagar"
                                  distance="1.5 km"
                                  cuisines="Kebabs, Fast Food"
                                  price={200}
                              />
      
                          )}
                      />



                      <FilterModal
                                      visible={filterVisible}
                                      onClose={() => setFilterVisible(false)}
                                      onApply={(selectedSort) => {
                                          console.log("Selected sort:", selectedSort);
                                          setFilterVisible(false);
                                      }}
                                  />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 10 },
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

  proteinBox: { alignItems: "center", marginRight: 15 },
  proteinImage: { width: 60, height: 60, borderRadius: 30 },
  proteinText: { marginTop: 5, fontSize: 12 },

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

export default HighProtien;
