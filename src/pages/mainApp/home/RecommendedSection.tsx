import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import { fetchRestaurants, Restaurant } from "../../../redux/slices/restaurantSlice";
import { useAppNavigation } from "../../../utils/functions";
import { calculateDistance, formatDistance } from "../../../utils/helper";

const DATA = [
  {
    id: "1",
    name: "Khandelwal Dhaba",
    img: "https://picsum.photos/200/150?random=1",
    discount: "FLAT 50% OFF",
    rating: "3.6",
    time: "15–20 mins",
  },
  {
    id: "2",
    name: "Punjabi Tadka",
    img: "https://picsum.photos/200/150?random=2",
    discount: "60% OFF",
    rating: "3.8",
    time: "30–35 mins",
  },
  {
    id: "3",
    name: "Dosaka - Tasty",
    img: "https://picsum.photos/200/150?random=3",
    discount: "50% OFF up to ₹100",
    rating: "4.2",
    time: "15–20 mins",
  },
  {
    id: "4",
    name: "Meals On Move",
    img: "https://picsum.photos/200/150?random=4",
    discount: "40% OFF up to ₹80",
    rating: "4.0",
    time: "25–30 mins",
  },
  {
    id: "5",
    name: "Khatu Dham Dhaba",
    img: "https://picsum.photos/200/150?random=5",
    discount: "FLAT 50% OFF",
    rating: "3.9",
    time: "25–30 mins",
  },
  {
    id: "6",
    name: "Hinaya Kitchen",
    img: "https://picsum.photos/200/150?random=6",
    discount: "60% OFF",
    rating: "3.9",
    time: "30–35 mins",
  },
];

// helper: group data into chunks of 2
const chunkArray = <T,>(arr: T[], size: number): T[][] => {
  return arr.reduce((acc: T[][], _, i: number) => {
    if (i % size === 0) acc.push(arr.slice(i, i + size));
    return acc;
  }, []);
};

interface RecommendedSectionProps {
  currentLocation?: { latitude: number; longitude: number } | null;
}

export default function RecommendedSection({ currentLocation }: RecommendedSectionProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { restaurants, loading } = useSelector((state: any) => state.restaurant);
  const { goToRestaurantDetails } = useAppNavigation();
  const [recommendedRestaurants, setRecommendedRestaurants] = useState<Restaurant[]>([]);

  // Fetch recommended restaurants with location
  useEffect(() => {
    const fetchRecommended = async () => {
      if (currentLocation) {
        const result = await dispatch(fetchRestaurants({
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          raduis: 10, // 10km radius as per user requirement
        }));
        if (fetchRestaurants.fulfilled.match(result)) {
          const restaurantsData = result.payload?.data || result.payload || [];
          // Take first 6 restaurants for recommended section
          setRecommendedRestaurants(restaurantsData.slice(0, 6));
        }
      } else {
        // Fetch all restaurants if no location
        const result = await dispatch(fetchRestaurants());
        if (fetchRestaurants.fulfilled.match(result)) {
          const restaurantsData = result.payload?.data || result.payload || [];
          setRecommendedRestaurants(restaurantsData.slice(0, 6));
        }
      }
    };
    fetchRecommended();
  }, [dispatch, currentLocation]);

  const groupedData = chunkArray(recommendedRestaurants, 2);

  const renderCard = (item: Restaurant | any) => {
    const restaurantId = item._id || item.id;
    const imageUrl = item.images?.[0]?.url || item.image || 'https://via.placeholder.com/200/150';
    const rating = item.rating?.average || item.rating || 0;
    
    // Calculate distance from current location to restaurant
    let distanceText = "";
    if (currentLocation && item.latitude && item.longitude) {
      const distance = calculateDistance(
        currentLocation.latitude,
        currentLocation.longitude,
        item.latitude,
        item.longitude
      );
      distanceText = formatDistance(distance);
    }
    
    return (
      <TouchableOpacity 
        key={restaurantId} 
        style={styles.card}
        onPress={() => {
          goToRestaurantDetails({restroDetails:item});
        }}
      >
        <Image source={{ uri: imageUrl }} style={styles.image} />

        {/* Distance Badge */}
        {distanceText && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{distanceText}</Text>
          </View>
        )}  

        {/* Name */}
        <Text style={styles.name} numberOfLines={1}>
          {item.name || 'Restaurant'}
        </Text>

        {/* Row: rating + cuisine type */}
        <View style={styles.row}>
          {/* <Text style={styles.rating}>⭐ {rating.toFixed(1)}</Text> */}
          {item.cuisineType && item.cuisineType.length > 0 && (
            <>
              <MaterialIcons name="restaurant" size={14} color="#555" style={{ marginLeft: 8 }} />
              <Text style={styles.time} numberOfLines={1}>
                {item.cuisineType[0]}
              </Text>
            </>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderColumn = ({ item }: { item: Restaurant[] }) => (
    <View style={styles.column}>
      {item.map((food: Restaurant) => renderCard(food))}
    </View>
  );

  if (loading && recommendedRestaurants.length === 0) {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>RECOMMENDED FOR YOU</Text>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#f44336" />
        </View>
      </View>
    );
  }

  if (recommendedRestaurants.length === 0) {
    return null;
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>RECOMMENDED FOR YOU</Text>

      <FlatList
        data={groupedData}
        horizontal
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderColumn}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginVertical: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
    paddingLeft: 15,
  },
  column: {
    flexDirection: "column",
    marginRight: 12,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    width: 160,
    marginBottom: 12,
    marginLeft: 15,
    elevation: 2,
    paddingBottom: 10,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 100,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  discountBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountText: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "bold",
  },
  name: {
    fontSize: 13,
    fontWeight: "bold",
    marginTop: 8,
    paddingHorizontal: 8,
    color: "#333",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    paddingHorizontal: 8,
  },
  rating: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#3c763d",
  },
  time: {
    fontSize: 12,
    marginLeft: 4,
    color: "#555",
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
