import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Modal,
    TextInput,
    ScrollView,
    Alert,
    Image
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../../componets/header";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../../theme/ThemeContext"; 
import { createOrder } from "../../../redux/slices/orderSlice";

const OrderPlaceScreen = () => {
    const { colors, spacing, fontSizes } = useTheme();
    const dispatch = useDispatch()
    const navigation = useNavigation();

    // 🏠 Delivery Addresses
    const [addresses, setAddresses] = useState([
        {
            id: "1",
            label: "Home",
            address: "123 Main Street",
            city: "Delhi",
            country: "India",
            landmark: "Near Metro Station",
        },
        {
            id: "2",
            label: "Office",
            address: "Tech Park, Sector 62",
            city: "Noida",
            country: "India",
            landmark: "Opp. IT Tower",
        },
    ]);
    const [selectedAddress, setSelectedAddress] = useState("1");

    // ➕ Add Address Modal
    const [isModalVisible, setModalVisible] = useState(false);
    const [newAddress, setNewAddress] = useState({
        label: "",
        address: "",
        city: "",
        country: "",
        landmark: "",
    });

    // 🧾 Coupon
    const [couponCode, setCouponCode] = useState("");
    const [discount, setDiscount] = useState(0);

    // 🛒 Cart Data (Redux)
    const cartItems = useSelector((state: RootState) => state.cart.items);


    // 💰 Price Calculations
    const productTotal = cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );
    const gst = productTotal * 0.18; // 18% GST
    const deliveryCharge = productTotal > 499 ? 0 : 40;
    const totalAmount = productTotal + gst + deliveryCharge - discount;

    // 🏷️ Coupon validation
    const handleApplyCoupon = () => {
        if (couponCode.trim().toLowerCase() === "save10") {
            setDiscount(productTotal * 0.1);
            Alert.alert("✅ Success", "Coupon applied successfully!");
        } else {
            setDiscount(0);
            Alert.alert("❌ Invalid", "Coupon code is not valid!");
        }
    };

    // ➕ Add New Address
    const handleAddAddress = () => {
        if (
            newAddress.label &&
            newAddress.address &&
            newAddress.city &&
            newAddress.country
        ) {
            setAddresses((prev) => [
                ...prev,
                { id: Date.now().toString(), ...newAddress },
            ]);
            setNewAddress({
                label: "",
                address: "",
                city: "",
                country: "",
                landmark: "",
            });
            setModalVisible(false);
        } else {
            Alert.alert("⚠️ Error", "Please fill all required fields");
        }
    };

    // 🧾 Place Order
    const handlePlaceOrder = async() => {
        const address = addresses.find((a) => a.id === selectedAddress);
        let orderData= {
            payment_method: "Online",
            coupon_code: couponCode,
            delivery_charges: deliveryCharge,
            tax_amount: "",
            total_amount: totalAmount,
            address_id: address,
            items: cartItems
          }
          console.log(orderData)
        dispatch(await createOrder(orderData))
        // Alert.alert(
        //     "Order Placed 🎉",
        //     `Your order will be delivered to:\n${address.label}\n${address.address}, ${address.city}, ${address.country}\n${address.landmark}`
        // );
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
            <Header title={"My Cart"} onBack={() => navigation.goBack()} />

            <View style={styles.subContainer}>
                {/* ADDRESS SECTION */}
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                    Delivery Address
                </Text>

                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={addresses}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[
                                styles.addressCard,
                                {
                                    backgroundColor:
                                        selectedAddress === item.id
                                            ? colors.primary + "20"
                                            : colors.surface,
                                    borderColor:
                                        selectedAddress === item.id
                                            ? colors.primary
                                            : colors.border,
                                },
                            ]}
                            onPress={() => setSelectedAddress(item.id)}
                        >
                            <Text style={[styles.addressLabel, { color: colors.text }]}>
                                {item.label}
                            </Text>
                            <Text style={[styles.addressText, { color: colors.textSecondary }]}>
                                {item.address}, {item.city}
                            </Text>
                            <Text style={[styles.addressText, { color: colors.textSecondary }]}>
                                {item.country}
                            </Text>
                            {item.landmark ? (
                                <Text style={[styles.addressText, { color: colors.textSecondary }]}>
                                    Landmark: {item.landmark}
                                </Text>
                            ) : null}
                        </TouchableOpacity>
                    )}
                    contentContainerStyle={{ paddingVertical: 12 }}
                />

                <TouchableOpacity
                    style={[styles.addAddressButton, { backgroundColor: colors.surface }]}
                    onPress={() => setModalVisible(true)}
                >
                    <Text style={[styles.addAddressText, { color: colors.primary }]}>
                        + Add New Address
                    </Text>
                </TouchableOpacity>

                {/* CART ITEMS */}
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                    Your Items
                </Text>
                {cartItems.length > 0 ? (
                    cartItems.map((item) => (
                        <View
                            style={[styles.cartItem, { backgroundColor: colors.surface ,gap:10}]}
                            key={item.id}
                        >
                          <Image source={{ uri: item.image }} style={styles.img} /> 
                            <Text style={[styles.itemTitle, { color: colors.text }]}>
                                {item.name}
                            </Text>
                            <Text style={[styles.itemQty, { color: colors.textSecondary }]}>
                                x{item.quantity}
                            </Text>
                            <Text style={[styles.itemPrice, { color: colors.text }]}>
                                ₹{item.price * item.quantity}
                            </Text>
                        </View>
                    ))
                ) : (
                    <Text style={[styles.emptyCart, { color: colors.textSecondary }]}>
                        Your cart is empty
                    </Text>
                )}

                {/* COUPON */}
                <View style={styles.couponContainer}>
                    <TextInput
                        style={[
                            styles.couponInput,
                            { backgroundColor: colors.surface, color: colors.text },
                        ]}
                        placeholder="Enter coupon code"
                        placeholderTextColor={colors.textSecondary}
                        value={couponCode}
                        onChangeText={setCouponCode}
                    />
                    <TouchableOpacity
                        style={[styles.applyButton, { backgroundColor: colors.primary }]}
                        onPress={handleApplyCoupon}
                    >
                        <Text style={[styles.applyText, { color: colors.background }]}>
                            Apply
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* BILL DETAILS */}
                <View style={[styles.billContainer, { backgroundColor: colors.surface }]}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        Bill Details
                    </Text>

                    <View style={styles.billRow}>
                        <Text style={{ color: colors.textSecondary }}>Product Total</Text>
                        <Text style={{ color: colors.text }}>₹{productTotal.toFixed(2)}</Text>
                    </View>
                    <View style={styles.billRow}>
                        <Text style={{ color: colors.textSecondary }}>GST (18%)</Text>
                        <Text style={{ color: colors.text }}>₹{gst.toFixed(2)}</Text>
                    </View>
                    <View style={styles.billRow}>
                        <Text style={{ color: colors.textSecondary }}>Delivery Charge</Text>
                        <Text style={{ color: colors.text }}>
                            {deliveryCharge === 0 ? "Free" : `₹${deliveryCharge}`}
                        </Text>
                    </View>

                    {discount > 0 && (
                        <View style={styles.billRow}>
                            <Text style={{ color: colors.success }}>Discount</Text>
                            <Text style={{ color: colors.success }}>
                                -₹{discount.toFixed(2)}
                            </Text>
                        </View>
                    )}

                    <View style={[styles.billRow, styles.totalRow]}>
                        <Text style={[styles.totalText, { color: colors.text }]}>
                            Total Amount
                        </Text>
                        <Text style={[styles.totalText, { color: colors.text }]}>
                            ₹{totalAmount.toFixed(2)}
                        </Text>
                    </View>
                </View>

                {/* PLACE ORDER */}
                <TouchableOpacity
                    style={[styles.orderButton, { backgroundColor: colors.primary }]}
                    onPress={handlePlaceOrder}
                >
                    <Text style={[styles.orderButtonText, { color: colors.background }]}>
                        Place Order
                    </Text>
                </TouchableOpacity>
            </View>

            {/* ADD ADDRESS MODAL */}
            <Modal visible={isModalVisible} transparent animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={[styles.modalBox, { backgroundColor: colors.surface }]}>
                        <Text style={[styles.modalTitle, { color: colors.text }]}>
                            Add New Address
                        </Text>

                        {["label", "address", "city", "country", "landmark"].map((key) => (
                            <TextInput
                                key={key}
                                style={[
                                    styles.modalInput,
                                    { backgroundColor: colors.inputBg, color: colors.text },
                                ]}
                                placeholder={
                                    key === "label"
                                        ? "Label (e.g. Home)"
                                        : key.charAt(0).toUpperCase() + key.slice(1)
                                }
                                placeholderTextColor={colors.textSecondary}
                                value={newAddress[key]}
                                onChangeText={(text) =>
                                    setNewAddress({ ...newAddress, [key]: text })
                                }
                            />
                        ))}

                        <TouchableOpacity
                            style={[styles.modalAddBtn, { backgroundColor: colors.primary }]}
                            onPress={handleAddAddress}
                        >
                            <Text style={[styles.modalAddText, { color: colors.background }]}>
                                Save Address
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => setModalVisible(false)}
                            style={styles.modalCancel}
                        >
                            <Text style={[styles.cancelText, { color: colors.error }]}>
                                Cancel
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
};

export default OrderPlaceScreen;

const styles = StyleSheet.create({
    container: { flex: 1 },
    subContainer: { padding: 16 },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginTop: 16,
        marginBottom: 8,
    },
    addressCard: {
        padding: 12,
        borderRadius: 10,
        marginRight: 10,
        borderWidth: 1.2,
        width: 220,
    },
    addressLabel: { fontSize: 16, fontWeight: "600" },
    addressText: { marginTop: 4, fontSize: 14 },
    addAddressButton: {
        padding: 12,
        alignItems: "center",
        borderRadius: 10,
        marginVertical: 10,
    },
    img: {
        height: 50,
        width: 50,
        borderRadius:10
    },
    addAddressText: { fontSize: 14, fontWeight: "500" },
    cartItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 12,
        borderRadius: 10,
        marginVertical: 6,
    },
    itemTitle: { flex: 1, fontSize: 16 },
    itemQty: { fontSize: 15, marginRight: 10 },
    itemPrice: { fontSize: 16, fontWeight: "600" },
    couponContainer: { flexDirection: "row", marginTop: 16 },
    couponInput: {
        flex: 1,
        borderRadius: 8,
        padding: 12,
        borderWidth: 0.5,
    },
    applyButton: {
        paddingHorizontal: 16,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8,
        marginLeft: 10,
    },
    applyText: { fontWeight: "600" },
    billContainer: {
        padding: 16,
        borderRadius: 10,
        marginTop: 20,
    },
    billRow: { flexDirection: "row", justifyContent: "space-between", marginVertical: 6 },
    totalRow: {
        borderTopWidth: 1,
        marginTop: 10,
        paddingTop: 10,
    },
    totalText: { fontSize: 18, fontWeight: "700" },
    orderButton: {
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 30,
        marginBottom: 50,
    },
    orderButtonText: { fontSize: 18, fontWeight: "600" },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.4)",
        padding: 20,
    },
    modalBox: { borderRadius: 12, padding: 20 },
    modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 10 },
    modalInput: { borderRadius: 8, padding: 10, marginTop: 10, borderColor: 'gray', borderStyle: 'solid', borderWidth: 1 },
    modalAddBtn: {
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: "center",
        marginTop: 16,
    },
    modalAddText: { fontWeight: "600" },
    modalCancel: { alignItems: "center", marginTop: 10 },
    cancelText: { fontSize: 14 },
    emptyCart: { textAlign: "center", marginVertical: 20 },
});
