import React, { useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    FlatList,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Header from "../../../componets/header";
import { useNavigation } from "@react-navigation/native";
import { useAppNavigation } from "../../../utils/functions";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { fetchOrderDetails, clearOrderDetails, Order } from "../../../redux/slices/orderSlice";
import { useTheme } from "../../../theme/ThemeContext";

interface RouteParams {
    order?: Order;
    orderId?: string;
}

interface OrderDetailsProps {
    route: {
        params: RouteParams;
    };
}

const getStatusStep = (status: string) => {
    const normalizedStatus = status?.toLowerCase() || "";
    switch (normalizedStatus) {
        case "preparing":
        case "pending":
            return 1;
        case "on the way":
        case "out_for_delivery":
        case "out for delivery":
            return 2;
        case "delivered":
            return 3;
        default:
            return 0;
    }
};

const OrderDetailsScreen = ({ route }: OrderDetailsProps) => {
    const { goToOrderTracking } = useAppNavigation();
    const navigation = useNavigation();
    const dispatch = useDispatch<AppDispatch>();
    const { colors } = useTheme();
    const { orderDetails: order, loadingDetails, error } = useSelector((state: RootState) => state.order);
    
    const { order: routeOrder, orderId } = route.params || {};

    useEffect(() => {
        // If order is passed from route, use it; otherwise fetch by orderId
        if (routeOrder && (routeOrder as Order)?._id) {
            // Order already available from route
        } else if (orderId) {
            dispatch(fetchOrderDetails(orderId));
        } else if (routeOrder && (routeOrder as Order)?._id) {
            dispatch(fetchOrderDetails((routeOrder as Order)._id));
        }

        return () => {
            // Clear order details when component unmounts
            dispatch(clearOrderDetails());
        };
    }, [dispatch, orderId, routeOrder?._id]);

    // Use order from Redux or route params
    const orderData = order || routeOrder;

    if (!orderData) {
        if (loadingDetails) {
            return (
                <View style={[styles.container, { backgroundColor: colors.background }]}>
                    <Header title="Order Details" onBack={() => navigation.goBack()} onAdd={() => {}} />
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={colors.primary} />
                        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
                            Loading order details...
                        </Text>
                    </View>
                </View>
            );
        }

        if (error) {
            return (
                <View style={[styles.container, { backgroundColor: colors.background }]}>
                    <Header title="Order Details" onBack={() => navigation.goBack()} onAdd={() => {}} />
                    <View style={styles.errorContainer}>
                        <Text style={[styles.errorText, { color: colors.error }]}>
                            {typeof error === 'string' ? error : (error as any)?.message || "Failed to load order details"}
                        </Text>
                        <TouchableOpacity
                            style={[styles.retryButton, { backgroundColor: colors.primary }]}
                            onPress={() => {
                                if (orderId) dispatch(fetchOrderDetails(orderId));
                                else if (routeOrder && (routeOrder as Order)?._id) dispatch(fetchOrderDetails((routeOrder as Order)._id));
                            }}
                        >
                            <Text style={styles.retryText}>Retry</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        }

        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <Header title="Order Details" onBack={() => navigation.goBack()} onAdd={() => {}} />
                <View style={styles.emptyContainer}>
                    <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                        Order not found
                    </Text>
                </View>
            </View>
        );
    }

    const statusStep = getStatusStep(orderData.status || "pending");
    const restaurantName = orderData.restaurantId?.name || "Restaurant";
    const restaurantAddress = orderData.restaurantId?.address?.fullAddress || "";
    const firstItemImage = orderData.items?.[0]?.productId?.image || "";
    const deliveryAddress = orderData.deliveryAddress?.fullAddress || "";

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
            <Header
                title="Order Details"
                onBack={() => navigation.goBack()}
                onAdd={() => {}}
            />
            
            {/* Order ID */}
            {orderData.orderId && (
                <View style={[styles.orderIdContainer, { backgroundColor: colors.surface }]}>
                    <Text style={[styles.orderIdText, { color: colors.text }]}>
                        Order ID: {orderData.orderId}
                    </Text>
                </View>
            )}

            {/* Restaurant Header */}
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                {firstItemImage ? (
                    <Image source={{ uri: firstItemImage }} style={styles.restImage} />
                ) : (
                    <View style={[styles.restImage, { backgroundColor: colors.border }]} />
                )}
                <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={[styles.restName, { color: colors.text }]}>{restaurantName}</Text>
                    {restaurantAddress ? (
                        <Text style={[styles.restLocation, { color: colors.textSecondary }]}>
                            {restaurantAddress}
                        </Text>
                    ) : null}
                    {orderData.restaurantId?.contactPhone && (
                        <Text style={[styles.restLocation, { color: colors.textSecondary }]}>
                            📞 {orderData.restaurantId.contactPhone}
                        </Text>
                    )}
                </View>
            </View>

            {/* Status Timeline */}
            <View style={styles.timeline}>
                {["Preparing", "On the way", "Delivered"].map((step, index) => {
                    const isCompleted = index + 1 <= statusStep;
                    return (
                        <View key={step} style={styles.timelineStep}>
                            <MaterialIcons
                                name={isCompleted ? "check-circle" : "radio-button-unchecked"}
                                size={28}
                                color={isCompleted ? "#4caf50" : "#ccc"}
                            />
                            <Text
                                style={[
                                    styles.timelineText,
                                    { color: isCompleted ? "#4caf50" : colors.textSecondary },
                                ]}
                            >
                                {step}
                            </Text>
                        </View>
                    );
                })}
            </View>

            {/* Delivery Address */}
            {deliveryAddress && (
                <>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Delivery Address</Text>
                    <View style={[styles.addressBox, { backgroundColor: colors.surface }]}>
                        <MaterialIcons name="location-on" size={20} color={colors.primary} />
                        <Text style={[styles.addressText, { color: colors.text }]}>
                            {deliveryAddress}
                        </Text>
                    </View>
                </>
            )}

            {/* Order Items */}
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Order Items</Text>
            {orderData.items && orderData.items.length > 0 ? (
                orderData.items.map((item) => (
                    <View key={item._id} style={styles.itemRow}>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.itemName, { color: colors.text }]}>
                                {item.quantity}x {item.name || item.productId?.name || "Item"}
                            </Text>
                            {item.productId?.type && (
                                <Text style={[styles.itemType, { 
                                    color: item.productId.type === 'veg' ? '#4CAF50' : '#f44336' 
                                }]}>
                                    {item.productId.type.toUpperCase()}
                                </Text>
                            )}
                        </View>
                        <Text style={[styles.itemPrice, { color: colors.text }]}>
                            ₹{item.subtotal || (item.price * item.quantity)}
                        </Text>
                    </View>
                ))
            ) : (
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                    No items found
                </Text>
            )}

            {/* Bill Summary */}
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Bill Details</Text>
            <View style={styles.itemRow}>
                <Text style={[styles.itemName, { color: colors.textSecondary }]}>Item Total</Text>
                <Text style={[styles.itemPrice, { color: colors.text }]}>
                    ₹{orderData.totalAmount || 0}
                </Text>
            </View>
            {orderData.discountAmount > 0 && (
                <View style={styles.itemRow}>
                    <Text style={[styles.itemName, { color: "#4caf50" }]}>Discount</Text>
                    <Text style={[styles.itemPrice, { color: "#4caf50" }]}>
                        -₹{orderData.discountAmount}
                    </Text>
                </View>
            )}
            {orderData.couponCode && (
                <View style={styles.itemRow}>
                    <Text style={[styles.itemName, { color: colors.textSecondary }]}>
                        Coupon ({orderData.couponCode})
                    </Text>
                </View>
            )}
            <View style={styles.itemRow}>
                <Text style={[styles.itemName, { color: colors.textSecondary }]}>Delivery Fee</Text>
                <Text style={[styles.itemPrice, { color: colors.text }]}>
                    ₹{orderData.deliveryCharge || 0}
                </Text>
            </View>
            <View style={styles.itemRow}>
                <Text style={[styles.itemName, { color: colors.textSecondary }]}>Taxes</Text>
                <Text style={[styles.itemPrice, { color: colors.text }]}>
                    ₹{orderData.taxes || 0}
                </Text>
            </View>
            <View style={[styles.itemRowTotal, { borderTopColor: colors.border }]}>
                <Text style={[styles.totalText, { color: colors.text }]}>Grand Total</Text>
                <Text style={[styles.totalPrice, { color: colors.text }]}>
                    ₹{orderData.grandTotal || orderData.finalAmount || orderData.totalAmount || 0}
                </Text>
            </View>

            {/* Notes */}
            {orderData.notes && (
                <>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Special Instructions</Text>
                    <View style={[styles.notesBox, { backgroundColor: colors.surface }]}>
                        <Text style={[styles.notesText, { color: colors.text }]}>
                            {orderData.notes}
                        </Text>
                    </View>
                </>
            )}

            {/* Track Order Button */}
            {orderData.status !== "delivered" && (
                <TouchableOpacity 
                    style={[styles.trackBtn, { backgroundColor: colors.primary }]} 
                    onPress={() => goToOrderTracking({ order: orderData })}
                >
                    <Text style={styles.trackText}>Track Order</Text>
                </TouchableOpacity>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    orderIdContainer: {
        padding: 12,
        marginHorizontal: 16,
        marginTop: 8,
        borderRadius: 8,
        alignItems: "center",
    },
    orderIdText: {
        fontSize: 14,
        fontWeight: "600",
    },
    header: {
        flexDirection: "row",
        padding: 16,
        borderBottomWidth: 1,
        alignItems: "center",
    },
    restImage: { width: 60, height: 60, borderRadius: 10 },
    restName: { fontSize: 18, fontWeight: "bold" },
    restLocation: { fontSize: 13, marginTop: 2 },

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
    addressBox: {
        flexDirection: "row",
        padding: 12,
        marginHorizontal: 16,
        marginBottom: 8,
        borderRadius: 8,
        alignItems: "flex-start",
    },
    addressText: {
        flex: 1,
        marginLeft: 8,
        fontSize: 14,
    },
    itemRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: 16,
        paddingVertical: 8,
        alignItems: "flex-start",
    },
    itemRowTotal: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: 16,
        paddingVertical: 10,
        borderTopWidth: 1,
        marginTop: 6,
    },
    itemName: { fontSize: 14, flex: 1 },
    itemType: { fontSize: 11, marginTop: 2 },
    itemPrice: { fontSize: 14, fontWeight: "bold" },
    totalText: { fontSize: 16, fontWeight: "bold" },
    totalPrice: { fontSize: 16, fontWeight: "bold" },
    notesBox: {
        padding: 12,
        marginHorizontal: 16,
        marginBottom: 8,
        borderRadius: 8,
    },
    notesText: {
        fontSize: 14,
        fontStyle: "italic",
    },

    trackBtn: {
        margin: 16,
        padding: 14,
        borderRadius: 8,
        alignItems: "center",
    },
    trackText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 14,
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    errorText: {
        fontSize: 14,
        textAlign: "center",
        marginBottom: 16,
    },
    retryButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    retryText: {
        color: "#fff",
        fontWeight: "600",
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    emptyText: {
        fontSize: 16,
    },
});

export default OrderDetailsScreen;
