import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useTheme } from "../theme/ThemeContext";

const Header = ({ title, onBack, onAdd }) => {
    const {colors}=useTheme();
  return (
    <View style={[styles.header,{backgroundColor:colors.surface}]}>
      {/* Back Button */}
      <TouchableOpacity onPress={onBack} style={styles.iconBtn}>
        <MaterialIcons name="arrow-back" size={22} color="#fff" />
      </TouchableOpacity>

      {/* Title */}
      <Text style={[styles.title,{color:colors.text}]} numberOfLines={1}>
        {title}
      </Text>

      {/* Add Button */}
      {onAdd &&
      <TouchableOpacity onPress={onAdd} style={styles.iconBtn}>
        <MaterialIcons name="add" size={22} color="#fff" />
      </TouchableOpacity>
}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOpacity: 0.1, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4 },
      android: { elevation: 4 },
    }),
    marginTop: 8,
    gap:10
  },
  iconBtn: {
    backgroundColor: "#f44336",
    borderRadius: 50,
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
    // textAlign: "",
  },
});

export default Header;
