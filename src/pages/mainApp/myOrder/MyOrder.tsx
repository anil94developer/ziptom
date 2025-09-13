import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useAppNavigation } from "../../../utils/functions";

const orders = [
  {
    id: "1",
    restaurant: "Pizza Hub",
    image: "https://img.freepik.com/free-photo/delicious-pizza.jpg",
    items: "2x Margherita, 1x Garlic Bread",
    price: 519,
    status: "On the way",
  },
  {
    id: "2",
    restaurant: "Biryani House",
    image: "https://img.freepik.com/free-photo/delicious-chicken-biryani.jpg",
    items: "1x Chicken Biryani, 1x Raita",
    price: 299,
    status: "Delivered",
  },
  {
    id: "3",
    restaurant: "Burger Corner",
    image: "https://img.freepik.com/free-photo/tasty-burger.jpg",
    items: "2x Cheeseburger",
    price: 250,
    status: "Preparing",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Preparing":
      return "#ff9800";
    case "On the way":
      return "#2196f3";
    case "Delivered":
      return "#4caf50";
    case "Cancelled":
      return "#f44336";
    default:
      return "#999";
  }
};

const MyOrdersList = () => {
  const {goToOrderDetails}= useAppNavigation();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Orders</Text>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={()=>{goToOrderDetails()}}>
            <Image source={{ uri: item.image }} style={styles.image} />

            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.restaurant}>{item.restaurant}</Text>
              <Text style={styles.items}>{item.items}</Text>
              <Text style={styles.price}>₹{item.price}</Text>

              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(item.status) },
                ]}
              >
                <MaterialIcons
                  name={
                    item.status === "Delivered"
                      ? "check-circle"
                      : item.status === "On the way"
                      ? "delivery-dining"
                      : "hourglass-empty"
                  }
                  size={16}
                  color="#fff"
                />
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 40 },
  title: { fontSize: 24, fontWeight: "bold", margin: 16, color: "#222" },
  card: {
    flexDirection: "row",
    backgroundColor: "#fafafa",
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 10,
    elevation: 2,
  },
  image: { width: 70, height: 70, borderRadius: 10 },
  restaurant: { fontSize: 16, fontWeight: "bold", color: "#222" },
  items: { fontSize: 13, color: "#777", marginVertical: 2 },
  price: { fontSize: 14, fontWeight: "bold", color: "#333" },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: 6,
    alignSelf: "flex-start",
  },
  statusText: { color: "#fff", marginLeft: 4, fontSize: 12 },
});

export default MyOrdersList;
