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
import { fetchAllRestraurantProducts, ProductItem } from "./../../../redux/slices/restaurantSlice"
import { removeFromCart, addToCart, updateQuantity, addCart } from '../../../redux/slices/cartSlice';
import { AppDispatch, RootState } from '../../../redux/store';
import { Item } from "react-native-paper/lib/typescript/components/Drawer/Drawer";
import { showToast } from "../../../redux/slices/toastSlice";

interface RouteParams {
    restroDetails?: any;
}

interface RestaurantDetailsProps {
    route: {
        params: RouteParams;
    };
}

const RestaurantDetails = ({ route }: RestaurantDetailsProps) => {
    const { restroDetails } = route.params;
    // console.log("item details", restroDetails)

    const dispatch = useDispatch<AppDispatch>();
    const cartItems = useSelector((state: RootState) => state.cart.items);
    const { restaurantProducts, restaurantDetails, loading: restaurantLoading, error: restaurantError } = useSelector((state: any) => state.restaurant);
    const { loading, error, otpSent, userDetails } = useSelector((state: any) => state.auth);
    
    // Use restaurant details from Redux if available, otherwise fallback to route params
    const restaurant = restaurantDetails || restroDetails;

    // Debug logs
    // useEffect(() => { 
    // }, [restaurantDetails, restaurantProducts, restaurantLoading, restaurantError]);



    const { colors } = useTheme();
    const navigation = useNavigation();
    const [cart, setCart] = useState<Record<string, number>>({});
    const [menuVisible, setMenuVisible] = useState(false);
    const [productVisible, setProductVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<ProductItem | {}>({});

    useEffect(() => {
        const getData = async () => {
            const restaurantId = restroDetails?.restaurant?._id || restroDetails?.restaurant?.id || restroDetails?._id ;
            
            // alert(restaurantId)
            if (restaurantId && typeof restaurantId === 'string') {
                dispatch(fetchAllRestraurantProducts(restaurantId));
            }
        }
        getData()
    }, [dispatch, restroDetails?.restaurant?._id, restroDetails?.restaurant?.id])



    // helper to get current quantity for product
    const getQuantity = (id: string) => {
        const item = cartItems.find((i) => i.id === id);
        return item ? item.quantity : 0;
    };

    const renderItem = (item: ProductItem) => {
        const itemId = (item._id || item.id) as string;
        if (!itemId) return null;
        const quantity = getQuantity(itemId);

        return (
            <View key={itemId} style={styles.card}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.foodName}>{item.name || 'Unknown Item'}</Text>
                    <Text style={styles.foodPrice}>₹{item.price || 0}</Text>
                    {item.category && (
                        <Text style={styles.foodDesc} numberOfLines={2}>
                            {item.category.name}
                        </Text>
                    )}
                    {item.type && (
                        <Text style={[styles.foodDesc, { color: item.type === 'veg' ? '#4CAF50' : '#f44336' }]} numberOfLines={2}>
                            {item.type.toUpperCase()}
                        </Text>
                    )}
                </View>
                <View style={{ alignItems: "center" }}>
                    {item.image && (
                        <Image source={{ uri: item.image }} style={styles.foodImage} />
                    )}

                    {quantity === 0 ? (
                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={async () => {
                                dispatch(
                                    addToCart({
                                        id: itemId,
                                        title: item.name,
                                        price: item.price,
                                        quantity: 1,
                                        image: item.image

                                    })
                                )
                                dispatch(showToast({ message: "Item added to cart", type: "success" }));
                                // if (itemId) {
                                //     await dispatch(addCart({
                                //         "productId": itemId,
                                //         "quantity": 1
                                //     })).unwrap();
                                // }
                            }
                            }
                        >
                            <Text style={styles.addText}>ADD +</Text>
                        </TouchableOpacity>
                    ) : (
                        <View style={styles.qtyContainer}>
                            <TouchableOpacity
                                style={styles.qtyBtn}
                                onPress={() => {
                                    if (quantity > 1) {
                                        dispatch(updateQuantity({ id: itemId, quantity: quantity - 1 }));
                                    } else {
                                        dispatch(removeFromCart({ id: itemId }));
                                    }
                                }}
                            >
                                <Text style={styles.qtyText}>-</Text>
                            </TouchableOpacity>
                            <Text style={styles.qtyCount}>{quantity}</Text>
                            <TouchableOpacity
                                style={styles.qtyBtn}
                                onPress={() =>
                                    dispatch(updateQuantity({ id: itemId, quantity: quantity + 1 }))
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
                title={restaurant?.name || restroDetails?.name || 'Restaurant'}
                onBack={() => navigation.goBack()}
                onAdd={() => {}}
            />
            <ScrollView style={styles.container}>
                {/* Header */}


                {/* Restaurant Info */}
                <View style={styles.header}>
                    <Text style={styles.restaurantName}>{restaurant?.name || restroDetails?.name}</Text>
                    <View style={styles.ratingBox}>
                        <Text style={styles.ratingText}>{restaurant?.rating?.average || restroDetails?.rating?.average || 0} ★</Text>
                    </View>
                </View>
                {restaurant?.address?.fullAddress && (
                    <Text style={styles.subText}>{restaurant.address.fullAddress}</Text>
                )}
                {restaurant?.rating?.count && (
                    <Text style={styles.subText}>{restaurant.rating.count} reviews • {restaurant.cuisineType?.join(', ')}</Text>
                )}
                {restaurant?.features && restaurant.features.length > 0 && (
                    <Text style={styles.subText}>Features: {restaurant.features.join(', ')}</Text>
                )}
                <Text style={styles.offer}>🚴 Free Delivery above ₹149</Text>

                {/* Recommended */}
                <Text style={styles.sectionTitle}>Recommended for you</Text>
                {restaurantLoading ? (
                    <View style={{ padding: 20, alignItems: 'center' }}>
                        <Text style={styles.subText}>Loading...</Text>
                    </View>
                ) : restaurantError ? (
                    <View style={{ padding: 20, alignItems: 'center' }}>
                        <Text style={[styles.subText, { color: 'red' }]}>Error: {restaurantError}</Text>
                    </View>
                ) : restaurantProducts && restaurantProducts.length > 0 ? (
                    restaurantProducts.map((item: ProductItem, index: number) => {
                        return renderItem(item);
                    })
                ) : (
                    <View style={{ padding: 20, alignItems: 'center' }}>
                        <Text style={styles.subText}>No items available</Text>
                    </View>
                )}
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
                            keyExtractor={(item) => item._id || item.id || Math.random().toString()}
                            numColumns={2}
                            columnWrapperStyle={{ justifyContent: "space-between" }}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item }: { item: ProductItem }) => {
                                const itemId = (item._id || item.id) as string;
                                if (!itemId) return null;
                                const qty = cart[itemId] || 0;
                                return (
                                    <TouchableOpacity
                                        onPress={() => {
                                            setProductVisible(true)

                                            setSelectedProduct(item);
                                        }}
                                        style={styles.modalCard}>
                                        <Image source={{ uri: item.image }} style={styles.modalImage} />
                                        <Text style={styles.modalFoodName} numberOfLines={1}>
                                            {item.name}
                                        </Text>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>

                                            <Text style={styles.modalFoodPrice}>₹{item.price}</Text>
                                            <Text style={[styles.modalFoodPrice, { color: item.type === 'veg' ? '#4CAF50' : '#f44336' }]}>{item.type?.toUpperCase()}</Text>

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
                                source={{ uri: (selectedProduct as ProductItem).image || '' }}
                                style={styles.detailImage}
                            />

                            {/* Product Info */}
                            <Text style={styles.detailName}>{(selectedProduct as ProductItem).name || ''}</Text>
                            <Text style={styles.detailPrice}>₹{(selectedProduct as ProductItem).price || 0}</Text>
                            <Text style={styles.detailDesc}>
                                {(selectedProduct as ProductItem).description || ''} </Text>

                            {/* Rating */}
                            <View style={styles.ratingRow}>
                                <Text style={styles.ratingStar}>⭐</Text>
                                <Text style={styles.ratingValue}>4.3 (120 reviews)</Text>
                            </View>

                            {/* Add to Cart Controls */}
                            <View style={styles.cartRow}>
                                {(() => {
                                    const product = selectedProduct as ProductItem;
                                    const productId = (product._id || product.id) as string;
                                    if (!productId) return null;
                                    const productQuantity = getQuantity(productId);
                                    return productQuantity === 0 ? (
                                        <TouchableOpacity
                                            style={styles.addButton}
                                            onPress={async () => {
                                                dispatch(
                                                    addToCart({
                                                        id: productId,
                                                        title: product.name,
                                                        price: product.price,
                                                        quantity: 1,
                                                        image: product.image
                                                    })
                                                )
                                                dispatch(showToast({ message: "Item added to cart", type: "success" }));
                                                // await dispatch(addCart({
                                                //     "productId": productId,
                                                //     "quantity": 1
                                                // })).unwrap();
                                            }
                                            
                                        }
                                        >
                                    <Text style={styles.addText}>ADD +</Text>
                                        </TouchableOpacity>
                            ) : (
                            <View style={styles.qtyContainer}>
                                <TouchableOpacity
                                    style={styles.qtyBtn}
                                    onPress={() => {
                                        if (productQuantity > 1) {
                                            dispatch(updateQuantity({ id: productId, quantity: productQuantity - 1 }));
                                        } else {
                                            dispatch(removeFromCart({ id: productId }));
                                        }
                                    }}
                                >
                                    <Text style={styles.qtyText}>-</Text>
                                </TouchableOpacity>
                                <Text style={styles.qtyCount}>{productQuantity}</Text>
                                <TouchableOpacity
                                    style={styles.qtyBtn}
                                    onPress={() => dispatch(updateQuantity({ id: productId, quantity: productQuantity + 1 }))}
                                >
                                    <Text style={styles.qtyText}>+</Text>
                                </TouchableOpacity>
                            </View>
                            );
                                })()}
                    </View>
                </ScrollView>
        </View>
                </View >
            </Modal >


        </View >
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
