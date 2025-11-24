import React, { useRef, useState, useEffect } from "react";
import { View, FlatList, Image, StyleSheet, Dimensions, TouchableOpacity, Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../redux/store";
import { getCoupons, Coupon } from "../../../redux/slices/couponsSlice";
import { useAppNavigation } from "../../../utils/functions";
import { ImageAssets } from "../../../assets/images";

const { width } = Dimensions.get("window");

export default function ImageSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { coupons, loading } = useSelector((state: RootState) => state.coupon);
  const { goToRestaurantDetails } = useAppNavigation();
  
  useEffect(() => {
    // Fetch coupons on mount
    dispatch(getCoupons());
  }, [dispatch]);

  const onScroll = (event: any) => {
    const slide = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(slide);
  };

  const handleCouponPress = (coupon: Coupon) => {
    // Navigate to restaurant details if restaurant exists
    if (coupon.restaurant) {
      goToRestaurantDetails({
        restroDetails: {
          _id: coupon.restaurant.id,
          name: coupon.restaurant.name,
          address: coupon.restaurant.address,
        }
      });
    }
  };

  // Default placeholder image
  const defaultImage = "https://indiater.com/wp-content/uploads/2021/08/free-best-creative-restaurant-banner-for-fast-food-delivery-promotion-banner-1024x1024.jpg";

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading banners...</Text>
        </View>
      </View>
    );
  }

  if (!coupons || coupons.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Slider */}
      <FlatList
        ref={flatListRef}
        data={coupons}
        keyExtractor={(item: Coupon) => item.id || item._id || Math.random().toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        renderItem={({ item }: { item: Coupon }) => (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => handleCouponPress(item)}
            style={styles.imageContainer}
          >
            <Image
              source={{ uri: item.image || defaultImage }}
              style={styles.image}
              defaultSource={ImageAssets.Logo}
            />
            {/* Coupon info overlay */}
            {item.name && (
              <View style={styles.overlay}>
                <Text style={styles.couponName} numberOfLines={1}>
                  {item.name}
                </Text>
                {item.code && (
                  <Text style={styles.couponCode} numberOfLines={1}>
                    Code: {item.code}
                  </Text>
                )}
              </View>
            )}
          </TouchableOpacity>
        )}
      />

      {/* Indicator Dots */}
      {coupons.length > 1 && (
        <View style={styles.indicatorContainer}>
          {coupons.map((_, index: number) => (
            <View
              key={index}
              style={[
                styles.dot,
                activeIndex === index && styles.activeDot,
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    marginVertical: 10,
  },
  imageContainer: {
    position: "relative",
    width: width - 20,
    marginHorizontal: 10,
  },
  image: {
    width: width - 20,
    height: 120,
    resizeMode: "cover",
    borderRadius: 10,
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  couponName: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
  couponCode: {
    color: "#fff",
    fontSize: 12,
  },
  indicatorContainer: {
    flexDirection: "row",
    position: "absolute",
    bottom: 10,
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  dot: {
    height: 6,
    width: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.5)",
    marginHorizontal: 3,
  },
  activeDot: {
    backgroundColor: "#fff",
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
  },
  loadingText: {
    fontSize: 14,
    color: "#666",
  },
});
