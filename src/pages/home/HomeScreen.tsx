import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, FlatList, Image, Dimensions } from 'react-native';
import place from './../../enums/place.json';

const { width } = Dimensions.get('window');

const HomeScreen = (props) => {
    const [selectedCity, setSelectedCity] = React.useState('Alwar');
    const selectedCityData = place.find(item => item.city === selectedCity);

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.guestText}>Hello, Guest</Text>
                    <Text style={styles.locationText}>{selectedCity} ▼</Text>
                </View>
                <View style={styles.headerIcons}>
                    <TouchableOpacity style={styles.iconCircle} />
                </View>
            </View>

            {/* Search & Weather */}
            <View style={styles.searchRow}>
                <View style={styles.searchBox}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search Something..."
                        placeholderTextColor="#888"
                    />
                    <TouchableOpacity />
                </View>
                <View style={styles.weatherBox}>
                    <Text style={styles.weatherText}>°C</Text>
                    <Text style={styles.weatherDesc}>Cloudy</Text>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* City Selector */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionHeaderText}>EXPLORE</Text>
                </View>
                <FlatList
                    horizontal
                    data={place}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={item => item.city}
                    contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 8 }}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => setSelectedCity(item.city)}
                            style={[
                                styles.cityButton,
                                selectedCity === item.city && styles.cityButtonActive
                            ]}
                        >
                            {/* Optionally add city image here */}
                            <Text style={[
                                styles.cityButtonText,
                                selectedCity === item.city && styles.cityButtonTextActive
                            ]}>
                                {item.city}
                            </Text>
                        </TouchableOpacity>
                    )}
                />

                {/* Places */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionHeaderText}>PLACES TO VISIT</Text>
                </View>
                <FlatList
                    horizontal
                    data={selectedCityData?.places || []}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={{ paddingHorizontal: 10 }}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => props.navigation.navigate('CityDetails', { city: selectedCity })}
                            style={styles.card}>
                            <Image source={{ uri: item.image }} style={styles.cardImage} />
                            <Text style={styles.cardText}>{item.name}</Text>
                        </TouchableOpacity>
                    )}
                />

                {/* Ask Rana Card */}
                <View style={styles.askRanaCard}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.askRanaTitle}>Don’t know what to explore today?</Text>
                        <Text style={styles.askRanaSubtitle}>Ask yumpee your AI visit Assistant.</Text>
                        <TouchableOpacity style={styles.askRanaButton}>
                            <Text style={styles.askRanaButtonText}>Ask yumpee</Text>
                        </TouchableOpacity>
                    </View>
                    <Image
                        source={require('../../assets/images/logo.png')}
                        style={styles.ranaImage}
                    />
                </View>

                {/* Hotels */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionHeaderText}>HOTELS</Text>
                </View>
                <FlatList
                    horizontal
                    data={selectedCityData?.hotels || []}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 20 }}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => props.navigation.navigate('CityDetails', { city: selectedCity })}
                            style={styles.card}>
                            <Image source={{ uri: item.image }} style={styles.cardImage} />
                            <Text style={styles.cardText}>{item.name}</Text>
                        </TouchableOpacity>
                    )}
                />
            </ScrollView>

            {/* Bottom Navigation */}
            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.navItem}
                onPress={() => {props.navigation.navigate('Home')}}
                >
                    <Image source={require('../../assets/images/logo.png')} style={styles.navRanaIcon} />

                    <Text style={styles.navTextActive}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem}
                onPress={() => {props.navigation.navigate('Explore')}}
                
                >
                    <Image source={require('../../assets/images/logo.png')} style={styles.navRanaIcon} />

                    <Text style={styles.navText}>Explore</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem}
                onPress={() => {props.navigation.navigate('Search')}}
                
                >
                    <Image source={require('../../assets/images/logo.png')} style={styles.navRanaIcon} />
                    <Text style={styles.navText}>Search</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity style={styles.navItem}>
                    <Image source={require('../../assets/images/logo.png')} style={styles.navRanaIcon} />

                    <Text style={styles.navText}>News</Text>
                </TouchableOpacity> */}
                {/* <TouchableOpacity style={styles.navItem}
                onPress={() => {props.navigation.navigate('Account')}}
                
                >
                    <Image source={require('../../assets/images/logo.png')} style={styles.navRanaIcon} />

                    <Text style={styles.navText}>Account</Text>
                </TouchableOpacity> */}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#18191d', paddingTop: 40 },
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 16, marginBottom: 10,
    },
    guestText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
    locationText: { color: '#ff554e', fontSize: 13 },
    headerIcons: { flexDirection: 'row', alignItems: 'center' },
    iconCircle: {
        width: 36, height: 36, borderRadius: 18, backgroundColor: '#23242a',
        justifyContent: 'center', alignItems: 'center', marginRight: 10,
    },
    searchRow: {
        flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, marginBottom: 10,
    },
    searchBox: {
        flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#23242a',
        borderRadius: 12, paddingHorizontal: 10, height: 44,
    },
    searchInput: { flex: 1, color: '#fff', marginLeft: 8 },
    weatherBox: {
        flexDirection: 'row', alignItems: 'center', marginLeft: 10,
        backgroundColor: '#23242a', borderRadius: 12, padding: 8,
    },
    weatherText: { color: '#fff', marginLeft: 4, fontWeight: 'bold' },
    weatherDesc: { color: '#fff', marginLeft: 8 },
    sectionHeader: { paddingHorizontal: 16, marginTop: 18, marginBottom: 8 },
    sectionHeaderText: { color: '#888', fontWeight: 'bold', fontSize: 16 },
    cityButton: {
        backgroundColor: '#23242a', borderRadius: 20, paddingHorizontal: 18, paddingVertical: 8, marginHorizontal: 6,
    },
    cityButtonActive: {
        backgroundColor: '#ff554e',
    },
    cityButtonText: { color: '#fff', fontSize: 14 },
    cityButtonTextActive: { color: '#fff', fontWeight: 'bold' },
    card: {
        width: width * 0.32, marginRight: 14, backgroundColor: '#23242a', borderRadius: 14,
        alignItems: 'center', padding: 10, elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4,
    },
    cardImage: { width: 70, height: 70, borderRadius: 12, marginBottom: 8, backgroundColor: '#fff' },
    cardText: { color: '#fff', fontSize: 13, textAlign: 'center' },
    askRanaCard: {
        flexDirection: 'row', backgroundColor: '#fff', borderRadius: 16,
        padding: 16, margin: 16, alignItems: 'center', elevation: 2,
    },
    askRanaTitle: { color: '#b98a2a', fontWeight: 'bold', fontSize: 18 },
    askRanaSubtitle: { color: '#222', marginTop: 4, marginBottom: 12 },
    askRanaButton: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: '#18191d',
        borderRadius: 8, paddingHorizontal: 16, paddingVertical: 8, marginTop: 8,
    },
    askRanaButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    ranaImage: { borderRadius: 360, width: 80, height: 80, resizeMode: 'contain', marginLeft: 10 },
    bottomNav: {
        flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',
        backgroundColor: '#23242a', height: 64, borderTopLeftRadius: 20, borderTopRightRadius: 20,
    },
    navItem: { alignItems: 'center', justifyContent: 'center' },
    navText: { color: '#fff', fontSize: 12, marginTop: 2 },
    navTextActive: { color: '#ff554e', fontSize: 12, marginTop: 2, fontWeight: 'bold' },
    navRanaIcon: { width: 28, height: 28, resizeMode: 'contain', marginBottom: 2, borderRadius: 360 },
});

export default HomeScreen;