import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    Modal,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Header from "../../../componets/header";

const nearbyLocations = [
    { id: "1", name: "Piyanshu Jain Boys Hostel", address: "Sheopur Rd, Tirupati Balaji Nagar, Sector 8, Pratap Nagar", distance: "181 m" },
    { id: "2", name: "Prakash Hospital Nicu And Picu", address: "6 Zone, Sector 67, Sheopur Rd, near Gulab Vihar, Jaipur", distance: "277 m" },
    { id: "3", name: "Jai Sharda Senior Secondary School", address: "Sheopur Rd, Sitaram Colony, Pratap Nagar", distance: "334 m" },
    { id: "4", name: "Sawan Girls Pg", address: "Shyopur Rd, Opposite Pinjara Pole, Gaushala", distance: "338 m" },
];

const LocationSearch = ({ visible, onClose }) => {
    const [query, setQuery] = useState("");

    return (
        <Modal
            animationType="slide"
            visible={visible}
            onRequestClose={onClose}
            transparent
        >
            <View style={styles.container}>

                {/* Header */}
               {/* <View style={styles.header}>
        <TouchableOpacity onPress={onClose}>
          <MaterialIcons name="arrow-back" size={24} color="#222" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select a location</Text>
      </View>   */}
                 <Header
                    title="Select a location"
                    onBack={()=>{onClose()}}
                // onAdd={() => console.log("Add clicked!")}
                />  
                <View style={styles.cardBox}>
                    {/* Search Box */}
                    <View style={styles.searchBox}>
                        <MaterialIcons name="search" size={20} color="#888" />
                        <TextInput
                            style={styles.input}
                            placeholder="Search for area, street name..."
                            value={query}
                            onChangeText={setQuery}
                        />
                    </View>

                    {/* Options */}
                    <TouchableOpacity style={styles.option}>
                        <MaterialIcons name="my-location" size={20} color="#f44336" />
                        <View style={{ flex: 1, marginLeft: 8 }}>
                            <Text style={styles.optionTitle}>Use current location</Text>
                            <Text style={styles.optionSubtitle}>
                                Tirupati Balaji Nagar, Sanganer
                            </Text>
                        </View>
                        <MaterialIcons name="chevron-right" size={22} color="#888" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.option}>
                        <MaterialIcons name="add-location-alt" size={20} color="#f44336" />
                        <Text style={styles.optionTitle}>Add Address</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.option}>
                        <MaterialIcons name="import-contacts" size={20} color="#ff9800" />
                        <Text style={styles.optionTitle}>Import addresses from Blinkit</Text>
                    </TouchableOpacity>

                    {/* Nearby Locations */}
                    <Text style={styles.sectionTitle}>Nearby Locations</Text>
                    <FlatList
                        data={nearbyLocations}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={styles.locationCard}>
                                <MaterialIcons name="location-on" size={20} color="#555" />
                                <View style={{ flex: 1, marginLeft: 8 }}>
                                    <Text style={styles.locationName}>{item.name}</Text>
                                    <Text style={styles.locationAddress} numberOfLines={1}>
                                        {item.address}
                                    </Text>
                                </View>
                                <Text style={styles.distance}>{item.distance}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f9f9f9" },

    header: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
    headerTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginLeft: 10,
        color: "#222",
    },
    cardBox: {
        padding: 16
    },
    searchBox: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 8,
        marginBottom: 16,
        elevation: 2,
    },
    input: { flex: 1, marginLeft: 6, fontSize: 14, color: "#333" },
    option: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 12,
        marginBottom: 10,
        elevation: 1,
    },
    optionTitle: { fontSize: 14, fontWeight: "bold", color: "#333" },
    optionSubtitle: { fontSize: 12, color: "#777" },
    sectionTitle: {
        marginTop: 20,
        marginBottom: 10,
        fontSize: 14,
        fontWeight: "bold",
        color: "#444",
        letterSpacing: 1,
    },
    locationCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 12,
        marginBottom: 10,
        elevation: 1,
    },
    locationName: { fontSize: 14, fontWeight: "600", color: "#222" },
    locationAddress: { fontSize: 12, color: "#777", marginTop: 2 },
    distance: { fontSize: 12, color: "#f44336", fontWeight: "bold" },
});

export default LocationSearch;
