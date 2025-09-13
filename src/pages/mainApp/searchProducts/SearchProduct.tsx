import React, { useState } from "react";
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

const categories = [
  { id: "1", name: "Veg Meal", image: "https://img.icons8.com/emoji/96/rice-cracker.png" },
  { id: "2", name: "Pizza", image: "https://img.icons8.com/emoji/96/pizza.png" },
  { id: "3", name: "Thali", image: "https://img.icons8.com/emoji/96/bento-box.png" },
  { id: "4", name: "Cake", image: "https://img.icons8.com/emoji/96/shortcake.png" },
  { id: "5", name: "Burger", image: "https://img.icons8.com/emoji/96/hamburger.png" },
  { id: "6", name: "Chole Bhature", image: "https://img.icons8.com/emoji/96/cooked-rice.png" },
  { id: "7", name: "North Indian", image: "https://img.icons8.com/emoji/96/flatbread.png" },
  { id: "8", name: "Biryani", image: "https://img.icons8.com/emoji/96/curry-rice.png" },
  { id: "9", name: "Paneer", image: "https://img.icons8.com/emoji/96/stew.png" },
  { id: "10", name: "Rolls", image: "https://img.icons8.com/emoji/96/burrito.png" },
  { id: "11", name: "Sweets", image: "https://img.icons8.com/emoji/96/doughnut.png" },
  { id: "12", name: "Dosa", image: "https://img.icons8.com/emoji/96/flatbread.png" },
  { id: "13", name: "Chinese", image: "https://img.icons8.com/emoji/96/noodles.png" },
  { id: "14", name: "Noodles", image: "https://img.icons8.com/emoji/96/spaghetti.png" },
  { id: "15", name: "Paratha", image: "https://img.icons8.com/emoji/96/flatbread.png" },
];

const SearchProduct = () => {
  const navigation = useNavigation();
  const [recent, setRecent] = useState(["Khandelwal Dhaba"]);

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
        />
        <MaterialIcons name="mic" size={24} color="#f44336" />
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
            <View key={index} style={styles.recentTag}>
              <MaterialIcons name="history" size={16} color="#666" />
              <Text style={styles.recentText}>{item}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Categories */}
      <Text style={styles.sectionTitle}>WHAT’S ON YOUR MIND?</Text>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        numColumns={3}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.categoryCard}>
            <Image source={{ uri: item.image }} style={styles.categoryImage} />
            <Text style={styles.categoryText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
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
});

export default SearchProduct;
