import React, { useRef } from "react";
import { View, Animated, PanResponder, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";

const DraggableCartView = ({ onPress }) => {
  const pan = useRef(new Animated.ValueXY()).current;
  const items = useSelector((state) => state.cart.items);

  // 🧮 Calculate total items and total price
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: () => {},
    })
  ).current;

  return (
    <Animated.View
      style={[
        styles.draggable,
        { transform: [{ translateX: pan.x }, { translateY: pan.y }] },
      ]}
      {...panResponder.panHandlers}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        style={styles.innerBox}
      >
        <View style={styles.cartContainer}>
          <Text style={styles.cartIcon}>🛒</Text>
          {totalItems > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{totalItems}</Text>
            </View>
          )}
        </View>

        <Text style={styles.totalPrice}>₹{totalPrice}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  draggable: {
    position: "absolute",
    bottom: 100,
    right: 30,
    zIndex: 999,
  },
  innerBox: {
    width: 70,
    height: 70,
    backgroundColor: "#007AFF",
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
  },
  cartContainer: {
    // position: "relative",
  },
  cartIcon: {
    fontSize: 30,
  },
  badge: {
    position: "absolute",
    top: -8,
    right: -12,
    backgroundColor: "red",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  totalPrice: {
    marginTop: 4,
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
});

export default DraggableCartView;
