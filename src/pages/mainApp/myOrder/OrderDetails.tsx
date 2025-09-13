import React from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    FlatList,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Header from "../../../componets/header";
import { useNavigation } from "@react-navigation/native";
import { useAppNavigation } from "../../../utils/functions";

const orderDetails = {
    id: "123",
    restaurant: {
        name: "Pizza Hub",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjZWxF857wSQn-JXkXtibHxZpX4xmyj1p6tA&s",
        location: "Sanganer, Jaipur",
    },
    items: [
        { id: "1", name: "Margherita Pizza", qty: 2, price: 199 },
        { id: "2", name: "Garlic Bread", qty: 1, price: 120 },
        { id: "3", name: "Coke (500ml)", qty: 2, price: 80 },
    ],
    deliveryFee: 30,
    tax: 18,
    status: "On the way", // Preparing | On the way | Delivered
    rider: {
        name: "Rahul Sharma",
        phone: "+91 9876543210",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjZWxF857wSQn-JXkXtibHxZpX4xmyj1p6tA&s",
    },
};

const getStatusStep = (status: string) => {
    switch (status) {
        case "Preparing":
            return 1;
        case "On the way":
            return 2;
        case "Delivered":
            return 3;
        default:
            return 0;
    }
};

const OrderDetailsScreen = () => {
    const { goToOrderTracking } = useAppNavigation();
    const statusStep = getStatusStep(orderDetails.status);
    const navigation = useNavigation();

    const total = orderDetails.items.reduce(
        (sum, item) => sum + item.price * item.qty,
        0
    );

    return (
        <ScrollView style={styles.container}>
            <Header
                title="Order Details"
                onBack={() => navigation.goBack()}
            />
            {/* Restaurant Header */}
            <View style={styles.header}>
                <Image source={{ uri: orderDetails.restaurant.image }} style={styles.restImage} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.restName}>{orderDetails.restaurant.name}</Text>
                    <Text style={styles.restLocation}>{orderDetails.restaurant.location}</Text>
                </View>
            </View>

            {/* Status Timeline */}
            <View style={styles.timeline}>
                {["Preparing", "On the way", "Delivered"].map((step, index) => (
                    <View key={step} style={styles.timelineStep}>
                        <MaterialIcons
                            name={index + 1 <= statusStep ? "check-circle" : "radio-button-unchecked"}
                            size={28}
                            color={index + 1 <= statusStep ? "#4caf50" : "#ccc"}
                        />
                        <Text
                            style={[
                                styles.timelineText,
                                { color: index + 1 <= statusStep ? "#4caf50" : "#777" },
                            ]}
                        >
                            {step}
                        </Text>
                    </View>
                ))}
            </View>

            {/* Order Items */}
            <Text style={styles.sectionTitle}>Order Items</Text>
            <FlatList
                data={orderDetails.items}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.itemRow}>
                        <Text style={styles.itemName}>
                            {item.qty}x {item.name}
                        </Text>
                        <Text style={styles.itemPrice}>₹{item.price * item.qty}</Text>
                    </View>
                )}
            />

            {/* Bill Summary */}
            <Text style={styles.sectionTitle}>Bill Details</Text>
            <View style={styles.itemRow}>
                <Text style={styles.itemName}>Item Total</Text>
                <Text style={styles.itemPrice}>₹{total}</Text>
            </View>
            <View style={styles.itemRow}>
                <Text style={styles.itemName}>Delivery Fee</Text>
                <Text style={styles.itemPrice}>₹{orderDetails.deliveryFee}</Text>
            </View>
            <View style={styles.itemRow}>
                <Text style={styles.itemName}>Taxes</Text>
                <Text style={styles.itemPrice}>₹{orderDetails.tax}</Text>
            </View>
            <View style={styles.itemRowTotal}>
                <Text style={styles.totalText}>Grand Total</Text>
                <Text style={styles.totalPrice}>₹{total + orderDetails.deliveryFee + orderDetails.tax}</Text>
            </View>

            {/* Rider Info */}
            <Text style={styles.sectionTitle}>Delivery Partner</Text>
            <View style={styles.riderBox}>
                <Image source={{ uri: orderDetails.rider.image }} style={styles.riderImage} />
                <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.riderName}>{orderDetails.rider.name}</Text>
                    <Text style={styles.riderPhone}>{orderDetails.rider.phone}</Text>
                </View>
                <MaterialIcons name="call" size={28} color="#4caf50" />
            </View>

            {/* Track Order */}
            <TouchableOpacity style={styles.trackBtn} onPress={() => goToOrderTracking()}>
                <Text style={styles.trackText}>Track Order</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    header: {
        flexDirection: "row",
        padding: 16,
        borderBottomWidth: 1,
        borderColor: "#eee",
        alignItems: "center",
    },
    restImage: { width: 60, height: 60, borderRadius: 10 },
    restName: { fontSize: 18, fontWeight: "bold", color: "#222" },
    restLocation: { fontSize: 13, color: "#777" },

    timeline: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginVertical: 20,
    },
    timelineStep: { alignItems: "center" },
    timelineText: { marginTop: 4, fontSize: 12 },

    sectionTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginHorizontal: 16,
        marginTop: 12,
        marginBottom: 6,
    },
    itemRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: 16,
        paddingVertical: 6,
    },
    itemRowTotal: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: 16,
        paddingVertical: 10,
        borderTopWidth: 1,
        borderColor: "#eee",
        marginTop: 6,
    },
    itemName: { fontSize: 14, color: "#333" },
    itemPrice: { fontSize: 14, fontWeight: "bold", color: "#222" },
    totalText: { fontSize: 16, fontWeight: "bold", color: "#000" },
    totalPrice: { fontSize: 16, fontWeight: "bold", color: "#000" },

    riderBox: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fafafa",
        margin: 16,
        padding: 12,
        borderRadius: 10,
        elevation: 1,
    },
    riderImage: { width: 50, height: 50, borderRadius: 25 },
    riderName: { fontSize: 14, fontWeight: "bold", color: "#222" },
    riderPhone: { fontSize: 13, color: "#555" },

    trackBtn: {
        backgroundColor: "#f44336",
        margin: 16,
        padding: 14,
        borderRadius: 8,
        alignItems: "center",
    },
    trackText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});

export default OrderDetailsScreen;
