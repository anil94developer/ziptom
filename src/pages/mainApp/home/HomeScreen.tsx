import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, FlatList, Image, Dimensions, ImageBackground, Switch } from 'react-native';
import place from './../../../enums/place.json';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import { useTheme } from '../../../theme/ThemeContext';
import { ImageAssets } from '../../../assets/images';
import LinearGradient from 'react-native-linear-gradient';
import { foodItems } from '../../../enums/foods';
import { styles } from './styles';
import { category } from '../../../enums/category';
import FilterModal from './FilterModal';
import FoodCard from './FoodCard';
import ImageSlider from './ImageSlider';
import RecommendedSection from './RecommendedSection';
import { useAppNavigation } from '../../../utils/functions';
import LocationSearch from '../locationSearch/LocationSearch';
const { width } = Dimensions.get('window');

const CARD_WIDTH = 150;
const HomeScreen = (props) => {
    const { colors } = useTheme()
    const { goToRestaurantDetails, goToProfile, goToSearchProduct } = useAppNavigation();
    const [selectedCity, setSelectedCity] = React.useState('Alwar');
    const selectedCityData = place.find(item => item.city === selectedCity);
    const [filterVisible, setFilterVisible] = React.useState(false);
    const [searchVisible, setSearchVisible] = React.useState(false)
    const [isVeg, setIsVeg] = useState(true);

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

    const renderItem = ({ item }) => {
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
                            <Text style={[styles.guestText, { color: colors.background }]}>Hello, Guest</Text>
                            <Text style={[styles.locationText, { color: colors.primary }]}>
                                {selectedCity} ▼
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={()=>{goToProfile()}} style={[styles.iconCircle, { backgroundColor: colors.surface }]}>
                            <MaterialIcons name="person" size={24} color={colors.primary} />
                        </TouchableOpacity>
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
                                {isVeg ? 'VEG' : 'NON-VEG'}
                            </Text>

                            <Switch
                                value={isVeg}
                                onValueChange={(val) => setIsVeg(val)}
                                trackColor={{ false: '#767577', true: '#81b0ff' }}
                                thumbColor={isVeg ? '#4CAF50' : '#f44336'}
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
                                data={foodItems}
                                keyExtractor={(item) => item.id}
                                contentContainerStyle={{ paddingVertical: 10 }}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        onPress={() => { goToRestaurantDetails() }}
                                        style={styles.cardItem}>
                                        <Image source={{ uri: item.image }} style={styles.image} />

                                        {/* Add Button */}
                                        <TouchableOpacity style={styles.addButton}>
                                            <MaterialIcons name="add" size={18} color="#00C853" />
                                        </TouchableOpacity>
                                        <View style={{ padding: 8 }}>
                                            <Text style={styles.itemTitle} numberOfLines={1}>{item.title}</Text>

                                            <View style={styles.priceRow}>
                                                <Text style={styles.discounted}>₹{item.price}</Text>
                                                <Text style={styles.original}>₹{item.originalPrice}</Text>
                                            </View>

                                            <View style={styles.ratingRow}>
                                                <Text style={styles.ratingText}>⭐ {item.rating} ({item.ratingCount})</Text>
                                            </View>

                                            <Text style={styles.restaurantName} numberOfLines={1}>
                                                {item.restaurant}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                )}
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
                            data={category}
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={item => item.title}
                            contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 8 }}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    onPress={() => setSelectedCity(item.title)}
                                    style={styles.catContainer}>

                                    <Image source={{ uri: item.image }} style={styles.catImg} />
                                    <Text style={[
                                        { color: colors.text, fontSize: 12 },
                                    ]}>
                                        {item.title}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        />
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}
                            style={{ paddingVertical: 10, paddingHorizontal: 10, backgroundColor: colors.surface, padding: 10 }}
                        >
                            <TouchableOpacity style={styles.cityButton} onPress={() => setFilterVisible(true)}>
                                <Octicons name="filter" size={18} color={colors.text} />
                                <Text style={{ color: colors.text }}>Filter </Text>
                                <MaterialIcons name="arrow-drop-down" size={24} color={colors.text} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.cityButton}>
                                <Text style={{ color: colors.text }}>Popular</Text>
                            </TouchableOpacity>
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
                return (<FlatList
                    data={foodItems || []}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={item => item.id.toString()}
                    style={{ backgroundColor: colors.surface, padding: 10, paddingBottom: 10 }}
                    contentContainerStyle={{ paddingHorizontal: 10, }}
                    renderItem={({ item }) => (
                        <FoodCard
                            image="https://www.eatingwell.com/thmb/m5xUzIOmhWSoXZnY-oZcO9SdArQ=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/article_291139_the-top-10-healthiest-foods-for-kids_-02-4b745e57928c4786a61b47d8ba920058.jpg"
                            discount="66% off upto ₹126"
                            time="20-25 MINS"
                            name="Faasos - Wraps, Rolls & Shawarma"
                            rating={4.3}
                            reviews={477}
                            location="Pratap Nagar"
                            distance="1.5 km"
                            cuisines="Kebabs, Fast Food"
                            price={200}
                        />

                    )}
                />)
            case "slider":
                return (<ImageSlider />)
            case "recommended":
                return (<RecommendedSection />)
            default:
                return null;
        }
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={sections}
                renderItem={renderItem}
                keyExtractor={(item) => item.key}
                stickyHeaderIndices={[2]} // 👈 category section will stick
                showsVerticalScrollIndicator={false}
            />
            {/* Header */}

            <ScrollView showsVerticalScrollIndicator={false}>



                {/* category Selector */}



                {/* filter */}



                {/* Places */}





            </ScrollView>

            <FilterModal
                visible={filterVisible}
                onClose={() => setFilterVisible(false)}
                onApply={(selectedSort) => {
                    console.log("Selected sort:", selectedSort);
                    setFilterVisible(false);
                }}
            />

            <LocationSearch
                visible={searchVisible}
                onClose={() => setSearchVisible(false)} 
            />

        </View>
    );
};



export default HomeScreen;