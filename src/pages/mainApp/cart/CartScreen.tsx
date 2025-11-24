import React from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    ScrollView,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useAppNavigation } from "../../../utils/functions";
import Header from "../../../componets/header";
import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../redux/store"; // adjust path 
import { updateQuantity, removeFromCart, addToCart } from "../../../redux/slices/cartSlice";
import { foodItems } from "../../../enums/foods";


const CartScreen = () => {
    const { goToMainApp, goToOrderPlacePage } = useAppNavigation();
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const cartItems = useSelector((state: RootState) => state.cart.items);



    const updateQty = (id: string, type: "inc" | "dec") => {
        const item = cartItems.find((i) => i.id === id);
        if (!item) return;

        if (type === "dec" && item.quantity === 1) {
            dispatch(removeFromCart({ id: id }));
        } else {
            const newQty = type === "inc" ? item.quantity + 1 : item.quantity - 1;
            dispatch(updateQuantity({ id, quantity: newQty }));
        }
    };

    const total = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

    return (
        <View style={styles.container}>
            <ScrollView>
                <Header title={"My Cart"} onBack={() => navigation.goBack()} onAdd={() => {}} />

                {/* Restaurant Info */}
                <View style={styles.restaurantHeader}>
                    <View style={{ marginLeft: 10 }}>
                        <Text style={styles.restName}>Cart Items</Text>
                        <Text style={styles.address}>Home • 64/66, Ganesh Udhhan</Text>
                    </View>
                </View>

                {/* Saved info */}
                <View style={styles.savedBox}>
                    <Text style={styles.savedText}>₹120 saved! On this order</Text>
                </View>

                {/* Cart Items */}
                {cartItems.map((item) => (
                    <View key={item.id} style={styles.cartItem}>
                        <Image source={{ uri: item.image }} style={styles.cartImg} />
                        <Text style={styles.itemName}>{item.title}</Text>
                        <View style={styles.counterRow}>
                            <TouchableOpacity
                                style={styles.counterBtn}
                                onPress={() => updateQty(item.id, "dec")}
                            >
                                <Text style={styles.counterText}>-</Text>
                            </TouchableOpacity>
                            <Text style={styles.qty}>{item.quantity}</Text>
                            <TouchableOpacity
                                style={styles.counterBtn}
                                onPress={() => updateQty(item.id, "inc")}
                            >
                                <Text style={styles.counterText}>+</Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.price}>₹{item.price}</Text>
                    </View>
                ))}

                {/* Add Items, Requests */}
                <View style={styles.actionRow}>
                    <TouchableOpacity style={styles.actionBtn} onPress={() => goToMainApp()}>
                        <MaterialIcons name="add" size={18} color="#333" />
                        <Text style={styles.actionText}>Add Items</Text>
                    </TouchableOpacity>
                    {/* <TouchableOpacity style={styles.actionBtn}>
                        <MaterialIcons name="list-alt" size={18} color="#333" />
                        <Text style={styles.actionText}>Cooking requests</Text>
                    </TouchableOpacity> */}
                </View>

                {/* Suggestions */}
                {/* <Text style={styles.sectionTitle}>Complete your meal</Text>
                <FlatList
                    horizontal
                    data={foodItems}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.suggestCard}>
                            <Image source={{ uri: item.image }} style={styles.suggestImg} />

                            <Text style={styles.suggestName}>{item.title}</Text>
                            <Text style={styles.suggestPrice}>₹{item.price}</Text>
                            <TouchableOpacity style={styles.addBtn} onPress={() => { dispatch(addToCart({ ...item, quantity: 1, restaurantId: item.restaurantId })) }}>
                                <Text style={styles.addBtnText}>+</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    showsHorizontalScrollIndicator={false}
                    style={{ paddingLeft: 16 }}
                /> */}

                {/* Coupon Section */}
                {/* <TouchableOpacity style={styles.couponBox}>
                    <MaterialIcons name="local-offer" size={20} color="#ff554e" />
                    <Text style={styles.couponText}>Apply restaurant coupon</Text>
                    <MaterialIcons name="chevron-right" size={20} color="#555" />
                </TouchableOpacity> */}
            </ScrollView>

            {/* Bottom Payment */}
            <View style={styles.bottomBar}>
                <View>
                    <Text style={styles.payLabel}>Pay Using</Text>
                    <Text style={styles.payOption}>Pay on Delivery (Cash/UPI)</Text>
                </View>
                <TouchableOpacity style={styles.payBtn} onPress={() => { goToOrderPlacePage() }}>
                    <Text style={styles.payText}>Pay ₹{total}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    restaurantHeader: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        borderBottomWidth: 0.5,
        borderColor: "#ddd",
    },
    restName: { fontSize: 16, fontWeight: "bold", color: "#000" },
    address: { fontSize: 12, color: "#666" },
    savedBox: {
        backgroundColor: "#e8f9ef",
        padding: 10,
        alignItems: "center",
    },
    savedText: { color: "green", fontWeight: "bold" },
    cartItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
        borderBottomWidth: 0.5,
        borderColor: "#eee",
        gap:5
    },
    itemName: { fontSize: 15, color: "#000", flex: 1 },
    counterRow: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderRadius: 6,
        borderColor: "#ccc",
        marginHorizontal: 10,
    },
    counterBtn: { padding: 4, paddingHorizontal: 8 },
    counterText: { fontSize: 18, fontWeight: "bold", color: "#333" },
    qty: { fontSize: 14, fontWeight: "bold", paddingHorizontal: 6 },
    price: { fontSize: 14, fontWeight: "bold", color: "#000" },
    actionRow: { flexDirection: "row", justifyContent: "space-around", padding: 10 },
    actionBtn: { flexDirection: "row", alignItems: "center" },
    actionText: { marginLeft: 4, fontSize: 13, color: "#333" },
    sectionTitle: { fontSize: 15, fontWeight: "bold", margin: 16 },
    suggestCard: {
        width: 120,
        marginRight: 14,
        backgroundColor: "#f9f9f9",
        borderRadius: 12,
        alignItems: "center",
        padding: 10,
    },
    suggestImg: { width: 80, height: 60, borderRadius: 8, marginBottom: 6 },
    cartImg:{width:50,height:50,borderRadius:10},
    suggestName: { fontSize: 13, fontWeight: "500", color: "#000", textAlign: "center" },
    suggestPrice: { fontSize: 12, color: "#555", marginTop: 2 },
    addBtn: {
        backgroundColor: "#eee",
        marginTop: 6,
        borderRadius: 6,
        padding: 4,
        paddingHorizontal: 8,
    },
    addBtnText: { fontWeight: "bold", color: "#333" },
    couponBox: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        borderTopWidth: 0.5,
        borderBottomWidth: 0.5,
        borderColor: "#ddd",
    },
    couponText: { flex: 1, marginLeft: 8, fontSize: 14, color: "#000" },
    bottomBar: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderTopWidth: 0.5,
        borderColor: "#ddd",
        padding: 16,
        bottom: 20,
        backgroundColor: "#fff",
    },
    payLabel: { fontSize: 12, color: "#888" },
    payOption: { fontSize: 14, fontWeight: "500", color: "#000" },
    payBtn: {
        backgroundColor: "#0aaf60",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    payText: { color: "#fff", fontSize: 15, fontWeight: "bold" },
});

export default CartScreen;
