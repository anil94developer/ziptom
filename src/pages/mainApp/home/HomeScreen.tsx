import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, FlatList, Image, Dimensions, ImageBackground, Switch, Platform, PermissionsAndroid, ActivityIndicator, RefreshControl } from 'react-native';
import place from './../../../enums/place.json';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import { useTheme } from '../../../theme/ThemeContext';
import { ImageAssets } from '../../../assets/images';
import LinearGradient from 'react-native-linear-gradient';
import { foodItems } from '../../../enums/foods';
import { styles } from './styles';
// import { category } from '../../../enums/category';
import FilterModal from './FilterModal';
import FoodCard from './FoodCard';
import ImageSlider from './ImageSlider';
import RecommendedSection from './RecommendedSection';
import { useAppNavigation } from '../../../utils/functions';
import LocationSearch from '../locationSearch/LocationSearch';
import { useCart } from '../../../context/cartProvider';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart, addToCart, updateQuantity, addCart } from '../../../redux/slices/cartSlice';
import { fetchCategories, fetchNineNineProducts, fetchRestaurants, fetchProducts, setVegType, setSelectedCategoryId } from '../../../redux/slices/homeSlice';
import { getCurrentLocation } from '../../../utils/permissionHelper';
import Geolocation from "react-native-geolocation-service"; 
import { getCoupons } from '../../../redux/slices/couponsSlice';
import { AppDispatch, RootState } from '../../../redux/store';
import { showToast } from '../../../redux/slices/toastSlice';
import { profile } from '../../../redux/slices/authSlice';

import { getAddressFromCoordinates, calculateDistance, formatDistance } from '../../../utils/helper';
const { width } = Dimensions.get('window');

const CARD_WIDTH = 150;
const HomeScreen = (props: any) => {
    const dispatch = useDispatch<AppDispatch>();
    const cartItems = useSelector((state: RootState) => state.cart.items);
    const { products, categories, restaurants, vegType, loading: homeLoading, error: homeError, selectedCategoryId } = useSelector((state: any) => state.home);
    const { loading, error, otpSent, userDetails } = useSelector((state: any) => state.auth);


    const { colors } = useTheme()
    const { goToRestaurantDetails, goToProfile, goToSearchProduct, goToCartScreen } = useAppNavigation();
    const [selectedCity, setSelectedCity] = React.useState('Alwar');
    const selectedCityData = place.find(item => item.city === selectedCity);
    const [filterVisible, setFilterVisible] = React.useState(false);
    const [searchVisible, setSearchVisible] = React.useState(false)
    const [refreshing, setRefreshing] = useState(false);
    const isInitialMount = React.useRef(true);
    const [currentAddress, setCurrentAddress] = React.useState<string>('Loading location...');
    const [currentLocation, setCurrentLocation] = React.useState<{ latitude: number; longitude: number } | null>(null);

    // helper to get current quantity for product
    const getQuantity = (id: string) => {
        const item = cartItems.find((i) => i.id === id);
        return item ? item.quantity : 0;
    };
    useEffect(() => {
        const getHomeData = async () => {
            // Fetch location and address
            const location = await getCurrentLocation() as { latitude: number; longitude: number } | null;
            if (location && 'latitude' in location && 'longitude' in location) {
                setCurrentLocation({ latitude: location.latitude, longitude: location.longitude });
                const address = await getAddressFromCoordinates(location.latitude, location.longitude);
                if (address) {
                    setCurrentAddress(address);
                } else {
                    setCurrentAddress('Location not available');
                }
            } else {
                setCurrentAddress('Location permission denied');
                setCurrentLocation(null);
            }

            // Fetch home data
            dispatch(fetchNineNineProducts());
            dispatch(fetchCategories());
            dispatch(fetchRestaurants());
        }
        getHomeData();
    }, []);

    // Fetch user profile if not available
    useEffect(() => {
        if (!userDetails || !userDetails.name) {
            dispatch(profile(undefined));
        }
    }, [dispatch, userDetails]);

    // Refetch data when vegType changes (skip initial mount)
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
        if (vegType !== undefined) {
            dispatch(fetchNineNineProducts());
            dispatch(fetchCategories());
            dispatch(fetchRestaurants());
        }
    }, [vegType, dispatch]);

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        try {
            // Refresh location and address
            const location = await getCurrentLocation() as { latitude: number; longitude: number } | null;
            if (location && 'latitude' in location && 'longitude' in location) {
                setCurrentLocation({ latitude: location.latitude, longitude: location.longitude });
                const address = await getAddressFromCoordinates(location.latitude, location.longitude);
                if (address) {
                    setCurrentAddress(address);
                }
            }

            await Promise.all([
                dispatch(fetchNineNineProducts()),
                dispatch(fetchCategories()),
                dispatch(fetchRestaurants()),
                dispatch(getCoupons()),
            ]);
        } catch (error) {
            console.log('Home refresh failed', error);
        } finally {
            setRefreshing(false);
        }
    }, [dispatch]);

    // Sections for FlatList
    const sections = [
        { key: "header" },
        { key: "99store" },
        { key: "category" },
        { key: "filters" },
        { key: "restaurants" },
        { key: "slider" },
        { key: "recommended" },
    ];

    const renderItem = ({ item }: { item: { key: string } }) => {
        switch (item.key) {

            case "header":
                return (<ImageBackground
                    source={ImageAssets.loginBanner}
                    style={styles.imageBackground}
                    imageStyle={[{ resizeMode: 'cover', width: '100%', borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }]}
                >
                    {/* Linear Gradient Overlay */}
                    <LinearGradient
                        colors={['rgba(18, 18, 18, 0.65)', 'rgba(0, 0, 0, 0)']}
                        style={styles.gradientOverlay}
                    />

                    {/* Header Section */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => {
                            // goToLocationSearch()
                            setSearchVisible(true)
                        }}>
                            <Text style={[styles.guestText, { color: colors.background }]}>Hello, {userDetails?.name || 'Guest'}</Text>
                            <Text style={[styles.locationText, { color: colors.primary }]} numberOfLines={1}>
                                {currentAddress} ▼
                            </Text>
                        </TouchableOpacity>
                        <View style={styles.iconRow}>
                            <TouchableOpacity onPress={() => { goToCartScreen() }} style={[styles.iconCircle, { backgroundColor: colors.surface }]}>
                                <MaterialIcons name="shopping-cart" size={24} color={colors.primary} />
                                <Text style={{ position: 'absolute', top: -4, right: -4, backgroundColor: 'red', color: '#fff', fontSize: 10, paddingHorizontal: 4, borderRadius: 8 }}>{cartItems.length}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { goToProfile() }} style={[styles.iconCircle, { backgroundColor: colors.surface }]}>
                                <MaterialIcons name="person" size={24} color={colors.primary} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Search & Weather Row */}
                    <View style={styles.searchRow}>
                        <TouchableOpacity
                            onPress={() => { goToSearchProduct() }}
                            style={[styles.searchBox, { backgroundColor: colors.surface }]}>
                            <Text
                                style={[styles.searchInput, { color: colors.text }]}
                            // placeholder="Search something..."
                            // placeholderTextColor="#888"
                            >Search something...</Text>
                            <TouchableOpacity>
                                <MaterialIcons name="search" size={20} color={colors.primary} />
                            </TouchableOpacity>
                        </TouchableOpacity>

                        <View style={[styles.weatherBox, { backgroundColor: colors.surface, alignItems: 'center', paddingHorizontal: 15 }]}>
                            <Text style={[styles.weatherText, { color: colors.text, fontSize: 8 }]}>
                                {vegType ? 'VEG' : 'NON-VEG'}
                            </Text>

                            <Switch
                                value={vegType}
                                onValueChange={(val) => {
                                    dispatch(setVegType(val));
                                }}
                                trackColor={{ false: '#767577', true: '#81b0ff' }}
                                thumbColor={vegType ? '#4CAF50' : '#f44336'}
                            />
                        </View>
                    </View>
                </ImageBackground>)
            case "99store":
                return (
                    <View>
                        <View style={styles.ninenineoffer}>
                            {/* Header */}
                            <View style={{ padding: 8 }}>
                                <View style={styles.headerRow}>
                                    <Text style={styles.title}>
                                        <Text style={{ color: '#FFD700' }}>99</Text> store
                                    </Text>
                                    <TouchableOpacity>
                                        <Text style={styles.seeAll}>See All</Text>
                                    </TouchableOpacity>
                                </View>
                                <Text style={styles.subText}>✔ Meals at ₹99 + Free Delivery</Text>
                            </View>
                            {/* Horizontal List */}
                            <FlatList
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                data={products}
                                keyExtractor={(item) => item.id}
                                contentContainerStyle={{ paddingVertical: 10 }}
                                renderItem={({ item }) => {
                                    const quantity = getQuantity(item.id);

                                    return (
                                        <TouchableOpacity
                                            onPress={() => {
                                                let restroDetails = {
                                                    _id: item?.restaurant?.id
                                                }
                                                console.log(restroDetails)
                                                goToRestaurantDetails({ restroDetails: restroDetails })
                                            }}
                                            style={styles.cardItem}
                                        >
                                            <Image source={{ uri: item.image }} style={styles.image} />

                                            {/* ✅ Conditional UI */}
                                            {quantity === 0 ? (
                                                <TouchableOpacity
                                                    style={styles.quantityContainer}
                                                    onPress={async () => {
                                                        dispatch(
                                                            addToCart({
                                                                id: item.id,
                                                                title: item.name,
                                                                price: item.price,
                                                                quantity: 1,
                                                                image: item.image
                                                            })
                                                        )
                                                        dispatch(showToast({ message: "Item added to cart", type: "success" }));
                                                        // await dispatch(addCart({
                                                        //     "productId": item.id,
                                                        //     "quantity": 1
                                                        // })).unwrap();

                                                    }
                                                    }
                                                >
                                                    <MaterialIcons name="add" size={18} color="#00C853" />
                                                </TouchableOpacity>
                                            ) : (
                                                <View style={styles.quantityContainer}>
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            if (quantity > 1) {
                                                                dispatch(
                                                                    updateQuantity({ id: item.id, quantity: quantity - 1 })
                                                                );
                                                            } else {
                                                                dispatch(removeFromCart({ id: item.id }));
                                                            }
                                                        }}
                                                    >
                                                        <MaterialIcons name="remove" size={18} color="#00C853" />
                                                    </TouchableOpacity>

                                                    <Text style={styles.quantityText}>{quantity}</Text>

                                                    <TouchableOpacity
                                                        onPress={() =>
                                                            dispatch(
                                                                updateQuantity({ id: item.id, quantity: quantity + 1 })
                                                            )
                                                        }
                                                    >
                                                        <MaterialIcons name="add" size={18} color="#00C853" />
                                                    </TouchableOpacity>
                                                </View>
                                            )}

                                            <View style={{ padding: 8 }}>
                                                <Text style={styles.itemTitle} numberOfLines={1}>
                                                    {item.name}
                                                </Text>

                                                <View style={styles.priceRow}>
                                                    <Text style={styles.discounted}>₹{item.price}</Text>
                                                    <Text style={styles.original}>₹{item.originalPrice}</Text>
                                                </View>

                                                <View style={styles.ratingRow}>
                                                    <Text style={styles.ratingText}>⭐ 3 (2.2k)</Text>
                                                </View>

                                                <Text style={styles.restaurantName} numberOfLines={1}>
                                                    {item.category.name}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    );
                                }}
                            />
                        </View>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionHeaderText}>TOP RESTAURANTS TO EXPLORE</Text>
                        </View>
                    </View>
                )
            case "category":
                return (
                    <View >

                        <FlatList
                            style={{ backgroundColor: colors.surface, paddingTop: 30 }}
                            horizontal
                            data={[{ _id: 'all', name: 'All', image: '' }, ...categories]}
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={item => item._id || item.id || item.title || 'all'}
                            contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 8 }}
                            renderItem={({ item }) => {
                                const isAll = item._id === 'all';
                                const isSelected = isAll ? !selectedCategoryId : selectedCategoryId === item._id;
                                return (
                                    <TouchableOpacity
                                        onPress={() => {
                                            if (isAll) {
                                                // Clear category filter
                                                dispatch(setSelectedCategoryId(null));
                                                // Fetch all products
                                                dispatch(fetchProducts({
                                                    page: 1,
                                                    limit: 20,
                                                }));
                                            } else {
                                                // Set category filter
                                                dispatch(setSelectedCategoryId(item._id));
                                                // Fetch products filtered by category
                                                dispatch(fetchProducts({
                                                    page: 1,
                                                    limit: 20,
                                                    categoryId: item._id,
                                                }));
                                            }
                                        }}
                                        style={[
                                            styles.catContainer,
                                            isSelected && { backgroundColor: colors.primary, opacity: 0.8 }
                                        ]}>
                                        {!isAll && <Image source={{ uri: item.image }} style={styles.catImg} />}
                                        <Text style={[
                                            { color: colors.text, fontSize: 12 },
                                            isSelected && { color: '#fff', fontWeight: 'bold' }
                                        ]}>
                                            {item.name}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            }}
                        />
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}
                            style={{ paddingVertical: 10, paddingHorizontal: 10, backgroundColor: colors.surface, padding: 10 }}
                        >
                            <TouchableOpacity style={styles.cityButton} onPress={() => setFilterVisible(true)}>
                                <Octicons name="filter" size={18} color={colors.text} />
                                <Text style={{ color: colors.text }}>Filter </Text>
                                <MaterialIcons name="arrow-drop-down" size={24} color={colors.text} />
                            </TouchableOpacity>
                            {/* <TouchableOpacity style={styles.cityButton}>
                                <Text style={{ color: colors.text }}>Popular</Text>
                            </TouchableOpacity> */}
                            <TouchableOpacity style={styles.cityButton}>
                                <Text style={{ color: colors.text }}>Newly Added</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.cityButton}>
                                <Text style={{ color: colors.text }}>Rating 4.0+</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.cityButton}>
                                <Text style={{ color: colors.text }}>Cost: Low to High</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.cityButton}>
                                <Text style={{ color: colors.text }}>Cost: High to Low</Text>
                            </TouchableOpacity>

                        </ScrollView>
                    </View>
                )
            // case "filters":
            //     return (

            //     )
            case "restaurants":
                // Use filtered products if a category is selected, otherwise show all restaurants
                const displayRestaurants = selectedCategoryId && products.length > 0 
                    ? products.map((product: any) => ({
                        ...product,
                        restaurant: product.restaurant || product,
                    }))
                    : restaurants || [];
                
                return (<FlatList
                    data={displayRestaurants}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={item => item.id.toString()}
                    style={{ backgroundColor: colors.surface, padding: 10, paddingBottom: 10 }}
                    contentContainerStyle={{ paddingHorizontal: 10, }}
                    renderItem={({ item }) => {
                        // Calculate distance from current location to restaurant
                        let distanceText = "";
                        if (currentLocation && item?.restaurant?.latitude && item?.restaurant?.longitude) {
                            const distance = calculateDistance(
                                currentLocation.latitude,
                                currentLocation.longitude,
                                item.restaurant.latitude,
                                item.restaurant.longitude
                            );
                            distanceText = formatDistance(distance);
                        } else if (currentLocation && item?.latitude && item?.longitude) {
                            // Fallback: check if latitude/longitude are directly on item
                            const distance = calculateDistance(
                                currentLocation.latitude,
                                currentLocation.longitude,
                                item.latitude,
                                item.longitude
                            );
                            distanceText = formatDistance(distance);
                        }

                        return (
                            <FoodCard
                                image={item?.image}
                                discount="66% off upto ₹126"
                                time="20-25 MINS"
                                name={item.name}
                                rating={item?.restaurant?.rating?.average || item?.rating?.average || 5}
                                reviews={item?.restaurant?.rating?.count || item?.rating?.count || 5}
                                location={item?.restaurant?.address?.fullAddress || item?.address?.fullAddress || ""}
                                distance={distanceText || "N/A"}
                                cuisines={item?.restaurant?.name || item?.name}
                                features={item?.type}
                                item={item}
                            />
                        );
                    }}
                />)
            case "slider":
                return (<ImageSlider />)
            case "recommended":
                return (<RecommendedSection currentLocation={currentLocation} />)
            default:
                return null;
        }
    };

    // Show loader on initial load when no data is available
    const showInitialLoader = homeLoading && !products.length && !categories.length && !restaurants.length;

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {showInitialLoader ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={[styles.loadingText, { color: colors.text }]}>Loading delicious food...</Text>
                    {homeError && (
                        <View style={styles.errorContainer}>
                            <MaterialIcons name="error-outline" size={24} color={colors.error || '#f44336'} />
                            <Text style={[styles.errorText, { color: colors.error || '#f44336' }]}>{homeError}</Text>
                            <TouchableOpacity 
                                style={[styles.retryButton, { backgroundColor: colors.primary }]}
                                onPress={() => {
                                    dispatch(fetchNineNineProducts());
                                    dispatch(fetchCategories());
                                    dispatch(fetchRestaurants());
                                }}
                            >
                                <Text style={[styles.retryButtonText, { color: colors.background }]}>Retry</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            ) : (
                <FlatList
                    data={sections}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.key}
                    stickyHeaderIndices={[2]} // 👈 category section will stick
                    showsVerticalScrollIndicator={false}
                    refreshing={refreshing || homeLoading}
                    onRefresh={onRefresh}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing || homeLoading}
                            onRefresh={onRefresh}
                            colors={[colors.primary]}
                            tintColor={colors.primary}
                        />
                    }
                />
            )}
            {/* Header */}

            <ScrollView showsVerticalScrollIndicator={false}>



                {/* category Selector */}



                {/* filter */}



                {/* Places */}





            </ScrollView>

            <FilterModal
                visible={filterVisible}
                onClose={() => setFilterVisible(false)}
                onApply={(selectedSort: string) => {
                    console.log("Selected sort:", selectedSort);
                    setFilterVisible(false);
                }}
            />

            <LocationSearch
                visible={searchVisible}
                onClose={() => setSearchVisible(false)}
                onSelectLocation={(location) => {
                    setCurrentAddress(location.address);
                    setCurrentLocation({ latitude: location.latitude, longitude: location.longitude });
                    setSearchVisible(false);
                    // Optionally refresh data based on new location
                    // dispatch(fetchRestaurants());
                }}
            />

        </View>
    );
};



export default HomeScreen;