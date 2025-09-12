import React, { useRef, useState } from "react";
import { View, FlatList, Image, StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const images = [
  "https://indiater.com/wp-content/uploads/2021/08/free-best-creative-restaurant-banner-for-fast-food-delivery-promotion-banner-1024x1024.jpg",
  "https://indiater.com/wp-content/uploads/2021/08/free-best-creative-restaurant-banner-for-fast-food-delivery-promotion-banner-1024x1024.jpg",
  "https://indiater.com/wp-content/uploads/2021/08/free-best-creative-restaurant-banner-for-fast-food-delivery-promotion-banner-1024x1024.jpg",
  "https://indiater.com/wp-content/uploads/2021/08/free-best-creative-restaurant-banner-for-fast-food-delivery-promotion-banner-1024x1024.jpg",
  "https://indiater.com/wp-content/uploads/2021/08/free-best-creative-restaurant-banner-for-fast-food-delivery-promotion-banner-1024x1024.jpg",

];

export default function ImageSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);

  const onScroll = (event) => {
    const slide = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(slide);
  };

  return (
    <View style={styles.container}>
      {/* Slider */}
      <FlatList
        ref={flatListRef}
        data={images}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={styles.image} />
        )}
      />

      {/* Indicator Dots */}
      <View style={styles.indicatorContainer}>
        {images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              activeIndex === index && styles.activeDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  image: {
    width:width-20,
    height: 120,
    resizeMode: "cover",
    borderRadius: 10,
    margin:10
  },
  indicatorContainer: {
    flexDirection: "row",
    position: "absolute",
    bottom: 10,
    alignSelf: "center",
  },
  dot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.5)",
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#fff",
    width: 10,
    height: 10,
  },
});
