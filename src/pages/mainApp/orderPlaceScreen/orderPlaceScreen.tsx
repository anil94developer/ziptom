import React, { useEffect, useState } from "react";
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
    Image,
    ActivityIndicator
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../../componets/header";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../../theme/ThemeContext";
import { createOrder } from "../../../redux/slices/orderSlice";
import { addAddress, getAddress, updateAddress, Address } from "../../../redux/slices/addressSlice";
import { validateCoupon, clearValidatedCoupon } from "../../../redux/slices/couponsSlice";
import { clearCart } from "../../../redux/slices/cartSlice";
import { showToast } from "../../../redux/slices/toastSlice";
import { AppDispatch, RootState } from "../../../redux/store";


const OrderPlaceScreen = ({ route }: any) => {
    const { colors } = useTheme();
    const dispatch = useDispatch<AppDispatch>();
    const navigation = useNavigation();
    
    // Get restaurantId from route params if available
    const routeRestaurantId = route?.params?.restaurantId;

    // 🏠 Delivery Addresses
    // const [addresses, setAddresses] = useState([
    //     {
    //         id: "1",
    //         label: "Home",
    //         address: "123 Main Street",
    //         city: "Delhi",
    //         country: "India",
    //         landmark: "Near Metro Station",
    //     },
    //     {
    //         id: "2",
    //         label: "Office",
    //         address: "Tech Park, Sector 62",
    //         city: "Noida",
    //         country: "India",
    //         landmark: "Opp. IT Tower",
    //     },
    // ]);
    const [selectedAddress, setSelectedAddress] = useState("");

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
    const [appliedCoupon, setAppliedCoupon] = useState<any>(null);

    // 🛒 Cart Data (Redux)
    const cartItems = useSelector((state: RootState) => state?.cart?.items);
    const addresses = useSelector((state: RootState) => state?.address?.addresses);
    const loading = useSelector((state: RootState) => state?.address?.loading);
    const { validatedCoupon, validating: validatingCoupon } = useSelector((state: any) => state.coupon || {});




    useEffect(() => {
        const getAddressFetch = async () => {
            dispatch(getAddress())
        }
        getAddressFetch()
    }, [dispatch])
    
    // Update discount when validated coupon changes
    useEffect(() => {
        if (validatedCoupon) {
            calculateDiscount(validatedCoupon);
            setAppliedCoupon(validatedCoupon);
        } else {
            setDiscount(0);
            setAppliedCoupon(null);
        }
    }, [validatedCoupon])
    // 💰 Price Calculations
    const productTotal = cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );
    const taxPercentage = 5; // 5% tax as per API
    const taxAmount = productTotal * (taxPercentage / 100);
    const deliveryCharge = productTotal > 499 ? 0 : 50; // 50 as per API
    const totalAmount = productTotal + taxAmount + deliveryCharge - discount;

    // Calculate discount based on coupon
    const calculateDiscount = (coupon: any) => {
        if (!coupon) {
            setDiscount(0);
            return;
        }

        let calculatedDiscount = 0;

        if (coupon.discountType === "percentage") {
            // Percentage discount
            calculatedDiscount = (productTotal * coupon.discountValue) / 100;
            // Apply max discount limit if exists
            if (coupon.maxDiscountAmount && calculatedDiscount > coupon.maxDiscountAmount) {
                calculatedDiscount = coupon.maxDiscountAmount;
            }
        } else if (coupon.discountType === "fixed") {
            // Fixed amount discount
            calculatedDiscount = coupon.discountValue;
        }

        // Ensure discount doesn't exceed product total
        if (calculatedDiscount > productTotal) {
            calculatedDiscount = productTotal;
        }

        setDiscount(calculatedDiscount);
    };

    // 🏷️ Coupon validation
    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) {
            dispatch(showToast({ message: "Please enter a coupon code", type: "error" }));
            return;
        }

        // Get restaurantId from cart items
        const restaurantId = cartItems && cartItems.length > 0 
            ? (cartItems[0]?.restaurantId || routeRestaurantId || "")
            : routeRestaurantId || "";

        if (!restaurantId) {
            dispatch(showToast({ message: "Restaurant ID is required to validate coupon. Please add items to cart first.", type: "error" }));
            return;
        }

        try {
            await dispatch(validateCoupon({
                couponCode: couponCode.trim().toUpperCase(),
                restaurantId: restaurantId,
            })).unwrap();
            dispatch(showToast({ message: "Coupon applied successfully!", type: "success" }));
        } catch (error: any) {
            dispatch(clearValidatedCoupon());
            setDiscount(0);
            setAppliedCoupon(null);
            dispatch(showToast({ 
                message: error || "Invalid coupon code", 
                type: "error" 
            }));
        }
    };

    // ➕ Add New Address
    const handleAddAddress = async () => {

        if (
            newAddress.label &&
            newAddress.address &&
            newAddress.city &&
            newAddress.country
        ) {
            // console.log(newAddress) 
            try {
                await dispatch(addAddress(newAddress)).unwrap();
                dispatch(showToast({ message: "Address successfully", type: "success" }));
                setNewAddress({
                    label: "",
                    address: "",
                    city: "",
                    country: "",
                    landmark: "",
                });
                setModalVisible(false);
            } catch (err) {
                dispatch(showToast({ message: "Failed to Address", type: "error" }));
            }
            //  let result= await dispatch(addAddress(newAddress))

            // setAddresses((prev) => [
            //     ...prev,
            //     { id: Date.now().toString(), ...newAddress },
            // ]);

        } else {
            Alert.alert("⚠️ Error", "Please fill all required fields");
        }
    };

    // 🧾 Place Order
    const handlePlaceOrder = async () => {
        // Validate cart is not empty
        if (!cartItems || cartItems.length === 0) {
            dispatch(showToast({ message: "Your cart is empty. Please add items to place an order.", type: "error" }));
            return;
        }

        // Get restaurantId from cart items (all items should have the same restaurantId)
        const restaurantId = cartItems[0]?.restaurantId || routeRestaurantId || "";
        if (!restaurantId) {
            dispatch(showToast({ message: "Restaurant ID is required. Please add items from a restaurant.", type: "error" }));
            return;
        }
        
        // Validate all items are from the same restaurant
        const allSameRestaurant = cartItems.every(item => item.restaurantId === restaurantId);
        if (!allSameRestaurant) {
            dispatch(showToast({ message: "All items must be from the same restaurant. Please clear cart and add items from one restaurant.", type: "error" }));
            return;
        }

        // Validate address is selected
        if (!selectedAddress || selectedAddress.trim() === "") {
            dispatch(showToast({ message: "Please select a delivery address", type: "error" }));
            return;
        }

        // Refresh addresses to ensure we have the latest data
        try {
            await dispatch(getAddress()).unwrap();
        } catch (error) {
            console.log("Error refreshing addresses:", error);
            // Continue anyway, use cached addresses
        }

        // Validate address exists
        let selectedAddr;
        try {
            selectedAddr = JSON.parse(selectedAddress);
        } catch (error) {
            dispatch(showToast({ message: "Invalid address selection. Please select an address again.", type: "error" }));
            return;
        }

        // Find address in the refreshed list
        const addressIdToFind = selectedAddr.id || selectedAddr.addressId || selectedAddr._id;
        const address = addresses?.find((a) => {
            const aId = a.id || a.addressId || (a as any)._id;
            return aId === addressIdToFind;
        });

        if (!address) {
            dispatch(showToast({ message: "Selected address not found. Please select a valid address.", type: "error" }));
            return;
        }

        // Validate address has required fields
        if (!address.address || !address.city || !address.country) {
            dispatch(showToast({ message: "Selected address is incomplete. Please select a complete address.", type: "error" }));
            return;
        }

        // Get address ID - prioritize id, then addressId, then _id
        const deliveryAddressId = address.id || address.addressId || (address as any)._id || "";
        if (!deliveryAddressId) {
            console.error("Address object:", address);
            dispatch(showToast({ message: "Address ID is missing. Please select the address again.", type: "error" }));
            return;
        }

        console.log("Selected Address:", address);
        console.log("Delivery Address ID:", deliveryAddressId);

        // Prepare order items
        const orderItems = cartItems.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
        }));

        const orderData = {
            restaurantId: restaurantId,
            items: orderItems,
            deliveryAddressId: deliveryAddressId,
            paymentMethod: "Online",
            deliveryCharge: deliveryCharge,
            taxPercentage: taxPercentage,
            couponCode: appliedCoupon ? couponCode.trim().toUpperCase() : "",
        };

        console.log("Order Data:", orderData);
        console.log("Delivery Address ID being sent:", deliveryAddressId);
        
        try {
            await dispatch(createOrder(orderData)).unwrap();
            dispatch(showToast({ message: "Order placed successfully!", type: "success" }));
            dispatch(clearValidatedCoupon());
            dispatch(clearCart()); // Clear cart after successful order placement
            // Navigate back or to order confirmation
            navigation.goBack();
        } catch (err: any) {
            console.error("Order placement error:", err);
            const errorMessage = err?.message || err?.error?.details || err?.error?.message || "Failed to place order";
            
            // Handle specific error cases
            if (err?.error?.code === "NOT_FOUND" || errorMessage.includes("not found")) {
                dispatch(showToast({ 
                    message: "Address not found. Please select a different address or add a new one.", 
                    type: "error" 
                }));
                // Refresh addresses and clear selection
                dispatch(getAddress());
                setSelectedAddress("");
            } else {
                dispatch(showToast({ 
                    message: errorMessage, 
                    type: "error" 
                }));
            }
        }
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
            <Header title={"My Cart"} onBack={() => navigation.goBack()} onAdd={() => {}} />

            <View style={styles.subContainer}>
                {/* ADDRESS SECTION */}
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                    Delivery Address
                </Text>

                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={addresses || []}
                            keyExtractor={(item) => item.id || item.label || Math.random().toString()}
                    renderItem={({ item }) => {
                        let isSelected = false;
                        try {
                            if (selectedAddress) {
                                const parsed = JSON.parse(selectedAddress);
                                const selectedId = parsed.id || parsed.addressId || parsed._id;
                                const itemId = item.id || item.addressId || (item as any)._id;
                                isSelected = selectedId === itemId;
                            }
                        } catch (e) {
                            // Ignore parse errors
                        }
                        return (
                            <TouchableOpacity
                                style={[
                                    styles.addressCard,
                                    {
                                        backgroundColor: isSelected
                                            ? colors.primary + "20"
                                            : colors.surface,
                                        borderColor: isSelected
                                            ? colors.primary
                                            : colors.border,
                                    },
                                ]}
                                onPress={() => {
                                    // Store the address with all possible ID fields
                                    const addressToStore = {
                                        ...item,
                                        id: item.id || item.addressId || (item as any)._id,
                                        addressId: item.id || item.addressId || (item as any)._id,
                                    };
                                    setSelectedAddress(JSON.stringify(addressToStore));
                                }}
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
                        );
                    }}
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
                            style={[styles.cartItem, { backgroundColor: colors.surface, gap: 10 }]}
                            key={item.id}
                        >
                            <Image source={{ uri: item.image }} style={styles.img} />
                            <Text style={[styles.itemTitle, { color: colors.text }]}>
                                {item.title}
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
                        disabled={validatingCoupon}
                    >
                        {validatingCoupon ? (
                            <ActivityIndicator size="small" color={colors.background} />
                        ) : (
                            <Text style={[styles.applyText, { color: colors.background }]}>
                                Apply
                            </Text>
                        )}
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
                        <Text style={{ color: colors.textSecondary }}>Tax ({taxPercentage}%)</Text>
                        <Text style={{ color: colors.text }}>₹{taxAmount.toFixed(2)}</Text>
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

                        {(["label", "address", "city", "country", "landmark"] as const).map((key) => (
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
                        {loading ?

                            <ActivityIndicator /> :
                            <TouchableOpacity
                                style={[styles.modalAddBtn, { backgroundColor: colors.primary }]}
                                onPress={handleAddAddress}
                            >
                                <Text style={[styles.modalAddText, { color: colors.background }]}>
                                    Save Address
                                </Text>
                            </TouchableOpacity>
                        }

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
        borderRadius: 10
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
