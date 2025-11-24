import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAppNavigation } from "../../../utils/functions";

interface FoodCardProps {
    image: any;
    discount: any;
    time: any;
    name: any;
    rating: any;
    reviews: any;
    location: any;
    distance: any;
    cuisines: any;
    features: any;
    item: any;
    category?: string | null;
}

export default function FoodCard({
    image,
    discount,
    time,
    name,
    rating,
    reviews,
    location,
    distance,
    cuisines,
    features,
    item,
    category
}: FoodCardProps) {
    const {goToRestaurantDetails} = useAppNavigation();
    return (
        <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={()=>{goToRestaurantDetails({restroDetails:item, category: category})}}>
            {/* Image + overlay badges */}
            <View style={styles.imageWrapper}>
                <Image source={{ uri: image }} style={styles.image} />

                {/* Discount badge */}
                {discount && (
                    <View style={styles.discountBadge}>
                        <Text style={styles.discountText}>{discount}</Text>
                    </View>
                )}

                {/* Delivery time */}
                <View style={styles.timeBadge}>
                    <Text style={styles.timeText}>{time}</Text>
                </View>
            </View>

            {/* Info section */}
            <View style={styles.info}>
                {/* Restaurant name */}
                <Text style={styles.title} numberOfLines={1}>{name}</Text>

                {/* Rating + location */}
                <View style={styles.row}>
                    <Ionicons name="star" size={24} color={'green'} />

                    <Text style={styles.subText}>
                        {rating} ({reviews}) • {location}, {distance}
                    </Text>
                </View>

                {/* Cuisine + price */}
                <Text style={styles.subText} numberOfLines={1}>
                    {cuisines} 
                </Text>
                <Text style={styles.subText} numberOfLines={1}>
                      {features}
                </Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        borderRadius: 12,
        marginBottom: 16,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
    imageWrapper: {
        position: "relative",
    },
    image: {
        width: "100%",
        height: 160,
    },
    discountBadge: {
        position: "absolute",
        bottom: 10,
        left: 10,
        backgroundColor: "rgba(0,0,0,0.7)",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    discountText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "bold",
    },
    timeBadge: {
        position: "absolute",
        bottom: 10,
        right: 10,
        backgroundColor: "#fff",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    timeText: {
        fontSize: 12,
        fontWeight: "bold",
        color: "#333",
    },
    info: {
        padding: 12,
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 4,
        color: "#333",
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 4,
    },
    subText: {
        fontSize: 13,
        color: "#555",
        marginLeft: 4,
    },
});
