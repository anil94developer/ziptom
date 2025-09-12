import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, ScrollView, Dimensions } from 'react-native';
import place from './../../../enums/place.json';

const { width } = Dimensions.get('window');

const ExploreScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Explore Rajasthan</Text>
      {place.map(city => (
        <View key={city.city} style={styles.citySection}>
          <Text style={styles.cityName}>{city.city}</Text>
          <FlatList
            horizontal
            data={city.places}
            keyExtractor={item => item.id.toString()}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 8 }}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Image source={{ uri: item.image }} style={styles.cardImage} />
                <Text style={styles.cardText}>{item.name}</Text>
              </View>
            )}
          />
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#18191d', paddingTop: 40 },
  title: { color: '#fff', fontSize: 26, fontWeight: 'bold', margin: 16 },
  citySection: { marginBottom: 24 },
  cityName: { color: '#ff554e', fontSize: 20, fontWeight: 'bold', marginLeft: 16, marginBottom: 8 },
  card: {
    width: width * 0.32, marginRight: 14, backgroundColor: '#23242a', borderRadius: 14,
    alignItems: 'center', padding: 10, elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4,
  },
  cardImage: { width: 70, height: 70, borderRadius: 12, marginBottom: 8, backgroundColor: '#fff' },
  cardText: { color: '#fff', fontSize: 13, textAlign: 'center' },
});

export default ExploreScreen;