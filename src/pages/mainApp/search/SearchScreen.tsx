import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, Image, TouchableOpacity, Dimensions } from 'react-native';
import place from '../../../enums/place.json';

const { width } = Dimensions.get('window');

const SearchScreen = ({ navigation }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  // Flatten all places with city info
  const allPlaces = place.flatMap(city =>
    city.places.map(p => ({
      ...p,
      city: city.city
    }))
  );

  const handleSearch = (text) => {
    setQuery(text);
    if (text.length === 0) {
      setResults([]);
      return;
    }
    const filtered = allPlaces.filter(item =>
      item.name.toLowerCase().includes(text.toLowerCase()) ||
      item.city.toLowerCase().includes(text.toLowerCase())
    );
    setResults(filtered);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search Places</Text>
      <View style={styles.searchBox}>
        <TextInput
          style={styles.searchInput}
          placeholder="Type place or city name..."
          placeholderTextColor="#888"
          value={query}
          onChangeText={handleSearch}
        />
      </View>
      <FlatList
        data={results}
        keyExtractor={item => `${item.city}-${item.id}`}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('CityDetails', { city: item.city })}
          >
            <Image source={{ uri: item.image }} style={styles.cardImage} />
            <View style={{ flex: 1 }}>
              <Text style={styles.cardText}>{item.name}</Text>
              <Text style={styles.cityText}>{item.city}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          query.length > 0 ? (
            <Text style={styles.noResult}>No results found.</Text>
          ) : null
        }
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#18191d', paddingTop: 40 },
  title: { color: '#fff', fontSize: 24, fontWeight: 'bold', margin: 16 },
  searchBox: {
    backgroundColor: '#23242a', borderRadius: 12, marginHorizontal: 16, marginBottom: 16,
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, height: 44,
  },
  searchInput: { flex: 1, color: '#fff', fontSize: 16 },
  card: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#23242a',
    borderRadius: 14, padding: 10, marginBottom: 14,
  },
  cardImage: { width: 60, height: 60, borderRadius: 12, marginRight: 12, backgroundColor: '#fff' },
  cardText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  cityText: { color: '#ff554e', fontSize: 13, marginTop: 2 },
  noResult: { color: '#888', textAlign: 'center', marginTop: 40, fontSize: 16 },
});

export default SearchScreen;