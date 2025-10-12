import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
    ScrollView,
    Modal,
} from "react-native";
import Header from "../../../componets/header";
import { useNavigation } from "@react-navigation/native";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { useTheme } from "../../../theme/ThemeContext";
import { foodItems } from "../../../enums/foods";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllRestraurantProducts } from "./../../../redux/slices/restaurantSlice"
import { removeFromCart, addToCart, updateQuantity } from '../../../redux/slices/cartSlice';

const RestaurantDetails = ({ route }) => {
    const { restroDetails } = route.params;
    console.log("item details", restroDetails)

    const dispatch = useDispatch();
    const cartItems = useSelector((state: RootState) => state.cart.items);
    const { restaurantProducts } = useSelector((state: any) => state.restaurant);
    const { loading, error, otpSent, userDetails } = useSelector((state: any) => state.auth);



    const { colors } = useTheme();
    const navigation = useNavigation();
    const [cart, setCart] = useState({});
    const [menuVisible, setMenuVisible] = useState(false);
    const [productVisible, setProductVisible] = useState(false);

    useEffect(() => {
        const getData = async () => {
            dispatch(fetchAllRestraurantProducts(restroDetails._id));
        }
        getData()
    }, [dispatch,restroDetails._id])



    // helper to get current quantity for product
    const getQuantity = (id) => {
        const item = cartItems.find((i) => i.id === id);
        return item ? item.quantity : 0;
    };

    const renderItem = ({ item }) => {

        const quantity = getQuantity(item._id);

        return (
            <View style={styles.card}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.foodName}>{item.name}</Text>
                    <Text style={styles.foodPrice}>₹{item.price}</Text>
                    <Text style={styles.foodDesc} numberOfLines={2}>
                        {item.restaurantId.name}
                    </Text>
                    <Text style={styles.foodDesc} numberOfLines={2}>
                        {2}
                    </Text>
                </View>
                <View style={{ alignItems: "center" }}>
                    <Image source={{ uri: item.image }} style={styles.foodImage} />

                    {quantity === 0 ? (
                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={() =>
                                dispatch(
                                    addToCart({
                                        id: item._id,
                                        name: item.name,
                                        price: item.price,
                                        quantity: 1,
                                        image:item.image

                                    })
                                )
                            }
                        >
                            <Text style={styles.addText}>ADD +</Text>
                        </TouchableOpacity>
                    ) : (
                        <View style={styles.qtyContainer}>
                            <TouchableOpacity
                                style={styles.qtyBtn}
                                onPress={() => dispatch(
                                    updateQuantity({ id: item._id, quantity: quantity + 1 })
                                )}
                            >
                                <Text style={styles.qtyText}>-</Text>
                            </TouchableOpacity>
                            <Text style={styles.qtyCount}>{quantity}</Text>
                            <TouchableOpacity
                                style={styles.qtyBtn}
                                onPress={() =>
                                    dispatch(
                                        addToCart({
                                            id: item._id,
                                            name: item.name,
                                            price: item.price,
                                            quantity: 1,
                                            image:item.image

                                        })
                                    )
                                }
                            >
                                <Text style={styles.qtyText}>+</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>
        );
    };

    // const cartItems = Object.keys(cart).map((id) => {
    //     const item = foodItems.find((f) => f.id === id);
    //     return { ...item, qty: cart[id] };
    // });

    return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
            <Header
                title={restroDetails?.name}
                onBack={() => navigation.goBack()}
                // onAdd={() => console.log("Add clicked!")}
            />
            <ScrollView style={styles.container}>
                {/* Header */}


                {/* Restaurant Info */}
                <View style={styles.header}>
                    <Text style={styles.restaurantName}>{restroDetails?.name}</Text>
                    <View style={styles.ratingBox}>
                        <Text style={styles.ratingText}>{restroDetails?.rating?.average} ★</Text>
                    </View>
                </View>
                <Text style={styles.subText}>2.1 km • 20-25 mins • {restroDetails?.location?.address}</Text>
                <Text style={styles.subText}>Frequently Reordered ✅</Text>
                <Text style={styles.offer}>🚴 Free Delivery above ₹149</Text>

                {/* Recommended */}
                <Text style={styles.sectionTitle}>Recommended for you</Text>
                <FlatList
                    data={restaurantProducts}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                />
            </ScrollView>

            {/* Floating Menu Button */}

            <TouchableOpacity
                style={styles.menuButton}
                onPress={() => setMenuVisible(true)}
            >
                <MaterialIcons name="menu-book" size={30} color={colors.primary} />

            </TouchableOpacity>


            {/* Cart Modal */}
            <Modal visible={menuVisible} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalBox}>
                        <Text style={styles.modalTitle}>Menu</Text>

                        <FlatList
                            data={restaurantProducts}
                            keyExtractor={(item) => item.id}
                            numColumns={2}
                            columnWrapperStyle={{ justifyContent: "space-between" }}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item }) => {
                                const qty = cart[item.id] || 0;
                                return (
                                    <TouchableOpacity
                                        onPress={() => setProductVisible(true)}
                                        style={styles.modalCard}>
                                        <Image source={{ uri: item.image }} style={styles.modalImage} />
                                        <Text style={styles.modalFoodName} numberOfLines={1}>
                                            {item.name}
                                        </Text>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>

                                            <Text style={styles.modalFoodPrice}>₹{item.price}</Text>
                                            <Text style={styles.modalFoodPrice}>{item.type}</Text>

                                            {/* {qty === 0 ? (
                                                <TouchableOpacity
                                                    style={styles.addButton}
                                                    onPress={() => addToCart(item)}
                                                >
                                                    <Text style={styles.addText}>ADD +</Text>
                                                </TouchableOpacity>
                                            ) : (
                                                <View style={styles.qtyContainer}>
                                                    <TouchableOpacity
                                                        style={styles.qtyBtn}
                                                        onPress={() => removeFromCart(item)}
                                                    >
                                                        <Text style={styles.qtyText}>-</Text>
                                                    </TouchableOpacity>
                                                    <Text style={styles.qtyCount}>{qty}</Text>
                                                    <TouchableOpacity
                                                        style={styles.qtyBtn}
                                                        onPress={() => addToCart(item)}
                                                    >
                                                        <Text style={styles.qtyText}>+</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            )} */}
                                        </View>
                                    </TouchableOpacity>
                                )
                            }}
                        />

                        <TouchableOpacity
                            style={styles.closeBtn}
                            onPress={() => setMenuVisible(false)}
                        >
                            <Text style={styles.closeText}>Close Menu</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Product Modal */}
            <Modal visible={productVisible} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalBox}>
                        {/* Header */}
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Product Details</Text>
                            <TouchableOpacity
                                style={styles.closeBtn}
                                onPress={() => setProductVisible(false)}
                            >
                                <Text style={styles.closeText}>X</Text>
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            {/* Product Image */}
                            <Image
                                source={{ uri: foodItems[0].image }}
                                style={styles.detailImage}
                            />

                            {/* Product Info */}
                            <Text style={styles.detailName}>{foodItems[0].name}</Text>
                            <Text style={styles.detailPrice}>₹{foodItems[0].price}</Text>
                            <Text style={styles.detailDesc}>
                                {foodItems[0].desc ||
                                    "This is a delicious dish prepared with fresh ingredients. Perfect for your cravings!"}
                            </Text>

                            {/* Rating */}
                            <View style={styles.ratingRow}>
                                <Text style={styles.ratingStar}>⭐</Text>
                                <Text style={styles.ratingValue}>4.3 (120 reviews)</Text>
                            </View>

                            {/* Add to Cart Controls */}
                            <View style={styles.cartRow}>
                                {0 === 0 ? (
                                    <TouchableOpacity
                                        style={styles.addButton}
                                        onPress={() => addToCart(foodItems[0])}
                                    >
                                        <Text style={styles.addText}>ADD +</Text>
                                    </TouchableOpacity>
                                ) : (
                                    <View style={styles.qtyContainer}>
                                        <TouchableOpacity
                                            style={styles.qtyBtn}
                                            onPress={() => removeFromCart(foodItems[0])}
                                        >
                                            <Text style={styles.qtyText}>-</Text>
                                        </TouchableOpacity>
                                        <Text style={styles.qtyCount}>{1}</Text>
                                        <TouchableOpacity
                                            style={styles.qtyBtn}
                                            onPress={() => addToCart(foodItems[0])}
                                        >
                                            <Text style={styles.qtyText}>+</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>


        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff", padding: 12 },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    restaurantName: { fontSize: 20, fontWeight: "bold", color: "#222" },
    ratingBox: {
        backgroundColor: "#2e7d32",
        borderRadius: 5,
        padding: 4,
    },
    ratingText: { color: "#fff", fontWeight: "bold" },
    subText: { color: "#555", marginTop: 2 },
    offer: { marginTop: 5, color: "red", fontWeight: "600" },
    sectionTitle: { fontSize: 18, fontWeight: "bold", marginVertical: 10 },
    card: {
        flexDirection: "row",
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 10,
        marginBottom: 12,
        elevation: 2,
    },
    foodName: { fontSize: 16, fontWeight: "bold" },
    foodPrice: { color: "green", fontWeight: "600" },
    foodDesc: { fontSize: 12, color: "#777", marginTop: 2 },
    foodImage: { width: 100, height: 100, borderRadius: 8, marginVertical: 5 },
    addButton: {
        backgroundColor: "#f44336",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 5,
        marginTop: 5,
    },
    addText: { color: "#fff", fontWeight: "bold" },

    qtyContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 5,
        backgroundColor: "#f44336",
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    qtyBtn: { padding: 6 },
    qtyText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
    qtyCount: { color: "#fff", fontWeight: "bold", fontSize: 16, marginHorizontal: 6 },

    menuButton: {
        position: "absolute",
        bottom: 50,
        right: 20,
        alignSelf: "flex-end",
        backgroundColor: "#000",
        paddingHorizontal: 10,
        paddingVertical: 20,
        borderRadius: 30,
    },
    menuButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },

    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "flex-end",
    },
    modalBox: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 16,
        maxHeight: "75%",
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 12,
        color: "#333",
    },
    modalCard: {
        backgroundColor: "#fafafa",
        borderRadius: 15,
        padding: 10,
        marginBottom: 12,
        alignItems: "center",
        flex: 1,
        marginHorizontal: 5,
        elevation: 2, // shadow for Android
        shadowColor: "#000", // iOS shadow
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    modalImage: {
        width: 100,
        height: 100,
        borderRadius: 10,
        marginBottom: 8,
    },
    modalFoodName: {
        fontSize: 14,
        fontWeight: "600",
        color: "#222",
        textAlign: "center",
    },
    modalFoodPrice: {
        fontSize: 13,
        color: "green",
        marginTop: 4,
        fontWeight: "500",
    },
    closeBtn: {
        backgroundColor: "#f44336",
        padding: 12,
        borderRadius: 10,
        marginTop: 10,
        alignItems: "center",
    },
    closeText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },



    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    detailImage: {
        width: "100%",
        height: 200,
        borderRadius: 12,
        marginBottom: 12,
    },
    detailName: { fontSize: 20, fontWeight: "bold", color: "#222" },
    detailPrice: {
        fontSize: 18,
        color: "green",
        fontWeight: "600",
        marginVertical: 6,
    },
    detailDesc: { fontSize: 14, color: "#666", lineHeight: 20 },

    ratingRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
    ratingStar: { fontSize: 18, color: "#FFD700" },
    ratingValue: { marginLeft: 4, fontSize: 14, color: "#333" },

    cartRow: {
        marginTop: 15,
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
    },

});

export default RestaurantDetails;
