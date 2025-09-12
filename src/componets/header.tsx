import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
  // or react-native-vector-icons
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
const Header = ({ title, onBack, onAdd }) => {
  return (
    <View style={styles.header}>
      {/* Back Button */}
      <TouchableOpacity onPress={onBack} style={styles.leftBtn}>
        <MaterialIcons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>

      {/* Right Side Add Button */}
      <TouchableOpacity onPress={onAdd} style={styles.addBtn}>
        <Text style={styles.addText}>ADD</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",  
    paddingVertical:10
  },
  leftBtn: { padding: 5 },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
    textAlign: "center",
  },
  addBtn: {
    backgroundColor: "#f44336",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
  },
  addText: { color: "#fff", fontWeight: "bold" },
});

export default Header;
