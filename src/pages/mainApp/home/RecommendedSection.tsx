import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const DATA = [
  {
    id: "1",
    name: "Khandelwal Dhaba",
    img: "https://picsum.photos/200/150?random=1",
    discount: "FLAT 50% OFF",
    rating: "3.6",
    time: "15–20 mins",
  },
  {
    id: "2",
    name: "Punjabi Tadka",
    img: "https://picsum.photos/200/150?random=2",
    discount: "60% OFF",
    rating: "3.8",
    time: "30–35 mins",
  },
  {
    id: "3",
    name: "Dosaka - Tasty",
    img: "https://picsum.photos/200/150?random=3",
    discount: "50% OFF up to ₹100",
    rating: "4.2",
    time: "15–20 mins",
  },
  {
    id: "4",
    name: "Meals On Move",
    img: "https://picsum.photos/200/150?random=4",
    discount: "40% OFF up to ₹80",
    rating: "4.0",
    time: "25–30 mins",
  },
  {
    id: "5",
    name: "Khatu Dham Dhaba",
    img: "https://picsum.photos/200/150?random=5",
    discount: "FLAT 50% OFF",
    rating: "3.9",
    time: "25–30 mins",
  },
  {
    id: "6",
    name: "Hinaya Kitchen",
    img: "https://picsum.photos/200/150?random=6",
    discount: "60% OFF",
    rating: "3.9",
    time: "30–35 mins",
  },
];

// helper: group data into chunks of 2
const chunkArray = (arr, size) => {
  return arr.reduce((acc, _, i) => {
    if (i % size === 0) acc.push(arr.slice(i, i + size));
    return acc;
  }, []);
};

export default function RecommendedSection() {
  const groupedData = chunkArray(DATA, 2);

  const renderCard = (item) => (
    <TouchableOpacity key={item.id} style={styles.card}>
      <Image source={{ uri: item.img }} style={styles.image} />

      {/* Discount Badge */}
      <View style={styles.discountBadge}>
        <Text style={styles.discountText}>{item.discount}</Text>
      </View>

      {/* Name */}
      <Text style={styles.name} numberOfLines={1}>
        {item.name}
      </Text>

      {/* Row: rating + time */}
      <View style={styles.row}>
        <Text style={styles.rating}>⭐ {item.rating}</Text>
        <MaterialIcons name="time-outline" size={14} color="#555" style={{ marginLeft: 8 }} />
        <Text style={styles.time}>{item.time}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderColumn = ({ item }) => (
    <View style={styles.column}>
      {item.map((food) => renderCard(food))}
    </View>
  );

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>RECOMMENDED FOR YOU</Text>

      <FlatList
        data={groupedData}
        horizontal
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderColumn}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginVertical: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
    paddingLeft: 15,
  },
  column: {
    flexDirection: "column",
    marginRight: 12,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    width: 160,
    marginBottom: 12,
    marginLeft: 15,
    elevation: 2,
    paddingBottom: 10,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 100,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  discountBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountText: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "bold",
  },
  name: {
    fontSize: 13,
    fontWeight: "bold",
    marginTop: 8,
    paddingHorizontal: 8,
    color: "#333",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    paddingHorizontal: 8,
  },
  rating: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#3c763d",
  },
  time: {
    fontSize: 12,
    marginLeft: 4,
    color: "#555",
  },
});
