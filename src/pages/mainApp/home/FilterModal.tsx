import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';

const FILTER_CATEGORIES = [
  "Sort", "99store", "Free Delivery", "Food in 10 mins",
  "Offers", "Ratings", "Cost for two", "Veg/Non-Veg"
];

const SORT_OPTIONS = [
  "Relevance (Default)", "Delivery Time", "Rating",
  "Cost: Low to High", "Cost: High to Low"
];

const NINENINE_OPTIONS = ["99 Store"];
const FREE_DELIVERY_OPTIONS = ["Only show restaurants with free delivery"];
const FOOD_IN_10_MINS_OPTIONS = ["Instant delivery (under 10 mins)"];
const OFFERS_OPTIONS = ["Restaurants with offers"];
const RATINGS_OPTIONS = ["4.5+", "4.0+", "3.5+"];
const COST_FOR_TWO_OPTIONS = ["Less than ₹200", "₹200–₹500", "₹500–₹1000", "₹1000+"];
const VEG_NON_VEG_OPTIONS = ["Veg Only", "Non-Veg Included"];

export default function FilterModal({ visible, onClose, onApply }) {
  const { colors } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState("Sort");

  // States for each filter
  const [selectedSort, setSelectedSort] = useState("Relevance (Default)");
  const [nineNine, setNineNine] = useState(false);
  const [freeDelivery, setFreeDelivery] = useState(false);
  const [foodIn10, setFoodIn10] = useState(false);
  const [offers, setOffers] = useState(false);
  const [ratings, setRatings] = useState(null);
  const [costForTwo, setCostForTwo] = useState(null);
  const [vegNonVeg, setVegNonVeg] = useState(null);

  // Clear all filters
  const clearFilters = () => {
    setSelectedSort("Relevance (Default)");
    setNineNine(false);
    setFreeDelivery(false);
    setFoodIn10(false);
    setOffers(false);
    setRatings(null);
    setCostForTwo(null);
    setVegNonVeg(null);
  };

  // Apply filters
  const handleApply = () => {
    const filters = {
      sort: selectedSort,
      nineNine,
      freeDelivery,
      foodIn10,
      offers,
      ratings,
      costForTwo,
      vegNonVeg,
    };
    onApply(filters);
  };

  // Helper UI
  const Checkbox = ({ label, value, onChange }) => (
    <TouchableOpacity style={styles.optionRow} onPress={onChange}>
      <View style={[styles.checkboxOuter, value && styles.radioOuterSelected]}>
        {value && <View style={styles.radioInner} />}
      </View>
      <Text style={styles.optionText}>{label}</Text>
    </TouchableOpacity>
  );

  const Radio = ({ label, selected, onSelect }) => (
    <TouchableOpacity style={styles.optionRow} onPress={onSelect}>
      <View style={[styles.radioOuter, selected && styles.radioOuterSelected]}>
        {selected && <View style={styles.radioInner} />}
      </View>
      <Text style={styles.optionText}>{label}</Text>
    </TouchableOpacity>
  );

  const renderContent = () => {
    switch (selectedCategory) {
      case "Sort":
        return (
          <>
            <Text style={styles.sectionTitle}>Sort By</Text>
            {SORT_OPTIONS.map((option, idx) => (
              <Radio
                key={idx}
                label={option}
                selected={selectedSort === option}
                onSelect={() => setSelectedSort(option)}
              />
            ))}
          </>
        );
      case "99store":
        return (
          <>
            <Text style={styles.sectionTitle}>99 Store</Text>
            <Checkbox
              label="Show only 99 Store"
              value={nineNine}
              onChange={() => setNineNine(!nineNine)}
            />
          </>
        );
      case "Free Delivery":
        return (
          <>
            <Text style={styles.sectionTitle}>Free Delivery</Text>
            <Checkbox
              label="Only show restaurants with free delivery"
              value={freeDelivery}
              onChange={() => setFreeDelivery(!freeDelivery)}
            />
          </>
        );
      case "Food in 10 mins":
        return (
          <>
            <Text style={styles.sectionTitle}>Instant Delivery</Text>
            <Checkbox
              label="Food in under 10 mins"
              value={foodIn10}
              onChange={() => setFoodIn10(!foodIn10)}
            />
          </>
        );
      case "Offers":
        return (
          <>
            <Text style={styles.sectionTitle}>Offers</Text>
            <Checkbox
              label="Restaurants with offers"
              value={offers}
              onChange={() => setOffers(!offers)}
            />
          </>
        );
      case "Ratings":
        return (
          <>
            <Text style={styles.sectionTitle}>Ratings</Text>
            {RATINGS_OPTIONS.map((option, idx) => (
              <Radio
                key={idx}
                label={option}
                selected={ratings === option}
                onSelect={() => setRatings(option)}
              />
            ))}
          </>
        );
      case "Cost for two":
        return (
          <>
            <Text style={styles.sectionTitle}>Cost for Two</Text>
            {COST_FOR_TWO_OPTIONS.map((option, idx) => (
              <Radio
                key={idx}
                label={option}
                selected={costForTwo === option}
                onSelect={() => setCostForTwo(option)}
              />
            ))}
          </>
        );
      case "Veg/Non-Veg":
        return (
          <>
            <Text style={styles.sectionTitle}>Veg/Non-Veg</Text>
            {VEG_NON_VEG_OPTIONS.map((option, idx) => (
              <Radio
                key={idx}
                label={option}
                selected={vegNonVeg === option}
                onSelect={() => setVegNonVeg(option)}
              />
            ))}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
      transparent
    >
      <View style={styles.modalContainer}>
        <View style={[styles.sheet, { backgroundColor: colors.background }]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Filters</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Sidebar + Content */}
          <View style={styles.contentWrapper}>
            <View style={styles.sidebar}>
              {FILTER_CATEGORIES.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.sidebarItem,
                    selectedCategory === item && { backgroundColor: "#fff" }
                  ]}
                  onPress={() => setSelectedCategory(item)}
                >
                  <Text
                    style={[
                      styles.sidebarText,
                      selectedCategory === item && { color: "#f55c2a" }
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <ScrollView style={styles.contentBox}>{renderContent()}</ScrollView>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.clearBtn} onPress={clearFilters}>
              <Text style={styles.clearText}>Clear</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyBtn} onPress={handleApply}>
              <Text style={styles.applyText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  sheet: {
    height: "80%",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  closeBtn: {
    position: "absolute",
    right: 15,
    padding: 5,
  },
  closeText: {
    fontSize: 20,
    color: "#333",
  },
  contentWrapper: {
    flex: 1,
    flexDirection: "row",
  },
  sidebar: {
    width: "35%",
    backgroundColor: "#f6f6f6",
    paddingVertical: 15,
  },
  sidebarItem: {
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  sidebarText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  contentBox: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 15,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  radioOuter: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#ccc",
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  radioOuterSelected: {
    borderColor: "#f55c2a",
  },
  radioInner: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: "#f55c2a",
  },
  checkboxOuter: {
    height: 20,
    width: 20,
    borderRadius: 3,
    borderWidth: 2,
    borderColor: "#ccc",
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  optionText: {
    fontSize: 14,
    color: "#333",
  },
  footer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 15,
    borderTopWidth: 1,
    borderColor: "#ddd",
    justifyContent: "space-between",
  },
  clearBtn: {
    backgroundColor: "#f6f6f6",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  clearText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  applyBtn: {
    backgroundColor: "#f55c2a",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  applyText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});
