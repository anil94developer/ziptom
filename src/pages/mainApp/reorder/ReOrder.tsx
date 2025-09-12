import React from 'react';
import { View, Text, StyleSheet, Image, FlatList, ScrollView } from 'react-native';
import place from './../../../enums/place.json';

const ReOrderScreen = ({ route }) => {
 
    return (
      <View style={styles.container}>
        <Text style={styles.title}>City not found</Text>
      </View>
    );
  
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#18191d', paddingTop: 40 },
  title: { color: '#fff', fontSize: 28, fontWeight: 'bold', margin: 16 },
  section: { color: '#ff554e', fontSize: 18, fontWeight: 'bold', marginLeft: 16, marginTop: 20 },
  card: {
    width: 120, marginRight: 14, backgroundColor: '#23242a', borderRadius: 14,
    alignItems: 'center', padding: 10,
  },
  image: { width: 70, height: 70, borderRadius: 12, marginBottom: 8, backgroundColor: '#fff' },
  cardText: { color: '#fff', fontSize: 13, textAlign: 'center' },
});

export default ReOrderScreen;