// src/components/CustomToast.js
import React, { useEffect } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { hideToast } from "../redux/slices/toastSlice";

export default function CustomToast() {
  const dispatch = useDispatch();
  const { message, type, visible } = useSelector((state) => state.toast);
  const opacity = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => {
          Animated.timing(opacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }).start(() => dispatch(hideToast()));
        }, 3000);
      });
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: type === "error" ? "#ff4d4d" : "#4caf50", opacity },
      ]}
    >
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 50,
    alignSelf: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    zIndex: 1000,
  },
  text: {
    color: "#fff",
    fontWeight: "bold",
  },
});
